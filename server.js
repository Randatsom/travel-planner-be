import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import eventsRoutes from "./routes/events.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!!!");
});

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/users", usersRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, (err) => {
      console.log("Server launched!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
