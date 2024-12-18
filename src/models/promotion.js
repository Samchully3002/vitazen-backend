// models/promotion.js

const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    textBtn: { type: String, required: false },
    linkBtn: { type: String, required: false },
    image: { type: String, required: true },
    active: {type: String, enum: ['true', 'false'], required: true},
    type: {type: String, enum: ['hero', 'promo'], required: true},
    createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Promotion', promotionSchema);
  