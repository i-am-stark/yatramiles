const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getCustomerDashboard,
  getStaffDashboard,
  getOwnerDashboard,
} = require('../controllers/dashboardController');

const router = express.Router();

// Customer Dashboard
router.get('/customer', protect, authorize('Customer'), getCustomerDashboard);

// Staff Dashboard
router.get('/staff', protect, authorize('Staff'), getStaffDashboard);

// Owner Dashboard
router.get('/owner', protect, authorize('Owner'), getOwnerDashboard);

module.exports = router;
