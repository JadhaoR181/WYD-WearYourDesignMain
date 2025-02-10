// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    // Add other fields as necessary
});

module.exports = mongoose.model('Product', productSchema);
