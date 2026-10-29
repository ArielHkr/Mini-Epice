import { describe, it, expect, vi } from "vitest";
import validateItem from "../../middlewares/validateItem.mjs";
describe("validateItem", () => {
  it("accepts a valid item and trims its name", () => {
    const req = {
      body: {
        name: "  Apple  ",
        quantity: 1,
        unitPrice: 0.01,
      },
    };

    const next = vi.fn();

    validateItem(req, {}, next);

    expect(next).toHaveBeenCalledExactlyOnceWith();
    expect(req.body.name).toBe("Apple");
  });

  const invalidItems = [
  ["blank name", { name: "   ", quantity: 1, unitPrice: 2 }],
  ["zero quantity", { name: "Apple", quantity: 0, unitPrice: 2 }],
  ["zero price", { name: "Apple", quantity: 1, unitPrice: 0 }],
];

  it.each(invalidItems)("rejects an item with %s", (label, body) => {
    const req = { body };
    const next = vi.fn();

    validateItem(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(400);
    expect(error.message).toBeTruthy();
  });
});