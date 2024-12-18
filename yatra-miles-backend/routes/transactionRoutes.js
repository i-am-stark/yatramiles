const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
} = require('../controllers/transactionController');

const router = express.Router();

// Create a Transaction (Staff Only)
router.post('/', protect, authorize('Staff'), createTransaction);

// Get All Transactions (Owner: All, Staff: Own Created, Customer: Own Transactions)
router.get('/', protect, getTransactions);

// Update Transaction Status (Staff Only)
router.put('/:id', protect, authorize('Staff'), updateTransactionStatus);

module.exports = router;
