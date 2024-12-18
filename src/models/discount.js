// models/discount.js

const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    validFrom: { type: Date, required: false },
    validUntil: { type: Date, required: false }
  });
  
module.exports = mongoose.model('Discount', discountSchema);
  