//controllers/landing/home.js

const Discount = require('../../models/discount');
const Product = require('../../models/product');
const ReviewWeb = require('../../models/reviewWeb');
const ReviewAd = require('../../models/reviewAd');
const Vsight = require('../../models/vsight');
const { getCache, setCache } = require('../../utils/redisCache');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia

moment.locale('id'); // Set locale globally

// Get hero slider section
exports.getHeroSlider = async (req, res) => {};

// Get hero section

// Get top 3 products section
exports.getHomeProducts = async (req, res) => {
    try {
        const { limit = 3 } = req.body;
    
        // Convert `page` and `limit` to numbers

        const limitNumber = parseInt(limit);
    
    
        // Fetch paginated products
        const products = await Product.find()
          .select('identityNumber name slug price thumbnail')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .limit(limitNumber); // Limit products per page

        // Fetch Discount for Products
        for (let product of products) {
            // Get the current discount for the product
            const discount = await Discount.findOne({ productId: product._id, validUntil: { $gte: new Date() } });
            product.finalPrice = product.price;

            if (discount) {
                product.finalPrice = discount.type === 'percentage'
                  ? product.price - (product.price * discount.value) / 100
                  : product.price - discount.value;
                product.discount = discount;
              } else {
                product.discount = [];
                product.finalPrice = product.price;  // If no discount, set finalPrice to original price
              }
        }
    
        res.status(200).json({
          success: true,
          products,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching products for landing page',
          error: error.message,
        });
      }
};

// Get home banner promo section

// Get home reviews website
exports.getAllReviewWeb = async (req, res) => {
    try {
        const { page , limit } = req.body;
    
        // Convert `page` and `limit` to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        // Calculate the total number of documents
        const totalItems = await ReviewWeb.countDocuments();
    
        // Fetch paginated products
        const reviews = await ReviewWeb.find()
          .select('name email rating reviewText photos createdAt')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
          .limit(limitNumber); // Limit products per page

        const formattedReviews = reviews.map((review) => ({
            ...review.toObject(),
            createdAt: moment(review.createdAt).format('DD MMMM YYYY'), // Format creation date
          }));

        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limitNumber);
    
        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          reviews:formattedReviews,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching products for landing page',
          error: error.message,
        });
      }
};

// Get home video advertisement 
exports.getAllVideoAd = async (req, res) => {
    try {
        const { page , limit } = req.body;
    
        // Convert `page` and `limit` to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        // Calculate the total number of documents
        const totalItems = await ReviewAd.countDocuments();
    
        // Fetch paginated products
        const reviews = await ReviewAd.find({active:true})
          .select('name active thumbnail video')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
          .limit(limitNumber); // Limit products per page

        const formattedReviews = reviews.map((review) => ({
            ...review.toObject(),
            createdAt: moment(review.createdAt).format('DD MMMM YYYY'), // Format creation date
          }));

        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limitNumber);
    
        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          videoReviews:formattedReviews,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching products for landing page',
          error: error.message,
        });
      }
};

// Get home our-partners

// Get home v-sight news
exports.getHomeSight = async (req, res) => {
    try {
        const { limit = 3 } = req.body;
    
        // Convert `page` and `limit` to numbers
        const limitNumber = parseInt(limit);
    
    
        // Fetch paginated products
        const vsights = await Vsight.find()
          .select('title slug body image')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .limit(limitNumber); // Limit products per page
    
    
        res.status(200).json({
          success: true,
          vsights,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching vsight for landing page',
          error: error.message,
        });
      }
};
