const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
    },
    staff: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
    },
    package: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
      name: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['Initiated', 'Paid', 'In Progress', 'Completed', 'Failed'],
      default: 'Initiated',
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Transaction', transactionSchema);
