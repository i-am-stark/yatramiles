const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  searchPackages,
} = require('../controllers/packageController');

const upload = require('../middleware/uploadMiddleware');
const router = express.Router();
router.post(
  '/',
  protect,
  authorize('Owner', 'Staff'),
  upload.array('media', 10), // Allow up to 10 files
  createPackage
);



router.get('/search', searchPackages); // To search and filter

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