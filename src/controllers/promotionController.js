//controllers/promotionController.js

const Promotion = require('../models/promotion');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia
const path = require('path');


// Create new promotion [hero|banner]
exports.createPromo = async (req, res) => {
  try {

      const { title, subtitle, textBtn, linkBtn, active, type } = req.body;
      
      // Process uploaded files
      const imagePath = req.files.image[0].path;
  
      const newPromo = new Promotion({
        title, subtitle, textBtn, linkBtn, active, type,
        image: imagePath
      });
  
      await newPromo.save();

    res.status(201).json({ message: 'Promotion added successfully', newPromo });
  } catch (error) {
    res.status(500).json({ message: 'Error saving promotion', error: error.message });
  }
};

// Get all hero
exports.getAllHeroBanner = async (req, res) => {
    try {
      const { page , limit } = req.body;
  
      // Convert `page` and `limit` to numbers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      // Calculate the total number of documents
      const totalItems = await Promotion.countDocuments({type:'hero'});

       // get discounts data

      const promotions = await Promotion.find({type:'hero'})
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
        .limit(limitNumber); // Limit products per page

      const formatPromotions = promotions.map((promo) => ({
        ...promo.toObject(),
        createdAt: moment(promo.createdAt).format('DD MMMM YYYY'), // Format creation date
        image: `${req.protocol}://${req.get('host')}/uploads/banner/${path.basename(promo.image)}`,
        
      }));
      
        // Calculate total pages
      const totalPages = Math.ceil(totalItems / limitNumber);

        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          promotions: formatPromotions,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Get all promo
exports.getAllPromoBanner = async (req, res) => {
  try {
    const { page , limit } = req.body;

    // Convert `page` and `limit` to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the total number of documents
    const totalItems = await Promotion.countDocuments({type:'promo'});

     // get discounts data

    const promotions = await Promotion.find({type:'promo'})
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
      .limit(limitNumber); // Limit products per page

    const formatPromotions = promotions.map((promo) => ({
      ...promo.toObject(),
      createdAt: moment(promo.createdAt).format('DD MMMM YYYY'), // Format creation date
      image: `${req.protocol}://${req.get('host')}/uploads/banner/${path.basename(promo.image)}`,
      
    }));
    
      // Calculate total promo
    const totalPages = Math.ceil(totalItems / limitNumber);

      res.status(200).json({
        success: true,
        currentPage: pageNumber,
        totalPages,
        totalItems,
        promotions: formatPromotions,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};