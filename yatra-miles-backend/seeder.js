const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();
const connectDB = require('./config/db');

const seedOwner = async () => {
  try {
    await connectDB();

    // Check if Owner already exists
    const existingOwner = await User.findOne({ role: 'Owner' });
    if (existingOwner) {
      console.log('Owner account already exists. Updating with new fields...');
      
      // Update the existing Owner account with the new field
      existingOwner.isVerified = true;
      await existingOwner.save();

      console.log('Owner account updated successfully.');
      process.exit();
    }

    // If no Owner exists, create a new Owner account
    const owner = new User({
      name: 'YatraMiles Owner',
      email: 'yatramiles@gmail.com',
      password: '6SfCTSQSwp8fIhE', // Use a strong password
      role: 'Owner',
      isVerified: true, // Add the new field during creation
    });
    await owner.save();

    console.log('Owner account created successfully.');
    process.exit();
  } catch (error) {
    console.error('Error creating/updating Owner account:', error);
    process.exit(1);
  }
};

seedOwner();