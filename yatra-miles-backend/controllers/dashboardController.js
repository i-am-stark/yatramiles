const Transaction = require('../models/Transaction');

exports.getCustomerDashboard = async (req, res) => {
    try {
      // Fetch customer details
      const user = req.user;
  
      // Fetch transactions associated with the customer
      const transactions = await Transaction.find({ 'customer.id': user._id });
  
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        transactions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching customer dashboard', error: error.message });
    }
  };

  exports.getStaffDashboard = async (req, res) => {
    try {
      // Fetch staff details
      const user = req.user;
  
      // Fetch transactions created by the staff
      const transactions = await Transaction.find({ 'staff.id': user._id });
  
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        transactions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching staff dashboard', error: error.message });
    }
  };

  exports.getOwnerDashboard = async (req, res) => {
    try {
      // Fetch owner details
      const user = req.user;
  
      // Fetch all transactions
      const transactions = await Transaction.find();
  
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        transactions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching owner dashboard', error: error.message });
    }
  };
  