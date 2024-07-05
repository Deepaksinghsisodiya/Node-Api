const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

// Routes 
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/AuthRoutes');
const productRoute = require('./routes/ProductRoutes');
const loginRoute = require('./routes/AuthRoutes')
// Cors
app.use(cors());

// Middleware
app.use(bodyParser.json());
// Use routes
app.use('/users', userRoutes);
app.use('/register', authRoutes); // Assuming authRoutes handles both register and login
app.use('/product', productRoute);
app.use('/',loginRoute)
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full stack trace for debugging
    res.status(500).json({ error: { message: err.message } });
});

// MongoDB connection
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
