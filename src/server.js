// server.js
const express = require('express');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoute.js');
const authRoutes = require('./routes/authRoute.js');
const productRoute = require('./routes/productRoute.js');
const discountRoute = require('./routes/discountRoute.js');
const reviewRoute = require('./routes/reviewRoute.js');
const videoAdRoute = require('./routes/videoAdRoute.js');
const promoRoute = require('./routes/promoRoute.js');
const vsightRoute = require('./routes/vsightRoute.js');
const contactRoute = require('./routes/contactusRoute.js');
const landingPageRoute = require('./routes/landingPageRoute.js');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const app = express();

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Middleware JSON
app.use(express.json());

// Enable CORS for requests from localhost:5000
app.use(cors({ origin: 'http://localhost:5000' }));

// Middleware form-urlencoded
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


// Connect to database
connectDB();


// Routes CMS
app.use('/api', userRoutes);
app.use('/api', productRoute);
app.use('/api', discountRoute);
app.use('/api', reviewRoute);
app.use('/api', videoAdRoute);
app.use('/api', promoRoute);
app.use('/api', vsightRoute);
app.use('/api', contactRoute);
app.use('/api', authRoutes); // Generate token mockup


// Routes Landing Pages
app.use('/landing', landingPageRoute);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
