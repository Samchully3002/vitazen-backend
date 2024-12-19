//controllers/productController.js

const Product = require('../models/product');
const Discount = require('../models/discount');
const Marketplace = require('../models/marketplace');
const uploadProductImages = require('../middleware/uploadProductImages');
const generateSlug = require('../middleware/slug');
const { getCache, setCache } = require('../utils/redisCache');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia


// Create a new product
exports.createProduct = async (req, res) => {
  try {

    uploadProductImages(req, res, async (err) =>{
      
    generateSlug(req, res, async () => {
       const { identityNumber, name, brand, slug, manufacture, description, price, shopee, tokopedia } = req.body;

      // Validasi
        if (!name || !price ) {
         return res.status(400).json({ error: 'Name, price, and thumbnail are required' });
        }

          if (err) {
            return res.status(400).json({ message: err.message });
          }

     // Extract the image URLs from the request
      const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null; // Assuming the thumbnail is single
      const images = req.files.images ? req.files.images.map(file => file.path) : []; // For multiple images
      const detailProduct = req.files.detailProduct ? req.files.detailProduct[0].path : null; // Assuming the thumbnail is single
      const product = new Product({ 
        identityNumber: identityNumber,
        name: name,
        slug: slug,
        price: price,
        brand: brand,
        manufacture: manufacture,
        description: description,
        thumbnail, // Save the thumbnail path
        images,    // Save the images paths,
        detailProduct,
        createdAt: new Date()
       });

      
      // Save the product to the database 
      const savedProduct = await product.save();

      if(shopee || tokopedia){
        const marketplace = new Marketplace({ 
          productId: savedProduct._id,
          shopee: shopee,
          tokopedia: tokopedia,
          createdAt: new Date()
         });
         
         await marketplace.save();
      }

      // Respond with the newly created product
      res.status(201).json(product);

      });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
        .select('identityNumber name slug brand manufacture description price')
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
        .limit(limitNumber); // Limit products per page

      // Fetch Discount for Products
      for (let product of products) {
          // Get the current discount for the product
          const discount = await Discount.findOne({ products: product._id, validUntil: { $gte: new Date() } });
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
    const cachedSlugProd = await getCache(cacheKey);
    if (cachedSlugProd) {
      return res.status(200).json(cachedSlugProd);
    }

    // If not in cache, fetch from MongoDB
    const product = await Product
    .findOne({ slug:slug })
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // discount area

    const discount = await Discount.findOne({ products: product._id, validUntil: { $gte: new Date() } });
    product.finalPrice = product.price;
    
    if(!discount){
      product.discount = [];
      product.finalPrice = product.price;  // If no discount, set finalPrice to original price
    }else{
      product.discount = discount;
      product.finalPrice = discount.type === 'percentage'
        ? product.price - (product.price * discount.value) / 100
        : product.price - discount.value;
    }

    
    // Calculate finalPrice based on discount

    // detail product area
    const market = await Marketplace.findOne({ productId: product._id });

    if(!market){
      product.marketplace = [];
    }else{
      product.marketplace = market;
    }
  
    // Store fetched data in Redis
    await setCache(cacheKey, product, 3600); // Cache for 1 hour

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};


// Update Product By Id
exports.updateById = async (req, res) => {

};

// Delete Product By Id 
exports.deleteProductById = async (req, res) => {

};
