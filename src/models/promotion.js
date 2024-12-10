// models/promotion.js

const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    promoId: { type: String, required: true },
    promoName: { type: String, required: true },
    promoDescription: { type: Date, required: false },
    promoImage: { type: String, required: true },
    active: {type: String, enum: ['true', 'false'], required: true},
    type: {type: String, enum: ['hero', 'banner'], required: true},
    createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Promotion', promotionSchema);
  