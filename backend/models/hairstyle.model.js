const mongoose = require('mongoose');

const hairStyleSchema = new mongoose.Schema({
  uniqueHairstyleId: { type: String, required: true, unique: true },
  hairstyleimage: { type: String,default:"https://www.latest-hairstyles.com/wp-content/uploads/short-hairstyles-for-men-16x9-1.jpg"},
  hairstyleName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  genderType: { type: String, enum: ['male', 'female', 'unisex'], required: true }

});

const HairStyleModel = mongoose.model('hairstyle', hairStyleSchema);

module.exports = { HairStyleModel };
