const Package = require('../models/Package');

// Create a Package
exports.createPackage = async (req, res) => {
  try {
    const { name, description, price, duration, packageOverview, tourItinerary, inclusions, exclusions, importantNotes } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    const imagePaths = req.files.map((file) => file.path);

    const newPackage = new Package({
      name,
      description,
      price,
      duration,
      images: imagePaths,
      packageOverview,
      tourItinerary,
      inclusions,
      exclusions,
      importantNotes,
    });

    await newPackage.save();
    res.status(201).json({ message: 'Package created successfully', package: newPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create package' });
  }
};

// Get All Packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    const packagesWithFullImages = packages.map((pkg) => ({
      ...pkg.toObject(),
      images: pkg.images.map((img) => `https://api.yatramiles.in/${img}`),
    }));
    res.status(200).json(packagesWithFullImages);
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

    // Include new fields in the update
    const updatedPackage = await Package.findByIdAndUpdate(packageId, updatedData, {
      new: true,
      runValidators: true,
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

// Search Packages
exports.searchPackages = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, minDuration, maxDuration, packageType } = req.query;

    const query = {};

    // Case-insensitive search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by duration range
    if (minDuration || maxDuration) {
      query.duration = {};
      if (minDuration) query.duration.$gte = parseFloat(minDuration);
      if (maxDuration) query.duration.$lte = parseFloat(maxDuration);
    }

    // Filter by package type
    if (packageType) {
      query.packageType = packageType;
    }

    const packages = await Package.find(query);
    res.status(200).json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
};
