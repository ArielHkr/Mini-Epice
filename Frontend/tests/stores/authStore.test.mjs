// @vitest-environment jsdom

import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/stores/authStore.mjs";

const credentials = {
  email: "ariel@example.com",
  password: "Password123!",
};

const user = {
  id: 1,
  name: "Ariel",
  email: "ariel@example.com",
  role: "admin",
};

let fetchMock;

beforeEach(() => {
  sessionStorage.clear();
  setActivePinia(createPinia());

  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe("register", () => {
  it("sends the registration data and returns true", async () => {
    const store = useAuthStore();
    const userData = {
      name: "Ariel",
      ...credentials,
    };

    fetchMock.mockResolvedValue({ ok: true });

    const success = await store.register(userData);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    expect(success).toBe(true);
    expect(store.errorMessage).toBe("");
    expect(store.isLoading).toBe(false);
    expect(store.isAuthenticated).toBe(false);
  });

  it("shows an error when registration fails", async () => {
    const store = useAuthStore();

    fetchMock.mockResolvedValue({ ok: false });

    const success = await store.register({
      name: "Ariel",
      ...credentials,
    });

    expect(success).toBe(false);
    expect(store.errorMessage).toBe("Unable to create the account.");
    expect(store.isLoading).toBe(false);
  });
});

describe("login", () => {
  it("saves the user and token after a successful login", async () => {
    const store = useAuthStore();

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        user,
        token: "test-token",
      }),
    });

    const success = await store.login(credentials);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    expect(success).toBe(true);
    expect(store.user).toEqual(user);
    expect(store.token).toBe("test-token");
    expect(store.isAuthenticated).toBe(true);
    expect(store.isAdmin).toBe(true);
    expect(store.errorMessage).toBe("");
    expect(store.isLoading).toBe(false);

    expect(sessionStorage.getItem("token")).toBe("test-token");
    expect(JSON.parse(sessionStorage.getItem("user"))).toEqual(user);
  });

  it("rejects invalid credentials without creating a session", async () => {
    const store = useAuthStore();

    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
    });

    const success = await store.login(credentials);

    expect(success).toBe(false);
    expect(store.errorMessage).toBe("Invalid email or password.");
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("user")).toBeNull();
  });

  it("handles a network error and stops loading", async () => {
    const store = useAuthStore();

    fetchMock.mockRejectedValue(new Error("Failed to fetch"));

    const success = await store.login(credentials);

    expect(success).toBe(false);
    expect(store.errorMessage).toBe("Failed to fetch");
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
  });
});

describe("session", () => {
  it("restores the saved session when the store is created", () => {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", "saved-token");

    const store = useAuthStore();

    expect(store.user).toEqual(user);
    expect(store.token).toBe("saved-token");
    expect(store.isAuthenticated).toBe(true);
    expect(store.isAdmin).toBe(true);
  });

  it("requires both an admin role and a token for isAdmin", () => {
    const store = useAuthStore();

    store.user = { ...user, role: "user" };
    store.token = "test-token";

    expect(store.isAuthenticated).toBe(true);
    expect(store.isAdmin).toBe(false);

    store.user = { ...user, role: "admin" };

    expect(store.isAdmin).toBe(true);

    store.token = "";

    expect(store.isAdmin).toBe(false);
  });

  it("clears the user, token and stored session on logout", () => {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", "test-token");

    const store = useAuthStore();
    store.errorMessage = "Previous error.";

    store.logout();

    expect(store.user).toBeNull();
    expect(store.token).toBe("");
    expect(store.errorMessage).toBe("");
    expect(store.isAuthenticated).toBe(false);
    expect(store.isAdmin).toBe(false);
    expect(sessionStorage.getItem("user")).toBeNull();
    expect(sessionStorage.getItem("token")).toBeNull();
  });
});