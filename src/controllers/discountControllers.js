//controllers/discountController.js

const Discount = require('../models/discount');
const Product = require('../models/product');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia


// Create Discount
exports.createDiscount = async (req, res) => {
    try {
      const { productIds, value, type, validFrom, validUntil, name } = req.body;
  
      // Array to hold valid product IDs
      let validProductIds = [];

      // Check if each product ID exists
      for (let productId of productIds) {
        const product = await Product.findById(productId);
        if (product) {
          validProductIds.push(productId);  // Add valid product IDs to the array
        } else {
          // Handle invalid product ID (optional)
          console.warn(`Product with ID ${productId} not found.`);
        }
      }
        
      // Create a new discount
      const discount = new Discount({
        products: validProductIds,
        value,
        type,
        name,
        validFrom,
        validUntil,
      });
  
      // Save the discount
      await discount.save();
  
      return res.status(201).json({
        message: 'Discount created successfully',
        discount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

// Get all discount
exports.getAllDiscount = async (req, res) => {
    try {
      const { page , limit } = req.body;
  
      // Convert `page` and `limit` to numbers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      // Calculate the total number of documents
      const totalItems = await Discount.countDocuments();

       // get discounts data

      const discounts = await Discount.find()
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
        .limit(limitNumber); // Limit products per page

      const formatDiscounts = discounts.map((disc) => ({
        ...disc.toObject(),
        validFrom: moment(disc.validFrom).format('DD MMMM YYYY'), // Format creation date
        validUntil: moment(disc.validUntil).format('DD MMMM YYYY'), 
      }));
      
        // Calculate total pages
      const totalPages = Math.ceil(totalItems / limitNumber);

        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          discounts: formatDiscounts,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
