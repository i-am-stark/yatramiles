const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  images: { type: [String], required: true }, // Store array of image URLs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Package', packageSchema);
