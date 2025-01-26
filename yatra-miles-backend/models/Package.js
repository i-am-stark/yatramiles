const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  packageType: { type: String, enum: ['Religious', 'Adventure', 'Other'], required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  packageOverview: { type: String },
  tourItinerary: { type: String },
  inclusions: { type: [String] }, // Array of strings for inclusions
  exclusions: { type: [String] }, // Array of strings for exclusions
  importantNotes: { type: [String] }, // Array of strings for important notes
  images: { type: [String] }, // Array of image paths
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);