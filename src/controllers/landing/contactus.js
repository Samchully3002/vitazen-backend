//controllers/landing/contactus.js

const Message = require('../../models/message');


// Create Message
exports.submitMessage = async (req, res) => {
    try {
      const { name,email,body } = req.body;

      if (!name || !email || !body) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
       }
  
      // Create a new message
      const message = new Message({
        name,
        email,
        body,
      });
      
  
      // Save the message
      await message.save();
  
      return res.status(201).json({
        status: 'success',
        message: 'Message already sent',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

// Get all message
exports.getAllMessage = async (req, res) => {
    try {
      const messages = await Message.find();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
