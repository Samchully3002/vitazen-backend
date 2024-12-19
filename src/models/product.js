// models/product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  identityNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  manufacture: { type: String, required: true },
  description: { type: String, required: true},
  price: { type: Number, required: true},
  finalPrice: { type: Number},
  thumbnail: { type: String, required: true },
  detailProduct: { type: String, required: true },
  images: [{ type: String }],
  discount: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }, // Reference to Discount
  marketplace: { type: mongoose.Schema.Types.ObjectId, ref: 'Marketplace' }, // Reference to Discount
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ identityNumber: 1 });
productSchema.index({ slug: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
