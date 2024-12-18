const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g., "5 Days 4 Nights"
    locations: { type: [String], required: true }, // e.g., ["Paris", "London", "Rome"]
    media: { type: [String], default: [] }, // URLs of images/videos
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Staff/Owner
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Package', packageSchema);