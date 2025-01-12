const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllQueries,
  getQueryById,
  createQuery,
  updateQuery,
  deleteQuery,
} = require('../controllers/queryController');

const router = express.Router();

// Get All Queries
router.get('/', protect, authorize('Staff', 'Owner'), getAllQueries);

// Get Query by ID
router.get('/:id', protect, authorize('Staff', 'Owner'), getQueryById);

// Create Query
router.post('/', createQuery); // No authentication required as customers submit the form

// Update Query
router.put('/:id', protect, authorize('Staff', 'Owner'), updateQuery);

// Delete Query
router.delete('/:id', protect, authorize('Staff', 'Owner'), deleteQuery);


module.exports = router;