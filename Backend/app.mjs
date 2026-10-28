import express from "express";
import errorHandler from "./middlewares/errorHandler.mjs";
import itemRoutes from "./routes/itemRoutes.mjs";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.use("/api/items", itemRoutes);
app.use((req, res, next) => {
  const error = new Error("Route not found.");
  error.status = 404;
  next(error);
});


app.use(errorHandler);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});