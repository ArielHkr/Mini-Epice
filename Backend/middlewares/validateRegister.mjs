export default function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};

  let message = "";

  if (typeof name !== "string" || !name.trim()) {
    message = "Name is required.";
  } else if (typeof email !== "string" || !email.includes("@")) {
    message = "A valid email is required.";
  } else if (typeof password !== "string" || password.length < 8) {
    message = "Password must contain at least 8 characters.";
  } else if (Buffer.byteLength(password, "utf8") > 72) {
    message = "Password is too long.";
  }

  if (message) {
    const error = new Error(message);
    error.status = 400;
    return next(error);
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
}