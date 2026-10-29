import { Router } from "express";
import * as itemController from "../controllers/itemController.mjs";
import validateItem from "../middlewares/validateItem.mjs";
import validateItemId from "../middlewares/validateItemId.mjs"
const router = Router();

router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);
router.post("/", validateItem, itemController.addItem);
router.("/:id", validateItemId ,validateItem, itemController.updateItem);
export default router;