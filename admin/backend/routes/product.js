const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add a new product
router.post('/add', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Fetch all products
// Fetch all products with pagination
router.get('/', async (req, res) => {
    try {
        // Get page and limit from query parameters (default to page 1 and limit 10)
        const { page = 1, limit = 12 } = req.query;
        
        // Convert page and limit to integers
        const pageNumber = parseInt(page, 12);
        const limitNumber = parseInt(limit, 12);

        // Fetch products with pagination
        const products = await Product.find()
            .skip((pageNumber - 1) * limitNumber)  // Skip products for the current page
            .limit(limitNumber);                   // Limit the number of products per page

        // Get total product count to calculate the number of pages
        const totalProducts = await Product.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // Send the paginated products and additional pagination info in the response
        res.status(200).json({
            products,
            totalProducts,
            totalPages,
            currentPage: pageNumber,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json("Product not found");
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
