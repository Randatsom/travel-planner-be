import express from "express";
import checkAuth from "../utils/checkAuth.js";
import * as UsersController from "../controllers/UsersController.js";

const router = express.Router();

router.get("/getAll", checkAuth, UsersController.getAll);

export default router;
