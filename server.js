import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validators/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello!!!");
});

app.post("/auth/register", registerValidation, UserController.register);

app.post("/auth/login", UserController.login);

app.get("/auth/checkAuth", checkAuth, UserController.checkAuth);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, (err) => {
            console.log("Server launched!");
        });
    })
    .catch(error => {
        console.log(error)
    })
