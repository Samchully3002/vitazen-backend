const ReviewWeb = require('../models/reviewWeb');
const Product = require('../models/product');

exports.addReviewWeb = async (req, res) => {
  try {
    const { productId, orderNumber, name, email, rating, reviewText } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Process uploaded files
    const photos = req.files.photos?.map((file) => file.path) || [];
    const videos = req.files.videos?.map((file) => file.path) || [];

    // Save review to database
    const review = new ReviewWeb({
      productId,
      orderNumber,
      name,
      email,
      rating,
      reviewText,
      photos,
      videos,
    });
    
    await review.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Error saving review', error: error.message });
  }
};
