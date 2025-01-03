//controllers/dashboardController.js

const Product = require('../models/product');
const Promotion = require('../models/promotion');

const Video = require('../models/reviewAd');
const Review = require('../models/reviewWeb');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        // Count total products
        const totalProducts = await Product.countDocuments();

        // Count products with a discount
        const productsWithDiscount = await Product.countDocuments({ discount: { $exists: true, $ne: null } });

        // Count product without discount
        const productsWithoutDiscount = await Product.countDocuments({ discount: { $exists: false } });

        res.status(200).json({
          success: true,
          totalProducts,
          productsWithDiscount,
          productsWithoutDiscount,

        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching product for dashboard',
          error: error.message,
        });
      }
};

// Get all promotion
exports.getPromotions = async (req, res) => {
    try {
        // Count total products
        const totalPromotions = await Promotion.countDocuments();

        // Count products with a discount
        const totalHeroSlider = await Promotion.countDocuments({type:'hero'});

        // Count product without discount
        const totalPromoBanner = await Promotion.countDocuments({type:'promo'});

        res.status(200).json({
          success: true,
          totalPromotions,
          totalHeroSlider,
          totalPromoBanner,

        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching product for dashboard',
          error: error.message,
        });
      }
};


// Get all review
exports.getReviews = async (req, res) => {
    try {
        // Count total review
        const totalWeb = await Review.countDocuments();

        // Count total video
        const totalVideo = await Video.countDocuments();

        // Count total shopee
        const totalShopee = 0;

        totalReview = totalWeb+totalVideo+totalShopee;
        

        res.status(200).json({
          success: true,
          totalReview,
          totalWeb,
          totalVideo,
          totalShopee
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching product for dashboard',
          error: error.message,
        });
      }
};