//controllers/discountController.js

const Discount = require('../models/discount');
const Product = require('../models/product');


// Create Discount
exports.createDiscount = async (req, res) => {
    try {
      const { productId, value, type, validFrom, validUntil } = req.body;
  
      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Create a new discount
      const discount = new Discount({
        productId,
        value,
        type,
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
      const discounts = await Discount.find();
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
