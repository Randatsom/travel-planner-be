const express = require('express')
const registerValidation = require('../validators/auth')
const UserController = require('../controllers/UserController')
const checkAuth = require("../utils/checkAuth");

const router = express.Router()

router.post("/register", registerValidation, UserController.register);

router.post("/login", UserController.login);

router.get("/checkAuth", checkAuth, UserController.checkAuth);

module.exports = router