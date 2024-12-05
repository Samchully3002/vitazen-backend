// models/discount.js

const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    validFrom: { type: Date, required: false },
    validUntil: { type: Date, required: false }
  });
  
module.exports = mongoose.model('Discount', discountSchema);
  