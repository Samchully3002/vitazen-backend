// server.js
const express = require('express');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoute.js');
const authRoutes = require('./routes/authRoute.js');
const productRoute = require('./routes/productRoute.js');
const discountRoute = require('./routes/discountRoute.js');
require('dotenv').config();

const app = express();

// Middleware JSON
app.use(express.json());

// Middleware form-urlencoded
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


// Connect to database
connectDB();

// Routes
app.use('/api', userRoutes);
app.use('/api', productRoute);
app.use('/api', discountRoute);
app.use('/api', authRoutes); // Generate token mockup


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
