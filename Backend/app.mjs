import express from "express";
import errorHandler from "./middlewares/errorHandler.mjs";
import itemRoutes from "./routes/itemRoutes.mjs";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";
import { fileURLToPath } from "node:url";
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
  ],
}));
app.use(express.json());

app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);

app.use("/api", (req, res, next) => {
  const error = new Error("Route not found.");
  error.status = 404;
  return next(error);
});

if (process.env.NODE_ENV === "production") {
  const frontendPath = fileURLToPath(
    new URL("../Frontend/dist/", import.meta.url)
  );

  app.use(express.static(frontendPath));

  app.use((req, res, next) => {
    if (req.method !== "GET" || !req.accepts("html")) {
      return next();
    }

    res.sendFile("index.html", { root: frontendPath }, (error) => {
      if (error) next(error);
    });
  });
}

app.use((req, res, next) => {
  const error = new Error("Route not found.");
  error.status = 404;
  next(error);
});

const port = Number(process.env.PORT || 3000);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});