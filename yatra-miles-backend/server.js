require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Import authentication routes

const app = express();

// Middleware
app.use(express.json()); // Replaces bodyParser.json() for JSON parsing
app.use(cors());

// Connect to MongoDB
connectDB();

// Sample route
app.get('/', (req, res) => {
    res.send('YatraMiles Backend is running!');
});

// API Routes
app.use('/api/auth', authRoutes); // Mount the auth routes at /api/auth

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const packageRoutes = require('./routes/packageRoutes');
app.use('/api/packages', packageRoutes);


const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));