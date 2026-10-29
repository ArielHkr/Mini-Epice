import { beforeEach, describe, it, expect, vi } from "vitest";
import { addItem } from "../../controllers/itemController.mjs";
import * as itemModel from "../../models/itemModel.mjs";

vi.mock("../../models/itemModel.mjs", () => ({
  createItem: vi.fn(),
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