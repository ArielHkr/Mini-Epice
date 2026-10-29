export default function requireAdmin(req, res, next) {
  if (!req.user) {
    const error = new Error("Authentication required.");
    error.status = 401;
    return next(error);
  }

  if (req.user.role !== "admin") {
    const error = new Error("Admin access required.");
    error.status = 403;
    return next(error);
  }

  return next();
}