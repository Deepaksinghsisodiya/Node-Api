const mongoose = require('mongoose');

// Product schema define karte hain
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        // required: true,
        trim: true
    },
    brand: {
        type: String,
        // required: true,
        trim: true
    },
    rating: {
        type: Number,
        // required: true,
        min: 0,
        max: 5
    },
    image: {
        type: String,
        trim: true,
        // required:true
    },
    price: {
        type: Number,
        // required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Model create karte hain
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
