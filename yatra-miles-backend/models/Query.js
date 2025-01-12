const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    travelingFrom: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    adults: { type: Number, required: true },
    kids: { type: Number },
    extraInfo: { type: String },
    duration: { type: Number, required: true },
    hotelType: { type: String },
    budget: { type: Number, required: true },
    status: { type: String, default: 'New' },
    handler: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String },
    },
  },
  { timestamps: true } // Enable createdAt and updatedAt
);

module.exports = mongoose.model('Query', querySchema);