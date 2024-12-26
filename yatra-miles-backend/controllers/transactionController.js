const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Package = require('../models/Package');
const sendEmail = require('../utils/sendEmail');

// Create Transaction by Staff or Owner
exports.createTransaction = async (req, res) => {
  try {
    const { customerId, packageId, status } = req.body;

    const customer = await User.findById(customerId);
    const travelPackage = await Package.findById(packageId);

    if (!customer || !travelPackage) {
      return res.status(404).json({ message: 'Customer or Package not found' });
    }

    // Create transaction with nested objects for customer, staff, and package
    const newTransaction = await Transaction.create({
      customer: { id: customer._id, name: customer.name },
      staff: { id: req.user._id, name: req.user.name },
      package: { id: travelPackage._id, name: travelPackage.name },
      status: status || 'Initiated',
    });

    // Send email notification to the customer
    await sendEmail(
      customer.email,
      'Transaction Created',
      `Dear ${customer.name}, your transaction for the package "${travelPackage.name}" has been created. Status: ${status || 'Initiated'}.`
    );

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
};



// Get All Transactions
exports.getTransactions = async (req, res) => {
  try {
    const { role, id } = req.user;

    let transactions;

    if (role === 'Customer') {
      // Fetch transactions for the logged-in customer
      transactions = await Transaction.find({ 'customer.id': id });
    } else if (role === 'Staff') {
      // Fetch transactions created by the logged-in staff
      transactions = await Transaction.find({ 'staff.id': id });
    } else if (role === 'Owner') {
      // Fetch all transactions for the owner
      transactions = await Transaction.find();
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};



// Update Transaction Status (Staff Only)
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true } // Return updated document and validate status
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

