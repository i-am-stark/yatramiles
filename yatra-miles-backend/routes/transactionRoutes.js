const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getTransactionById,
  getTransactions,
  updateTransaction,
  createTransactionFromQuery,
  deleteTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

// Get Transaction by ID
router.get('/:id', protect, authorize('Staff', 'Owner', 'Customer'), getTransactionById);

// Get All Transactions
router.get('/', protect, authorize('Staff', 'Owner', 'Customer'), getTransactions);

// Update Transaction
router.put('/:id', protect, authorize('Staff', 'Owner'), updateTransaction);

// Create Transaction from Query
router.post('/from-query/:queryId', protect, authorize('Staff', 'Owner'), createTransactionFromQuery);

// Delete a Transaction
router.delete('/:id', protect, authorize('Owner', 'Staff'), deleteTransaction);

module.exports = router;