import { Router } from "express";
import * as authController from "../controllers/authController.mjs";
import validateRegister from "../middlewares/validateRegister.mjs";
import validateLogin from "../middlewares/validateLogin.mjs";

const router = Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

export default router;