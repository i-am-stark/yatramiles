const Transaction = require('../models/Transaction');
const Query = require('../models/Query');
const User = require('../models/User');

// Get Transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error.message);
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
};

// Get All Transactions
exports.getTransactions = async (req, res) => {
  try {
    const { role, id } = req.user;
    let transactions;

    if (role === 'Customer') {
      transactions = await Transaction.find({ 'customer.id': id });
    } else if (role === 'Staff') {
      transactions = await Transaction.find({ 'staff.id': id });
    } else if (role === 'Owner') {
      transactions = await Transaction.find();
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    Object.assign(transaction, updatedData);
    await transaction.save();

    const query = await Query.findOne({ email: transaction.customer.email });
    if (query) {
      Object.assign(query, {
        name: transaction.customer.name,
        whatsapp: transaction.customer.whatsappNumber,
        travelingFrom: transaction.travelingFrom,
        location: transaction.location,
        adults: transaction.noOfAdults,
        kids: transaction.noOfKids,
        extraInfo: transaction.extraInfo,
        duration: transaction.tourDuration,
        hotelType: transaction.hotelType,
        budget: transaction.budget,
        status: transaction.status,
        handler: transaction.staff,
      });
      await query.save();
    }

    res.status(200).json({ message: 'Transaction and Query updated successfully', transaction, query });
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
};

// Create Transaction from Query
exports.createTransactionFromQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    const staff = await User.findById(query.handler.id);
    if (!staff) {
      return res.status(404).json({ message: 'Assigned staff not found' });
    }

    const transactionData = {
      customer: {
        id: query.customerId || null,
        name: query.name,
        email: query.email,
        whatsappNumber: query.whatsapp,
      },
      staff: {
        id: staff._id,
        name: staff.name,
      },
      travelingFrom: query.travelingFrom,
      location: query.location,
      noOfAdults: query.adults,
      noOfKids: query.kids,
      extraInfo: query.extraInfo,
      tourDuration: query.duration,
      hotelType: query.hotelType,
      budget: query.budget,
      package: { dropCity: query.location },
      status: query.status,
    };

    const newTransaction = await Transaction.create(transactionData);

    query.status = 'Converted to Transaction';
    await query.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction from query:', error.message);
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};