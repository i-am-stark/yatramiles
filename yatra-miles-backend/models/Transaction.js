const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the customer, can be empty
      name: { type: String, required: true }, // Customer's name
      email: { type: String, required: true }, // Customer's email
      whatsappNumber: { type: String, required: true }, // Customer's WhatsApp number
    },
    staff: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the handler (staff)
      name: { type: String, required: true }, // Handler's name
    },
    travelingFrom: { type: String, required: true }, // Traveling from
    location: { type: String, required: true }, // Destination location
    noOfAdults: { type: Number, required: true }, // Number of adults
    noOfKids: { type: Number, required: true }, // Number of kids
    extraInfo: { type: String }, // Additional information
    tourDuration: { type: Number, required: true }, // Tour duration in days
    hotelType: { type: String, required: true }, // Hotel type
    budget: { type: Number, required: true }, // Budget
    package: {
      dropCity: { type: String, required: true }, // Equivalent to the dropCity attribute in the query
    },
    status: {
      type: String,
      enum: [
        'New',
        'Working',
        'Follow Up',
        'Advance Received',
        'Booking Pending',
        'Booked',
        'Only Query',
        'Completed',
      ], // Transaction status
      default: 'New',
    },
    totalRevenue: { type: Number, default: 0 }, // Total revenue
    hotelCost: { type: Number, default: 0 }, // Hotel cost
    cabCost: { type: Number, default: 0 }, // Cab cost
    otherCosts: [
      {
        name: { type: String, required: true }, // Name of the additional cost
        cost: { type: Number, required: true }, // Cost value
      },
    ], // Other costs
    advance: { type: Number, default: 0 }, // Advance payment
    tpc: { type: Number, default: 0 }, // Total package cost
    pendingAmount: { type: Number, default: 0 }, // Pending amount
    profit: { type: Number, default: 0 }, // Profit
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Transaction', transactionSchema);