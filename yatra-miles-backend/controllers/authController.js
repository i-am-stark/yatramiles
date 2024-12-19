const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Register a Customer
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      name,
      email,
      password,
      role: 'Customer',
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    await sendEmail(
      email,
      'Verify Your Email - YatraMiles',
      `Dear ${name},\n\nYour OTP for YatraMiles registration is ${otp}. It is valid for 10 minutes.\n\nThank you!`
    );

    res.status(201).json({
      message: 'Registration initiated. Please verify your email using the OTP sent to your email address.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
};


// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

//OTP Verification
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.otp = undefined; // Clear OTP
    user.otpExpiresAt = undefined; // Clear OTP expiry
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully. Your account is now active.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during OTP verification', error: error.message });
  }
};


// Create Staff Account (Owner Only)
const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new staff user
    const staff = new User({
      name,
      email,
      password,
      role: 'Staff',
    });

    await staff.save();

    res.status(201).json({ message: 'Staff account created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating staff account', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createStaff,
  verifyOtp,
};