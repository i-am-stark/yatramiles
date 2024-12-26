const express = require('express');
const { registerUser, loginUser, verifyOtp, resendOtp, getAllStaff, addStaff, deleteStaff } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// User Registration (Customers Only)
router.post('/register', registerUser);

// User Login (All Roles)
router.post('/login', loginUser);

// OTP verification route
router.post('/verify-otp', verifyOtp); 

// Resend OTP
router.post('/resend-otp', resendOtp);

// Create Staff Account (Owner Only)
router.post('/staff', protect, authorize('Owner'), addStaff);

// Get All Staff
router.get('/staff', protect, authorize('Owner'), getAllStaff);

// Delete Staff
router.delete('/staff/:id', protect, authorize('Owner'), deleteStaff);


// Log Out
router.post('/logout', protect, (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
  });

module.exports = router;
