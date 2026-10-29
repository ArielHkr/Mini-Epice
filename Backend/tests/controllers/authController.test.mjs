import { beforeEach, describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { register, login } from "../../controllers/authController.mjs";
import * as userModel from "../../models/userModel.mjs";

vi.mock("../../models/userModel.mjs", () => ({
  createUser: vi.fn(),
  findByEmail: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

let req;
let res;
let next;

beforeEach(() => {
  vi.resetAllMocks();

  req = {
    body: {
      name: "Ariel",
      email: "ariel@example.com",
      password: "Password123!",
    },
  };

  res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  next = vi.fn();
});

describe("register", () => {
  it("hashes the password and returns the created user", async () => {
    const user = {
      id: 1,
      name: "Ariel",
      email: "ariel@example.com",
      role: "user",
    };

    req.body.role = "admin";

    bcrypt.hash.mockResolvedValue("hashed-password");
    userModel.createUser.mockResolvedValue(user);

    await register(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledExactlyOnceWith(
      "Password123!",
      12
    );

    expect(userModel.createUser).toHaveBeenCalledExactlyOnceWith({
      name: "Ariel",
      email: "ariel@example.com",
      passwordHash: "hashed-password",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });

  it("passes a 409 error when the email is already used", async () => {
    bcrypt.hash.mockResolvedValue("hashed-password");

    const error = new Error("Duplicate email.");
    error.code = "23505";

    userModel.createUser.mockRejectedValue(error);

    await register(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        status: 409,
        message: "Email already in use.",
      })
    );

    expect(res.json).not.toHaveBeenCalled();
  });

  it("passes an unexpected error to the error middleware", async () => {
    const error = new Error("Database unavailable.");

    bcrypt.hash.mockResolvedValue("hashed-password");
    userModel.createUser.mockRejectedValue(error);

    await register(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("login", () => {
  const user = {
    id: 1,
    name: "Ariel",
    email: "ariel@example.com",
    passwordHash: "hashed-password",
    role: "admin",
  };

  it("returns a token and user information without the password hash", async () => {
    userModel.findByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("test-token");

    await login(req, res, next);

    expect(userModel.findByEmail).toHaveBeenCalledExactlyOnceWith(
      "ariel@example.com"
    );

    expect(bcrypt.compare).toHaveBeenCalledExactlyOnceWith(
      "Password123!",
      "hashed-password"
    );

    expect(jwt.sign).toHaveBeenCalledExactlyOnceWith(
      { id: 1 },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "test-token",
      user: {
        id: 1,
        name: "Ariel",
        email: "ariel@example.com",
        role: "admin",
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it.each([
    ["the email does not exist", null],
    ["the password is incorrect", user],
  ])("passes a 401 error when %s", async (_, foundUser) => {
    userModel.findByEmail.mockResolvedValue(foundUser);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        status: 401,
        message: "Invalid email or password.",
      })
    );

    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("passes an unexpected error to the error middleware", async () => {
    const error = new Error("Database unavailable.");

    userModel.findByEmail.mockRejectedValue(error);

    await login(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(error);
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});