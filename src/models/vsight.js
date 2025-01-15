// models/vsight.js

const mongoose = require('mongoose');

const vsightSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  body: { type: String, required: true},
  active: {type: String, enum: ['true', 'false'], required: true},
  image: { type: String, required: true },
  category: [{ type: String }],
  favourite: {type: String, enum: ['true', 'false']},
  createdAt: { type: Date, default: Date.now }
});

vsightSchema.index({ slug: 1 });

const Vsight = mongoose.model('Vsight', vsightSchema);
module.exports = Vsight;
