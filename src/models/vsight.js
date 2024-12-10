// models/vsight.js

const mongoose = require('mongoose');

const vsightSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  manufacture: { type: String, required: true },
  body: { type: String, required: true},
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

vsightSchema.index({ slug: 1 });

const Vsight = mongoose.model('Vsight', vsightSchema);
module.exports = Vsight;
