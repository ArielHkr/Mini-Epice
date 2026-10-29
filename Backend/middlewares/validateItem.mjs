export default function validateItem(req, res, next) {
  const { name, quantity, unitPrice } = req.body || {};

  let message = "";

  if (typeof name !== "string" || name.trim() === "") {
    message = "Name must not be empty.";
  } else if (!Number.isFinite(quantity) || quantity < 1) {
    message = "Quantity must be greater than or equal to 1.";
  } else if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    message = "Unit price must be greater than 0.";
  }

  if (message) {
    const error = new Error(message);
    error.status = 400;
    return next(error);
  }

  req.body.name = name.trim();

  next();
}