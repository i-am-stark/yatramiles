const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
  getTransactionById,
} = require('../controllers/transactionController');
const User = require('../models/User');

const router = express.Router();

// Fetch all customers for dropdown
router.get('/customers', protect, authorize('Staff', 'Owner'), async (req, res) => {
  try {
    const customers = await User.find({ role: 'Customer' }).select('_id name email');
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

// Create a Transaction
router.post('/', protect, authorize('Staff', 'Owner'), createTransaction);

// Get All Transactions
router.get('/', protect, getTransactions);

router.get('/:id', protect, getTransactionById);

// Update Transaction Status
router.put('/:id', protect, authorize('Staff', 'Owner'), updateTransactionStatus);

module.exports = router;
