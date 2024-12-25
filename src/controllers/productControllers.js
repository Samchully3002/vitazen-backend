//controllers/productController.js

const Product = require('../models/product');
const Discount = require('../models/discount');
const Marketplace = require('../models/marketplace');
const uploadProductImages = require('../middleware/uploadProductImages');
const generateSlug = require('../middleware/slug');
const { getCache, setCache } = require('../utils/redisCache');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia
const fs = require('fs');
const path = require('path');


// Create a new product
exports.createProduct = async (req, res) => {
  try {
    // Handle file uploads and slug generation sequentially
    uploadProductImages(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      generateSlug(req, res, async () => {
        const {
          identityNumber,
          name,
          brand,
          slug,
          manufacture,
          description,
          price,
          shopee,
          tokopedia
        } = req.body;

        // Validation
        if (!name || !price) {
          return res.status(400).json({ error: 'Name and price are required' });
        }

        // Extract image URLs from the request
        const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null; // Assuming single thumbnail
        const images = req.files.images ? req.files.images.map(file => file.path) : []; // Multiple images
        const detailProduct = req.files.detailProduct ? req.files.detailProduct[0].path : null; // Single detail product image

        // Construct product object
        const product = new Product({
          identityNumber,
          name,
          slug,
          price,
          brand,
          manufacture,
          description,
          thumbnail,
          images,
          detailProduct,
          createdAt: new Date()
        });

        // Save the product to the database
        const savedProduct = await product.save();

        // Handle marketplace data if provided
        if (shopee || tokopedia) {
          const marketplace = new Marketplace({
            productId: savedProduct._id,
            shopee,
            tokopedia,
            createdAt: new Date()
          });
          await marketplace.save();
        }

        // Respond with the newly created product
        res.status(201).json({
          message: 'Product created successfully',
          product: savedProduct
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    //const cachedSlugProd = await getCache(cacheKey);
    // if (cachedSlugProd) {
    //   return res.status(200).json(cachedSlugProd);
    // }

    // If not in cache, fetch from MongoDB
    const product = await Product
    .findOne({ slug:slug })
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
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

    // discount area

    const discount = await Discount.findOne({ products: product._id, validUntil: { $gte: new Date() } });
    product.finalPrice = product.price;
    
    if(!discount){
      formatProduct.discount = [];
      formatProduct.finalPrice = product.price;  // If no discount, set finalPrice to original price
    }else{
      formatProduct.discount = discount;
      formatProduct.finalPrice = discount.type === 'percentage'
        ? formatProduct.price - (formatProduct.price * discount.value) / 100
        : formatProduct.price - discount.value;
    }

    
    // Calculate finalPrice based on discount

    // detail product area
    const market = await Marketplace.findOne({ productId: product._id });

    if(!market){
      formatProduct.marketplace = [];
    }else{
      formatProduct.marketplace = market;
    }
  
    // Store fetched data in Redis
   // await setCache(cacheKey, formatProduct, 3600); // Cache for 1 hour

    res.status(200).json(formatProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};


// Update Product By Id
exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Upload new images if provided
    uploadProductImages(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Extract updated data
      const { name, brand, manufacture, description, price, shopee, tokopedia } = req.body;

      // Validation
      if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
      }

      // Update images if provided
      const updatedFields = {
        name,
        brand,
        manufacture,
        description,
        price,
        updatedAt: new Date(),
      };

      if (req.files.thumbnail) {
        updatedFields.thumbnail = req.files.thumbnail[0].path;
      }

      if (req.files.images) {
        updatedFields.images = req.files.images.map(file => file.path);
      }

      if (req.files.detailProduct) {
        updatedFields.detailProduct = req.files.detailProduct[0].path;
      }

      // Update product in the database
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });

      // Update or create marketplace data
      if (shopee || tokopedia) {
        await Marketplace.findOneAndUpdate(
          { productId },
          { shopee, tokopedia, updatedAt: new Date() },
          { upsert: true, new: true }
        );
      }

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(updatedProduct);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete Product By Id 
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated files
    const deleteFile = (filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
          }
        });
      }
    };

    deleteFile(product.thumbnail);
    deleteFile(product.detailProduct);
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => deleteFile(imagePath));
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    // Delete associated marketplace data
    await Marketplace.deleteOne({ productId });
    
    // Remove the product from any discounts it is associated with
    await Discount.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );
    

    res.status(200).json({ message: 'Product and associated files deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get product identityNumber
exports.getProductIdentityNumber = async (req, res) => {
  const { id } = req.params;
  try {

    const product = await Product
    .findById(id)
    .select('identityNumber');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};
