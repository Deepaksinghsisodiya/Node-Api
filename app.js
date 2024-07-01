const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
// Routes 
const userRoutes = require('./routes/userRoutes')
const registerUser = require('./routes/authRoutes')
const getUserLogin = require('./routes/authRoutes')
// Cors
app.use(cors());

// Middleware
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/register', registerUser)
app.use('/login', getUserLogin)

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Internal Server Error' } });
});
// MongoDB connection
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
