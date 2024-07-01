const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});


module.exports = mongoose.model('Register', AuthSchema);
