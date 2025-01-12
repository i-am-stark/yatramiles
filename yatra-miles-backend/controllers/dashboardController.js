const Transaction = require('../models/Transaction');
const Query = require('../models/Query');

exports.getCustomerDashboard = async (req, res) => {
  try {
    const user = req.user;

    // Fetch associated queries and transactions
    const queries = await Query.find({ email: user.email });
    const transactions = await Transaction.find({ 'customer.id': user._id });

    // Categorize transactions
    const ongoingTrips = transactions.filter((t) => t.status === 'In Progress');
    const upcomingTrips = transactions.filter(
      (t) => t.status === 'Booked' && t.startDate && new Date(t.startDate) > new Date()
    );
    const pendingFollowUps = transactions.filter((t) => t.status === 'Follow Up');

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      queries,
      transactions,
      summaries: {
        ongoingTrips,
        upcomingTrips,
        pendingFollowUps,
      },
    });
  } catch (error) {
    console.error('Error fetching customer dashboard:', error.message);
    res.status(500).json({ message: 'Error fetching customer dashboard', error: error.message });
  }
};

exports.getStaffDashboard = async (req, res) => {
  try {
    const user = req.user;

    // Fetch queries and transactions assigned to the staff
    const queries = await Query.find({ 'handler.id': user._id });
    const transactions = await Transaction.find({ 'staff.id': user._id });

    // Categorize transactions
    const ongoingTrips = transactions.filter((t) => t.status === 'In Progress');
    const upcomingTrips = transactions.filter(
      (t) => t.status === 'Booked' && t.startDate && new Date(t.startDate) > new Date()
    );
    const pendingFollowUps = transactions.filter((t) => t.status === 'Follow Up');

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      queries,
      transactions,
      summaries: {
        ongoingTrips,
        upcomingTrips,
        pendingFollowUps,
      },
    });
  } catch (error) {
    console.error('Error fetching staff dashboard:', error.message);
    res.status(500).json({ message: 'Error fetching staff dashboard', error: error.message });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const user = req.user;

    // Fetch all queries and transactions
    const queries = await Query.find();
    const transactions = await Transaction.find();

    // Financial summaries
    const totalRevenue = transactions.reduce((acc, t) => acc + (t.totalRevenue || 0), 0);
    const totalExpenses = transactions.reduce(
      (acc, t) => acc + (t.hotelCost || 0) + (t.cabCost || 0) + (t.otherCosts?.reduce((sum, cost) => sum + cost.cost, 0) || 0),
      0
    );
    const profit = totalRevenue - totalExpenses;

    // Categorize transactions
    const ongoingTrips = transactions.filter((t) => t.status === 'In Progress');
    const upcomingTrips = transactions.filter(
      (t) => t.status === 'Booked' && t.startDate && new Date(t.startDate) > new Date()
    );
    const pendingFollowUps = transactions.filter((t) => t.status === 'Follow Up');

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      queries,
      transactions,
      financials: {
        totalRevenue,
        totalExpenses,
        profit,
      },
      summaries: {
        ongoingTrips,
        upcomingTrips,
        pendingFollowUps,
      },
    });
  } catch (error) {
    console.error('Error fetching owner dashboard:', error.message);
    res.status(500).json({ message: 'Error fetching owner dashboard', error: error.message });
  }
};