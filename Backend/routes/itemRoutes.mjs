import { Router } from "express";
import * as itemController from "../controllers/itemController.mjs";
import validateItem from "../middlewares/validateItem.mjs";
import validateItemId from "../middlewares/validateItemId.mjs"
import requireAuth from "../middlewares/requireAuth.mjs";
import requireAdmin from "../middlewares/requireAdmin.mjs";
const router = Router();

router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);
router.post("/", requireAuth, requireAdmin, validateItem, itemController.addItem);
router.put("/:id", requireAuth, requireAdmin, validateItemId ,validateItem, itemController.updateItem);
router.delete("/:id", requireAuth, requireAdmin, validateItemId, itemController.deleteItem);

export default router;