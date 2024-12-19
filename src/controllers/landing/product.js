//controllers/landing/product.js

const Discount = require('../../models/discount');
const Product = require('../../models/product');
const ReviewWeb = require('../../models/reviewWeb');
const Marketplace = require('../../models/marketplace');
const { getCache, setCache } = require('../../utils/redisCache');

const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia
const path = require('path');


// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { page , limit } = req.body;
    
        // Convert `page` and `limit` to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        // Calculate the total number of documents
        const totalItems = await Product.countDocuments();
    
        // Fetch paginated products
        const products = await Product.find()
          .select('identityNumber name slug price thumbnail')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
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
        const formatProducts = products.map((product) => ({
          ...product.toObject(),
          createdAt: moment(product.createdAt).format('DD MMMM YYYY'), // Format creation date
          thumbnail: `${req.protocol}://${req.get('host')}/uploads/products/${product.identityNumber}/${path.basename(product.thumbnail)}`,
        }));
    
        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limitNumber);
    
        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          products: formatProducts,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching products for landing page',
          error: error.message,
        });
      }
};

// Get product by slug name / url
exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  const cacheKey = `prod:${slug}`;
  try {
    // Check Redis cache
    // const cachedSlugProd = await getCache(cacheKey);
    // if (cachedSlugProd) {
    //   return res.status(200).json(cachedSlugProd);
    // }

    // If not in cache, fetch from MongoDB
    const product = await Product
    .findOne({ slug:slug })
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get Discount data
    const discount = await Discount.findOne({ products: product._id, validUntil: { $gte: new Date() } })
    .select('name type value');
     
    product.finalPrice = product.price;
    // Calculate finalPrice based on discount
    if(!discount){
      product.discount = [];
      product.finalPrice = product.price;  // If no discount, set finalPrice to original price
    }else{
      product.discount = discount;
      product.finalPrice = discount.type === 'percentage'
        ? product.price - (product.price * discount.value) / 100
        : product.price - discount.value;
    }

     // detail product area
     const market = await Marketplace.findOne({ productId: product._id })
     .select('shopee tokopedia');

     if(!market){
       product.marketplace = [];
     }else{
       product.marketplace = market;
     }

    

    // Get Review Data
    const reviews = await ReviewWeb.find({ productId: product._id })
      .select('name rating reviewText photos videos createdAt')
      .sort({ createdAt: -1 }); // Optional: Sort by newest reviews

      const formattedReviews = (reviews || []).map((review) => {
        const formattedRevImages = review.photos.map((photo) =>
          `${req.protocol}://${req.get('host')}/${photo.replace(/\\/g, '/')}` // Format photos array
        );
        const formattedVideos = review.videos.map((video) => path.basename(video));
      
        return {
          ...review.toObject(),
          photos: formattedRevImages, // Replace photos with formatted URLs
          videos: formattedVideos,
          createdAt: moment(review.createdAt).format('DD MMMM YYYY'), // Format creation date
        };
      });

    
    const reviewsData = {
      totalItem : await ReviewWeb.countDocuments({ productId: product._id }),
      data : formattedReviews
    }

    // Store fetched data in Redis
    //await setCache(cacheKey, product, 3600); // Cache for 1 hour
    
    const formattedImages = product.images.map((image) => 
      `${req.protocol}://${req.get('host')}/${image.replace(/\\/g, '/')}` // Format each image path
    );

    const formatProduct = {
      ...product.toObject(), // Convert Mongoose document to a plain object
      createdAt: moment(product.createdAt).format('DD MMMM YYYY'), // Format creation date
      images: formattedImages,
      thumbnail: `${req.protocol}://${req.get('host')}/uploads/products/${product.identityNumber}/${path.basename(product.thumbnail)}`,
      detailProduct: `${req.protocol}://${req.get('host')}/uploads/products/${product.identityNumber}/${path.basename(product.detailProduct)}`
    };

    res.status(200).json({
      productData : formatProduct,
      reviewsData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};
