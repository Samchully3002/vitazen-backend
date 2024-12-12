//controllers/promotionController.js

const Vsight = require('../models/vsight');
const generateSlug = require('../middleware/slug');
const fs = require('fs'); // Import the fs module


// Create new blog post
exports.createPost = async (req, res) => {
  try {

    generateSlug(req, res, async () => {
      const { title, body, image, slug, active } = req.body;
      
      // Process uploaded files
      const imagePath = req.files.image[0].path;
  
      const newBlog = new Vsight({
        title, body, image, active, slug, 
        image: imagePath
      });
  
      await newBlog.save();
   

    res.status(201).json({ message: 'Vsight post added successfully', newBlog });
});
  } catch (error) {
    res.status(500).json({ message: 'Error saving Vsight post', error: error.message });
  }
};


// Edit existing vsight post
exports.editPost = async (req, res) => {
  try {
    const { title, body, image, slug, active } = req.body;
    const imagePath = req.files ? req.files.image[0].path : undefined;

    const updateData = {
      title, body, active, slug, 
      image: imagePath || undefined // Only update image if a new one is provided
    };

    const updatedPost = await Vsight.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: 'Vsight post not found' });
    }
    res.status(200).json({ message: 'Vsight post updated successfully', updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Vsight post', error: error.message });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    // Find and delete the post by ID
    const deletedPost = await Vsight.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Vsight post not found' });
    }

    // Delete the associated image file
    const imagePath = `uploads/blog/${deletedPost.image}`; // Assuming image path is stored relative to /uploads/blog
    if (fs.existsSync(imagePath)) {
      const fs = require('fs');
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        }
      });
    }

    res.status(200).json({ message: 'Vsight post and associated image deleted successfully', deletedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Vsight post', error: error.message });
  }
};
