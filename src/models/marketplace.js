// models/marketplace.js

const mongoose = require('mongoose');

const marktetSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  shopee: { type: String, default: ''},
  tokopedia: { type: String, default: ''},
  createdAt: { type: Date, default: Date.now }
});


const Marketplace = mongoose.model('Marketplace', marktetSchema);
module.exports = Marketplace;
