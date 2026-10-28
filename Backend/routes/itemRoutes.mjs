import { Router } from "express";
import * as itemControl from "../controllers/itemController.mjs" ;
import validateItem from "../middlewares/validateItem.mjs";
const router = Router();

router.get("/", itemControl.getAllItems);
router.get("/:id", itemControl.getItemById);
router.post("/", validateItem, itemControl.addItem);
export default router;