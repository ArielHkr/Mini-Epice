import { Router } from "express";
import { getAllItems, getItemById,} from "../controllers/itemController.mjs";

const router = Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);

export default router;