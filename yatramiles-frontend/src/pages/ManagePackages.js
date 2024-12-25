import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Package, Clock, DollarSign, MapPin, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import './../css/ManagePackages.css';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const token = localStorage.getItem('token');

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/packages');
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
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

      await axios.post('http://localhost:5001/api/packages', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Package added successfully!');
      fetchPackages();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        images: [],
      });
      setPreviewImages([]);
      
    } catch (error) {
      toast.error('Failed to add package');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="manage-packages-container">
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
                <DollarSign size={20} />
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
                  type="text"
                  name="duration"
                  value={formData.duration}
                  placeholder="e.g., 5 Days"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

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

      <div className="existing-packages-section">
        <div className="section-header">
          <h2>Existing Packages</h2>
          <p>Manage your current travel packages</p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              {pkg.images?.[0] && (
                <div className="package-image">
                  <img src={pkg.images[0]} alt={pkg.name} />
                </div>
              )}
              <div className="package-info">
                <h3>{pkg.name}</h3>
                <div className="package-details">
                  <span><DollarSign size={16} />${pkg.price}</span>
                  <span><Clock size={16} />{pkg.duration}</span>
                </div>
                <p>{pkg.description}</p>
                <button className="delete-button">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePackages;