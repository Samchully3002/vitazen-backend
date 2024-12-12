//controllers/promotionController.js

const Promotion = require('../models/promotion');

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