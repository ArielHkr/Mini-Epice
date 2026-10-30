export default function validateLogin(req, res, next) {
  const { email, password } = req.body || {};

  let message = "";

  if (typeof email !== "string" || !email.trim()) {
    message = "Email is required.";
  } else if (typeof password !== "string" || password === "") {
    message = "Password is required.";
  } else if (Buffer.byteLength(password, "utf8") > 72) {
    message = "Password is too long.";
  }

  if (message) {
    const error = new Error(message);
    error.status = 400;
    return next(error);
  }

  req.body.email = email.trim().toLowerCase();

  return next();
}