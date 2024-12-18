//controllers/promotionController.js

const Message = require('../models/message');
const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia
const path = require('path');


// Get all messages
exports.getAllMessage = async (req, res) => {
    try {
      const { page , limit } = req.body;
  
      // Convert `page` and `limit` to numbers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      // Calculate the total number of documents
      const totalItems = await Message.countDocuments();

       // get discounts data

      const messages = await Message.find()
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
        .limit(limitNumber); // Limit products per page

      const formattedMessages = messages.map((mes) => ({
        ...mes.toObject(),
        createdAt: moment(mes.createdAt).format('DD MMMM YYYY LT'), // Format creation date
        
      }));
      
        // Calculate total pages
      const totalPages = Math.ceil(totalItems / limitNumber);

        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          messages: formattedMessages,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
