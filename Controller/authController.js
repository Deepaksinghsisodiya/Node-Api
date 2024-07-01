const jwt = require('jsonwebtoken');
const Register = require('../models/authModels');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.SECRET_KEY || 'loginKey';

// Function to create a new user
exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: { code: 11000, message: 'Email already exists' } });
        }
        // Create new user
        const user = new Register({ fullName, email, password });
        await user.save();

        res.json({ success: true });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: { code: 11000, message: 'Email already exists' } });
        } else {
            res.status(500).json({ error: { message: 'Internal Server Error' } });
        }
    }
};
// Function for user login
exports.getUserLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt for email:', email);

        const user = await Register.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Password match for email:', email);

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });

        console.log('JWT token generated for user:', email);

    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).send('Server error');
    }
};
