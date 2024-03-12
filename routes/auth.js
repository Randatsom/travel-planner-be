import express from "express";
import { registerValidation } from "../validators/auth.js";
import * as AuthController from "../controllers/AuthController.js";
import checkAuth from "../utils/checkAuth.js";

export const router = express.Router();

router.post("/register", registerValidation, AuthController.register);
router.post("/login", AuthController.login);
router.get("/checkAuth", checkAuth, AuthController.checkAuth);

export default router;
