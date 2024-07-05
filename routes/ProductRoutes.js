const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');

// Create product with file upload
router.post('/add', productController.createProduct);

// Other routes...
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
