const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Package = require('../models/Package');

// Create a Transaction (Staff Only)
exports.createTransaction = async (req, res) => {
  try {
    const { customerId, packageId, status } = req.body;

    // Fetch customer and package details
    const customer = await User.findById(customerId);
    const travelPackage = await Package.findById(packageId);

    if (!customer || !travelPackage) {
      return res.status(404).json({ message: 'Customer or Package not found' });
    }

    const newTransaction = await Transaction.create({
      customer: { id: customer._id, name: customer.name },
      staff: { id: req.user._id, name: req.user.name }, // Logged-in staff
      package: { id: travelPackage._id, name: travelPackage.name },
      status: status || 'Initiated',
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

// Get All Transactions
exports.getTransactions = async (req, res) => {
  try {
    let transactions;

    if (req.user.role === 'Owner') {
      // Owner: See all transactions
      transactions = await Transaction.find();
    } else if (req.user.role === 'Staff') {
      // Staff: See transactions they created
      transactions = await Transaction.find({ 'staff.id': req.user._id });
    } else if (req.user.role === 'Customer') {
      // Customer: See their own transactions
      transactions = await Transaction.find({ 'customer.id': req.user._id });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Update Transaction Status (Staff Only)
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
};
