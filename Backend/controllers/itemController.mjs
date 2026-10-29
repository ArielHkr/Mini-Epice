import * as itemModel from "../models/itemModel.mjs";

export async function getAllItems(req, res, next) {
  try {
    const items = await itemModel.findAllItems();

    return res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
}

export async function getItemById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      const error = new Error("Item ID must be a positive integer.");
      error.status = 400;
      return next(error);
    }

    const item = await itemModel.findById(id);

    if (!item) {
      const error = new Error("Item not found.");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json(item);
  } catch (error) {
    return next(error);
  }
}
export async function addItem(req, res, next) {
  try {
    const { name, quantity, unitPrice } = req.body;

    const item = await itemModel.createItem({
      name,
      quantity,
      unitPrice,
    });

    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
}