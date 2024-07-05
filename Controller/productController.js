const multer = require('multer'); // Import multer
const { body, validationResult } = require('express-validator');
const Product = require('../models/productModels');
const { ObjectId } = require('mongodb');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new product
const createProduct = async (req, res) => {
    try {
        // Create a new product object with automatic _id generation
        const product = new Product({
            _id: new ObjectId(), // Ensure ObjectId is imported correctly
            ...req.body // Assuming req.body contains other fields like name, price, etc.
        });

        // Save the product to the database
        await product.save();

        // Respond with success message and the saved product
        res.status(201).send({
            success: true,
            message: "Product added successfully!",
            product
        });
    } catch (error) {
        // Handle errors, including duplicate key error
        res.status(400).send({
            success: false,
            message: "Error adding product!",
            error: error.message
        });
    }
};

// Get all products with pagination
const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    try {
        results.totalItems = await Product.countDocuments().exec();
        results.totalPages = Math.ceil(results.totalItems / limit);
        results.currentPage = page;

        if (endIndex < results.totalItems) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.products = await Product.find().limit(limit).skip(startIndex).exec();
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a product
const updateProduct = [
    upload.single('image'),
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const { productName, brand, price, rating } = req.body;
            if (productName) product.productName = productName;
            if (brand) product.brand = brand;
            if (price) product.price = price;
            if (rating) product.rating = rating;
            if (req.file) product.image = req.file.buffer.toString('base64');

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
