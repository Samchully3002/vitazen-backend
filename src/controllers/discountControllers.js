//controllers/discountController.js

const Discount = require('../models/discount');
const Product = require('../models/product');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia


// Create Discount
exports.createDiscount = async (req, res) => {
    try {
      const { products, value, type, validFrom, validUntil, name } = req.body;
  
      // Array to hold valid product IDs
      let validProductIds = [];

      // Check if each product ID exists
      for (let productId of products) {
        
        const product = await Product.findOne({identityNumber:productId});
        if (product) {
          validProductIds.push(product._id);  // Add valid product IDs to the array
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

  // Edit discounts
  exports.editDiscount = async (req, res) => {
    try {
      const { id } = req.params; // Discount ID from route parameters
      const { products, value, type, validFrom, validUntil, name } = req.body;
  
      // Find the discount to update
      const discount = await Discount.findById(id);
      if (!discount) {
        return res.status(404).json({ message: 'Discount not found' });
      }

      // Array to hold valid product IDs
      let validProductIds = [];
  
      // Validate product IDs
      for (let productId of products) {
        
        const product = await Product.findOne({identityNumber:productId});
        if (product) {
          validProductIds.push(product._id);  // Add valid product IDs to the array
        } else {
          // Handle invalid product ID (optional)
          console.warn(`Product with ID ${productId} not found.`);
        }
      }
  
      // Update the discount fields
      discount.products = validProductIds;
      discount.value = value;
      discount.type = type;
      discount.name = name;
      discount.validFrom = validFrom;
      discount.validUntil = validUntil;
  
      // Save the updated discount
      await discount.save();
  
      return res.status(200).json({
        message: 'Discount updated successfully',
        discount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

  // Delete discounts
  exports.deleteDiscount = async (req, res) => {
    try {
      const { id } = req.params; // Discount ID from route parameters
  
      // Find and delete the discount
      const discount = await Discount.findByIdAndDelete(id);
  
      if (!discount) {
        return res.status(404).json({ message: 'Discount not found' });
      }
  
      return res.status(200).json({
        message: 'Discount deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };


  // Discount by ID
exports.getDiscountById = async (req, res) => {
  try {
    const { id } = req.params; // Discount ID from route parameters

    // Find the discount by ID
    const discount = await Discount.findById(id);

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    return res.status(200).json({
      message: 'Discount retrieved successfully',
      discount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};