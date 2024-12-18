const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { updateProfile } = require('../controllers/profileController');

const router = express.Router();

// Update Profile
router.put('/', protect, updateProfile);

module.exports = router;
