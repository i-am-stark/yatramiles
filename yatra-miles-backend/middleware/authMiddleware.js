const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted Token:', token); // Debug

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // Debug

      // Attach user info to the request
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found in database:', req.user); // Debug
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized', error: error.message });
    }
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log('Access denied for role:', req.user.role); // Debug
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { protect, authorize };