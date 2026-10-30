// @vitest-environment jsdom

import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useItemStore } from "../../src/stores/itemStore.mjs";
import { useAuthStore } from "../../src/stores/authStore.mjs";

const Url = "http://localhost:3000/api/items";

const item = {
  id: 1,
  name: "Apple",
  quantity: 2,
  unitPrice: 1.5,
};

const itemData = {
  name: "Apple",
  quantity: 2,
  unitPrice: 1.5,
};

let store;
let fetchMock;

beforeEach(() => {
  sessionStorage.clear();
  setActivePinia(createPinia());

  const authStore = useAuthStore();
  authStore.token = "test-token";

  store = useItemStore();

  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe("loadItems", () => {
  it("loads the items returned by the API", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [item],
    });

    await store.loadItems();

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(Url);
    expect(store.items).toEqual([item]);
    expect(store.errorMessage).toBe("");
    expect(store.isLoading).toBe(false);
  });

  it("shows an error when loading fails", async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await store.loadItems();

    expect(store.errorMessage).toBe("Unable to retrieve items.");
    expect(store.isLoading).toBe(false);
  });
});

describe("getItemById", () => {
  it("returns the requested item", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => item,
    });

    const result = await store.getItemById(1);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(`${Url}/1`);
    expect(result).toEqual(item);
  });

  it("throws an error when the item does not exist", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(store.getItemById(99)).rejects.toThrow(
      "Item not found."
    );
  });
});

describe("addItem", () => {
  it("sends the token and adds the created item to the list", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => item,
    });

    const success = await store.addItem(itemData);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(Url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify(itemData),
    });

    expect(success).toBe(true);
    expect(store.items).toEqual([item]);
    expect(store.saveError).toBe("");
    expect(store.isSaving).toBe(false);
  });
});

describe("updateItem", () => {
  it("sends the token and replaces only the updated item", async () => {
    const otherItem = {
      id: 2,
      name: "Rice",
      quantity: 1,
      unitPrice: 4,
    };

    store.items = [{ ...item }, otherItem];

    const changes = {
      name: "Green apple",
      quantity: 5,
      unitPrice: 2,
    };

    const updatedItem = { id: 1, ...changes };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => updatedItem,
    });

    const success = await store.updateItem(1, changes);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(`${Url}/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify(changes),
    });

    expect(success).toBe(true);
    expect(store.items).toEqual([updatedItem, otherItem]);
    expect(store.saveError).toBe("");
    expect(store.isSaving).toBe(false);
  });
});

describe("deleteItem", () => {
  it("sends the token and removes only the deleted item", async () => {
    const otherItem = {
      id: 2,
      name: "Rice",
      quantity: 1,
      unitPrice: 4,
    };

    store.items = [{ ...item }, otherItem];

    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
    });

    const success = await store.deleteItem("1");

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(`${Url}/1`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(success).toBe(true);
    expect(store.items).toEqual([otherItem]);
    expect(store.deleteError).toBe("");
    expect(store.deletingId).toBeNull();
  });
});

describe("failed changes", () => {
  it.each([
    [
      "addItem",
      [itemData],
      "saveError",
      "Unable to add the item.",
    ],
    [
      "updateItem",
      [1, { ...itemData, quantity: 5 }],
      "saveError",
      "Unable to update the item.",
    ],
    [
      "deleteItem",
      [1],
      "deleteError",
      "Unable to delete the item.",
    ],
  ])(
    "%s preserves the list when the API refuses the request",
    async (action, args, errorField, message) => {
      store.items = [{ ...item }];

      fetchMock.mockResolvedValue({
        ok: false,
        status: 403,
      });

      const success = await store[action](...args);

      expect(success).toBe(false);
      expect(store.items).toEqual([item]);
      expect(store[errorField]).toBe(message);
      expect(store.isSaving).toBe(false);
      expect(store.deletingId).toBeNull();
    }
  );
});