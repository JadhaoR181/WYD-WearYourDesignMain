const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoute = require('./routes/product'); // Assuming this is your existing product route // Import the new dashboard route
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', productRoute);
//app.use('/api/dashboard', dashboardRoute); // Add this line to use the dashboard route

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
