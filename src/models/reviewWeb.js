//models/reviewWeb

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String },
  photos: [{ type: String }],
  videos: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const ReviewWeb = mongoose.model('ReviewWeb', reviewSchema);
module.exports = ReviewWeb;
