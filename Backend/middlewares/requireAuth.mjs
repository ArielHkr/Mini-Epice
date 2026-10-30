import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.mjs";

export default async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    const error = new Error("Authentication required.");
    error.status = 401;
    return next(error);
  }

  try {
    const token = authorization.slice(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const user = await userModel.findById(decoded.id);

    if (!user) {
      const error = new Error("Authentication required.");
      error.status = 401;
      return next(error);
    }

    req.user = user;

    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      const authError = new Error("Invalid or expired token.");
      authError.status = 401;
      return next(authError);
    }

    return next(error);
  }
}