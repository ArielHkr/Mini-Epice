export default function validateItemId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    const error = new Error("Item ID must be a positive integer.");
    error.status = 400;
    return next(error);
  }

  next();
}