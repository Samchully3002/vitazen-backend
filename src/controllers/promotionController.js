//controllers/promotionController.js

const Promotion = require('../models/promotion');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia
const path = require('path');
const fs = require('fs');


// Create new promotion [hero|banner]
exports.createPromo = async (req, res) => {
  try {

      const { title, image, subtitle, textBtn, linkBtn, active, type } = req.body;
      
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

// Edit Promotion
exports.editPromo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, subtitle, textBtn, linkBtn, active, type } = req.body;

    let imagePath;
    if (req.file) { // req.file will be populated only if an image is uploaded
        imagePath = req.files.image[0].path; 
    }
  


    const promo = await Promotion.findById(id);
    if (!promo) {
      return res.status(404).json({ message: 'Promotion not found' });
    }



    const updatedFields = {
      title, subtitle, textBtn, linkBtn, active, type,
      updatedAt: new Date(),
    };

    if (imagePath) {
      updatedFields.image = imagePath;
  }


 
    const updatedPromotion = await Promotion.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({ message: 'Promotion updated successfully', promo });
  } catch (error) {
    res.status(500).json({ message: 'Error updating promotion', error: error.message });
  }
};

// Delete Promotion
exports.deletePromo = async (req, res) => {
    try {
          const { id } = req.params; // Discount ID from route parameters
      
          // Find and delete the discount
          const promo = await Promotion.findByIdAndDelete(id);
      
          if (!promo) {
            return res.status(404).json({ message: 'Promotion not found' });
          }
      
          return res.status(200).json({
            message: 'Promotion deleted successfully',
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: error.message });
        }
};

exports.getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;  // Get the ID from the request parameters

    // Find the promotion with the provided ID
    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Hero banner not found',
      });
    }

    // Format the promotion data before sending the response
    const formattedPromotion = {
      ...promotion.toObject(),
      createdAt: moment(promotion.createdAt).format('DD MMMM YYYY'), // Format the creation date
      image: `${req.protocol}://${req.get('host')}/uploads/banner/${path.basename(promotion.image)}`, // Construct image URL
    };

    // Return the response with the formatted promotion
    res.status(200).json({
      success: true,
      promotion: formattedPromotion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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