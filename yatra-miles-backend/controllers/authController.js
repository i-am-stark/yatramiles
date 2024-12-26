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


// Resend OTP for Verification
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified.' });
    }

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Update user with new OTP and expiration time
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send the OTP via email
    await sendEmail(
      email,
      'Your New OTP - YatraMiles',
      `Dear ${user.name},\n\nYour new OTP for YatraMiles registration is ${otp}. It is valid for 10 minutes.\n\nThank you!`
    );

    res.status(200).json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resending OTP', error: error.message });
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


// Add a new staff member
const addStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Staff',
    });

    // Send email to the new staff member
    const emailSubject = 'Welcome to YatraMiles';
    const emailText = `Dear ${name},\n\nWelcome to YatraMiles! Your account has been successfully created.\n\nHere are your login credentials:\nEmail: ${email}\nPassword: ${password}\n\nBest regards,\nThe YatraMiles Team`;

    try {
      await sendEmail(email, emailSubject, emailText);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError.message);
      // Optionally handle email failure here (e.g., log it, notify admin)
    }

    res.status(201).json({ message: 'Staff added successfully', staff: newStaff });
  } catch (error) {
    console.error('Error adding staff:', error.message);
    res.status(500).json({ message: 'Error adding staff', error: error.message });
  }
};

// Get all staff members
const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await User.find({ role: 'Staff' });
    res.status(200).json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff members:', error.message);
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
};

// Delete a staff member
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staffMember = await User.findByIdAndDelete(id);
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error.message);
    res.status(500).json({ message: 'Error deleting staff', error: error.message });
  }
};



module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getAllStaff,
  addStaff,
  deleteStaff,
};