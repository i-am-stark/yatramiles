const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');

const router = express.Router();

// Create a Package (Owner/Staff Only)
router.post('/', protect, authorize('Owner', 'Staff'), createPackage);

// Get All Packages (Public)
router.get('/', getPackages);

// Get Single Package by ID (Public)
router.get('/:id', getPackageById);

// Update Package (Owner/Staff Only)
router.put('/:id', protect, authorize('Owner', 'Staff'), updatePackage);

// Delete Package (Owner/Staff Only)
router.delete('/:id', protect, authorize('Owner', 'Staff'), deletePackage);

module.exports = router;