const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController')
// Create User 
router.post('/', authController.registerUser)
// Get Login
router.post('/login', authController.getUserLogin)

module.exports = router