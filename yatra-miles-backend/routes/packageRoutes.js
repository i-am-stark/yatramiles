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

router.get('/search', searchPackages); // Place this before /:id
router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post(
  '/',
  protect,
  authorize('Owner', 'Staff'),
  upload.array('images', 10),
  createPackage
);
router.put('/:id', protect, authorize('Owner', 'Staff'), updatePackage);
router.delete('/:id', protect, authorize('Owner', 'Staff'), deletePackage);

module.exports = router;
