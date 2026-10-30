import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.mjs";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userModel.createUser({
      name,
      email,
      passwordHash,
    });

    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "23505") {
      const conflictError = new Error("Email already in use.");
      conflictError.status = 409;
      return next(conflictError);
    }

    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);

    if (!user) {
      const error = new Error("Invalid email or password.");
      error.status = 401;
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password.");
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}