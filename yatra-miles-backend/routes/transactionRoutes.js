const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
} = require('../controllers/transactionController');

const router = express.Router();

// Create a Transaction (Staff Only)
router.post('/', protect, authorize('Staff', 'Owner'), createTransaction);

// Get All Transactions (Customer: Own, Staff: Own Created, Owner: All)
router.get('/', protect, getTransactions);

// Update Transaction Status (Staff Only)
router.put('/:id', protect, authorize('Staff', 'Owner'), updateTransactionStatus);

module.exports = router;
