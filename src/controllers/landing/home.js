//controllers/landing/home.js

const Discount = require('../../models/discount');
const Product = require('../../models/product');
const ReviewWeb = require('../../models/reviewWeb');
const ReviewAd = require('../../models/reviewAd');
const Vsight = require('../../models/vsight');
const Promotion = require('../../models/promotion');
const { getCache, setCache } = require('../../utils/redisCache');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia
const path = require('path');

moment.locale('id'); // Set locale globally

// Get hero slider section
exports.getHeroSlider = async (req, res) => {
  try {
      const { limit = 3 } = req.body;
  
      // Convert `page` and `limit` to numbers
      const limitNumber = parseInt(limit);
  
      // Fetch paginated products
      const heroes = await Promotion.find({active:true, type:'hero'})
        .select('title subtitle textBtn linkBtn image')
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .limit(limitNumber); // Limit products per page

        const formattedHeroes = heroes.map((review) => ({
          ...review.toObject(),
          createdAt: moment(review.createdAt).format('DD MMMM YYYY'), // Format creation date
          image: `${req.protocol}://${req.get('host')}/uploads/banner/${path.basename(review.image)}`,
        }));

      res.status(200).json({
        success: true,
        heroes : formattedHeroes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching hero slider for landing page',
        error: error.message,
      });
    }
};

// Get promo  section
exports.getPromoSection = async (req, res) => {
  try {
      const { limit = 3 } = req.body;
  
      // Convert `page` and `limit` to numbers
      const limitNumber = parseInt(limit);
  
      // Fetch paginated products
      const promos = await Promotion.find({active:true, type:'promo'})
        .select('title subtitle textBtn linkBtn image')
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .limit(limitNumber); // Limit products per page

        
        const formattPromos = promos.map((review) => ({
          ...review.toObject(),
          createdAt: moment(review.createdAt).format('DD MMMM YYYY'), // Format creation date
          image: `${req.protocol}://${req.get('host')}/uploads/banner/${path.basename(review.image)}`,
        }));
  
      res.status(200).json({
        success: true,
        promos:formattPromos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching promo section for landing page',
        error: error.message,
      });
    }
};

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
            const discount = await Discount.findOne({ products: product._id, validUntil: { $gte: new Date() } })
            .select('type value validFrom validUntil');
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

        const formatProducts = products.map((product) => ({
          ...product.toObject(),
          createdAt: moment(product.createdAt).format('DD MMMM YYYY'), // Format creation date
          thumbnail: `${req.protocol}://${req.get('host')}/uploads/products/${product.identityNumber}/${path.basename(product.thumbnail)}`,
        }));
    
        res.status(200).json({
          success: true,
          products:formatProducts,
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
            photos: `${req.protocol}://${req.get('host')}/uploads/reviews/${path.basename(review.photos[0])}`,
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
          message: 'Error fetching reviews web for landing page',
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
            thumbnail: `${req.protocol}://${req.get('host')}/uploads/videos/${path.basename(review.thumbnail)}`,
            video : path.basename(review.video)
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
        const vsights = await Vsight.find({active:true})
          .select('title slug body image')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .limit(limitNumber); // Limit products per page

          const formatVsight = vsights.map((v) => ({
            ...v.toObject(),
            createdAt: moment(v.createdAt).format('DD MMMM YYYY'), // Format creation date
            image: `${req.protocol}://${req.get('host')}/uploads/blog/${path.basename(v.image)}`,
          }));
    
        res.status(200).json({
          success: true,
          vsights: formatVsight,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching vsight for landing page',
          error: error.message,
        });
      }
};
