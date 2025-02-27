import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Package,
  Clock,
  IndianRupee,
  MapPin,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react';
import './../css/ManagePackages.css';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    images: [],
    packageOverview: '',
    tourItinerary: '',
    inclusions: '',
    exclusions: '',
    importantNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const token = localStorage.getItem('token');

  const fetchPackages = async () => {
    try {
      const response = await axios.get('https://api.yatramiles.in/api/packages');
      setPackages(response.data);
      // Initialize current image index for each package
      const indices = {};
      response.data.forEach(pkg => {
        indices[pkg._id] = 0;
      });
      setCurrentImageIndices(indices);
    } catch (error) {
      toast.error('Failed to fetch packages');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Auto-slide images
  useEffect(() => {
    const intervals = {};
    
    packages.forEach(pkg => {
      if (pkg.images.length > 1) {
        intervals[pkg._id] = setInterval(() => {
          setCurrentImageIndices(prev => ({
            ...prev,
            [pkg._id]: (prev[pkg._id] + 1) % pkg.images.length
          }));
        }, 5000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [packages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'images') {
          formData[key].forEach((file) => formDataToSend.append('images', file));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      await axios.post('https://api.yatramiles.in/api/packages', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Package added successfully!');
      fetchPackages();

      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        images: [],
        packageOverview: '',
        tourItinerary: '',
        inclusions: '',
        exclusions: '',
        importantNotes: '',
      });
      setPreviewImages([]);
    } catch (error) {
      toast.error('Failed to add package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`https://api.yatramiles.in/api/packages/${packageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Package deleted successfully');
        fetchPackages();
      } catch (error) {
        toast.error('Failed to delete package');
      }
    }
  };

  const handleEdit = (packageId) => {
    // Implement edit functionality
    toast.info('Edit functionality coming soon!');
  };

  return (
    <div className="manage-packages-container">
      {/* Add New Package Form */}
      <div className="add-package-section">
        <div className="section-header">
          <h1>Add New Package</h1>
          <p>Create a new travel package with details and images</p>
        </div>

        <form onSubmit={handleSubmit} className="package-form">
          <div className="form-group">
            <label htmlFor="name">Package Name</label>
            <div className="input-wrapper">
              <Package size={20} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter package name"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Destinations</label>
            <div className="input-wrapper">
              <MapPin size={20} />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                placeholder="Enter destinations and description"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <div className="input-wrapper">
                <IndianRupee size={20} />
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Enter price"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <div className="input-wrapper">
                <Clock size={20} />
                <input
                  id="duration"
                  type="number"
                  name="duration"
                  value={formData.duration}
                  placeholder="Enter duration (days)"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {['packageOverview', 'tourItinerary', 'inclusions', 'exclusions', 'importantNotes'].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="input-wrapper">
                <FileText size={20} />
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="images">Package Images</label>
            <div className="file-input-wrapper">
              <input
                id="images"
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              <div className="file-input-placeholder">
                <ImageIcon size={24} />
                <span>Click to upload images</span>
              </div>
            </div>

            {previewImages.length > 0 && (
              <div className="image-preview-grid">
                {previewImages.map((preview, index) => (
                  <div key={index} className="preview-image">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            <Plus size={20} />
            {isSubmitting ? 'Adding Package...' : 'Add Package'}
          </button>
        </form>
      </div>

      {/* Existing Packages Section */}
      <div className="existing-packages-section">
        <div className="section-header">
          <h1>Existing Packages</h1>
          <p>Manage all travel packages</p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              <div className="package-image-container">
                {pkg.images.length > 0 && (
                  <img
                    src={pkg.images[currentImageIndices[pkg._id]]}
                    alt={pkg.name}
                    className="package-image"
                  />
                )}
                <div className="image-indicator">
                  {pkg.images.map((_, index) => (
                    <span
                      key={index}
                      className={`indicator-dot ${
                        index === currentImageIndices[pkg._id] ? 'active' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="package-info">
                <h2>{pkg.name}</h2>
                <p className="price">₹{pkg.price}</p>
                <p className="duration">{pkg.duration} Days</p>
                <p className="description">{pkg.description}</p>
                <div className="package-actions-footer">
                  
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="action-button-footer delete"
                  >
                    <Trash2 size={16} />
                    <span>Delete Package</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePackages;
