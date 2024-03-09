require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const path = require("path");

// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/auth', authRoutes)

// Serve the static build files
app.use(express.static(path.join(__dirname, "build")));

// Handle all other routes and serve the index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// connect to db
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