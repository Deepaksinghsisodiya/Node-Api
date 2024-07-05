const jwt = require('jsonwebtoken');
const Register = require('../models/authModels');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.SECRET_KEY || 'loginKey';

// Function to create a new user and log them in
exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Check if email already exists
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: { code: 11000, message: 'Email address already registered' } });
        }

        // Hash the password before saving
        // TODO
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new Register({ fullName, email, password });
        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                password: user.password,
            }
        };

        // Generate JWT token and send response
        jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ success: true, token, user: payload.user });
            }
        );
    } catch (error) {
        console.error('Error during user registration:', error);
        if (error.code === 11000) {
            res.status(400).json({ error: { code: 11000, message: 'Email address already registered' } });
        } else {
            res.status(500).json({ error: { message: 'Internal Server Error' } });
        }
    }
};

// Function for user login
exports.getUserLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email' });
        }
        // TODO
        // const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch)
        // if (!isMatch) {
        //     return res.status(400).json({ msg: 'Invalid Password' });
        // }

        // Compare the plaintext password
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        const payload = {
            user: {
                id: user.id,
                email: user.email,
                password: user.password,
            }
        };

        jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ success: true, token, user: payload.user });
            }
        );
    } catch (err) {
        console.error('Error during user login:', err.message);
        res.status(500).send('Server error');
    }
};
