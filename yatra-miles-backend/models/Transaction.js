const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the customer
      name: { type: String, required: true }, // Customer's name
    },
    staff: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the staff
      name: { type: String, required: true }, // Staff's name
    },
    package: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true }, // Reference to the package
      name: { type: String, required: true }, // Package name
    },
    status: {
      type: String,
      enum: ['Initiated', 'Paid', 'In Progress', 'Completed', 'Failed'], // Transaction status
      default: 'Initiated',
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Transaction', transactionSchema);
