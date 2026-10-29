import { beforeEach, describe, it, expect, vi } from "vitest";
import { addItem, updateItem,deleteItem } from "../../controllers/itemController.mjs";
import * as itemModel from "../../models/itemModel.mjs";

vi.mock("../../models/itemModel.mjs", () => ({
  createItem: vi.fn(),
  updateItem: vi.fn(),
 deleteItem: vi.fn(),
}));

describe("addItem", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.resetAllMocks();

    req = {
      body: {
        name: "Apple",
        quantity: 2,
        unitPrice: 1.5,
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it("returns status 201 and the created item", async () => {
    const createdItem = {
      id: 1,
      name: "Apple",
      quantity: "2",
      unitPrice: "1.50",
    };

    itemModel.createItem.mockResolvedValue(createdItem);

    await addItem(req, res, next);

    expect(itemModel.createItem).toHaveBeenCalledExactlyOnceWith({
      name: "Apple",
      quantity: 2,
      unitPrice: 1.5,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdItem);
    expect(next).not.toHaveBeenCalled();
  });

  it("passes a model error to the error middleware", async () => {
    const error = new Error("Database unavailable.");

    itemModel.createItem.mockRejectedValue(error);

    await addItem(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("updateItem", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.resetAllMocks();

    req = {
      params: { id: "1" },
      body: {
        name: "Apple",
        quantity: 5,
        unitPrice: 2.5,
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it("returns status 200 and the updated item", async () => {
    const updatedItem = {
      id: 1,
      name: "Apple",
      quantity: "5",
      unitPrice: "2.50",
    };

    itemModel.updateItem.mockResolvedValue(updatedItem);

    await updateItem(req, res, next);

    expect(itemModel.updateItem).toHaveBeenCalledExactlyOnceWith(
      1,
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedItem);
    expect(next).not.toHaveBeenCalled();
  });

  it("passes a 404 error to next when the item does not exist", async () => {
    itemModel.updateItem.mockResolvedValue(null);

    await updateItem(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("passes a model error to next", async () => {
    const error = new Error("Database unavailable.");

    itemModel.updateItem.mockRejectedValue(error);

    await updateItem(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("deleteItem", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.resetAllMocks();

    req = {
      params: { id: "1" },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it("returns status 204 when the item is deleted", async () => {
    itemModel.deleteItem.mockResolvedValue({ id: 1 });

    await deleteItem(req, res, next);

    expect(itemModel.deleteItem).toHaveBeenCalledExactlyOnceWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledExactlyOnceWith();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("passes a 404 error when the item does not exist", async () => {
    itemModel.deleteItem.mockResolvedValue(null);

    await deleteItem(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        status: 404,
        message: "Item not found.",
      }),
    );

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("passes a model error to the error middleware", async () => {
    const error = new Error("Database unavailable.");
    itemModel.deleteItem.mockRejectedValue(error);

    await deleteItem(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});