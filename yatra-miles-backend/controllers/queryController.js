const Query = require('../models/Query');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Get All Queries
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error.message);
    res.status(500).json({ message: 'Failed to fetch queries', error: error.message });
  }
};

// Get Query by ID
exports.getQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.status(200).json(query);
  } catch (error) {
    console.error('Error fetching query:', error.message);
    res.status(500).json({ message: 'Error fetching query', error: error.message });
  }
};

// Create Query
exports.createQuery = async (req, res) => {
  try {
    const queryData = req.body;

    // Assign handler automatically
    const staff = await User.findOne({ role: 'Staff' }).sort({ createdAt: 1 });
    if (!staff) {
      return res.status(400).json({ message: 'No staff available to assign' });
    }

    queryData.handler = {
      id: staff._id,
      name: staff.name,
    };

    const newQuery = await Query.create(queryData);
    res.status(201).json(newQuery);
  } catch (error) {
    console.error('Error creating query:', error.message);
    res.status(500).json({ message: 'Error creating query', error: error.message });
  }
};

exports.deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findByIdAndDelete(id);

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    res.status(200).json({ message: 'Query deleted successfully' });
  } catch (error) {
    console.error('Error deleting query:', error.message);
    res.status(500).json({ message: 'Failed to delete query' });
  }
};
// Update Query
exports.updateQuery = async (req, res) => {
  try {
    const { id } = req.params; // Updated from queryId to id
    const updatedQueryData = req.body;

    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    const previousStatus = query.status; // Save the previous status before updating
    Object.assign(query, updatedQueryData);
    await query.save();

    // Check if a transaction exists for the query's email
    let transaction = await Transaction.findOne({ 'customer.email': query.email });

    if (!transaction && previousStatus === 'New') {
      // Create a new transaction if the query was "New"
      const transactionData = {
        customer: {
          id: query.customerId || null,
          name: query.name,
          email: query.email,
          whatsappNumber: query.whatsapp,
        },
        staff: {
          id: query.handler?.id || null,
          name: query.handler?.name || 'Unassigned',
        },
        travelingFrom: query.travelingFrom,
        location: query.location,
        noOfAdults: query.adults,
        noOfKids: query.kids,
        extraInfo: query.extraInfo,
        tourDuration: query.duration,
        hotelType: query.hotelType,
        budget: query.budget,
        package: { dropCity: query.location },
        status: query.status,
      };

      transaction = await Transaction.create(transactionData);
      return res.status(201).json({ message: 'Query updated and new Transaction created', query, transaction });
    }

    // Update the existing transaction if found
    if (transaction) {
      Object.assign(transaction, {
        customer: {
          id: transaction.customer?.id || null,
          name: query.name,
          email: query.email,
          whatsappNumber: query.whatsapp,
        },
        travelingFrom: query.travelingFrom,
        location: query.location,
        noOfAdults: query.adults,
        noOfKids: query.kids,
        extraInfo: query.extraInfo,
        tourDuration: query.duration,
        hotelType: query.hotelType,
        budget: query.budget,
        package: { dropCity: query.location },
        status: query.status,
        staff: query.handler,
      });
      await transaction.save();
    }

    res.status(200).json({ message: 'Query and Transaction updated successfully', query, transaction });
  } catch (error) {
    console.error('Error updating query:', error.message);
    res.status(500).json({ message: 'Error updating query', error: error.message });
  }
};