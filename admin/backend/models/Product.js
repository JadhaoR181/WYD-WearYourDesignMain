const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: { 
        type: Number,
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
}, 
{ timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
