const express = require('express');
const { registerUser, loginUser, createStaff } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// User Registration (Customers Only)
router.post('/register', registerUser);

// User Login (All Roles)
router.post('/login', loginUser);

// Create Staff Account (Owner Only)
router.post('/create-staff', protect, authorize('Owner'), createStaff);

// Log Out
router.post('/logout', protect, (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
  });

module.exports = router;
