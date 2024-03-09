require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const serveStatic = require('./serve-static');

// express app
const app = express()

// static routes
serveStatic(app);

// middleware
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/auth', authRoutes)


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