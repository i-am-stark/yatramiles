const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a Customer
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // console.log('Raw password (register):', password); // Debug
    // console.log('Hashed password (register):', hashedPassword); // Debug

    // Create the user with default "Customer" role
    const newUser = new User({
      name,
      email,
      password,
      role: 'Customer', // Default role for registration
    });

    await newUser.save();

    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log('Password entered (login):', password); // Debug
    // console.log('Hashed password (login):', user.password); // Debug

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    // const isMatch = password == user.password;
    // console.log('Password match result:', isMatch); // Debug
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

    // Hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // console.log('Raw password (create-staff):', password); // Debug
    // console.log('Hashed password (create-staff):', hashedPassword); // Debug

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
};