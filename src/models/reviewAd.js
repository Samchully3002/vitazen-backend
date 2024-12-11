//models/reviewAd

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true },  // Whether the video is active
  thumbnail: { type: String, required: true },  // Path to the thumbnail
  video: { type: String, required: true },  // Path to the video file
  createdAt: { type: Date, default: Date.now }
});

const ReviewAd = mongoose.model('ReviewAd', reviewSchema);
module.exports = ReviewAd;