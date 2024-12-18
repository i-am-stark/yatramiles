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
            console.log('Owner account already exists.');
            process.exit();
        }

        // Create Owner account
        const owner = new User({
            name: 'YatraMiles Owner',
            email: 'yatramiles@gmail.com',
            password: '6SfCTSQSwp8fIhE', // Use a strong password
            role: 'Owner',
        });
        await owner.save();

        console.log('Owner account created successfully.');
        process.exit();
    } catch (error) {
        console.error('Error creating Owner account:', error);
        process.exit(1);
    }
};

seedOwner();