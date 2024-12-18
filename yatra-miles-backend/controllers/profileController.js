const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs');

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Prepare updated data
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run validations on updated fields
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
