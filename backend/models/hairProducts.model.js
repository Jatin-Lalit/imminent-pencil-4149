const mongoose = require('mongoose');

const hairProductSchema = new mongoose.Schema({
  uniqueHairProductId: { type: String, required: true, unique: true },
  hairProductImage: { type: String, default: "https://example.com/default-image.jpg" },
  hairProductName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  genderType: { type: String, enum: ['male', 'Women', 'unisex'], required: true }
});

const HairProductModel = mongoose.model('hairProduct', hairProductSchema);

module.exports = { HairProductModel };
