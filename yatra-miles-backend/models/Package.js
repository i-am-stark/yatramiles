const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // Changed to number for consistency
  images: { type: [String], required: true }, // Array of image paths
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Package', packageSchema);
