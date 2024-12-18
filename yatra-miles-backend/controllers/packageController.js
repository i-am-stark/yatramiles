const Package = require('../models/Package');

// Create a Package
exports.createPackage = async (req, res) => {
  try {
    const { name, description, price, duration, locations, media } = req.body;

    // Validate required fields
    if (!name || !description || !price || !duration || !locations) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newPackage = await Package.create({
      name,
      description,
      price,
      duration,
      locations,
      media,
      createdBy: req.user.id, // Get the logged-in user
    });

    res.status(201).json(newPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating package', error: error.message });
  }
};

// Get All Packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
};

// Get Package by ID
exports.getPackageById = async (req, res) => {
  try {
    const packageId = req.params.id;
    const travelPackage = await Package.findById(packageId);

    if (!travelPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(travelPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching package', error: error.message });
  }
};

// Update a Package
exports.updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updatedData = req.body;

    const updatedPackage = await Package.findByIdAndUpdate(packageId, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated data
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating package', error: error.message });
  }
};

// Delete a Package
exports.deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    const deletedPackage = await Package.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting package', error: error.message });
  }
};