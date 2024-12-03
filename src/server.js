// server.js
const express = require('express');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoute.js');
const authRoutes = require('./routes/authRoute.js');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;


// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes); // Generate token mockup


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
