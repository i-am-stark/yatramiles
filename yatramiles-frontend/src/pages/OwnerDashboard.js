import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Package, Trash2, Edit, Plus, DollarSign, Clock, AlertCircle, Loader } from 'lucide-react';
import './../css/OwnerDashboard.css';

const OwnerDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/packages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(packages.filter((pkg) => pkg._id !== id));
        toast.success('Package deleted successfully');
      } catch (error) {
        toast.error('Failed to delete package');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader className="spin" size={40} />
        <p>Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Owner Dashboard</h1>
          <p>Manage your travel packages and monitor performance</p>
        </div>
        <Link to="/manage-packages" className="add-package-button">
          <Plus size={20} />
          Add New Package
        </Link>
        <Link to="/owner-transactions" className="view-transactions-button">
          View All Transactions
        </Link>
      </div>

      {error ? (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : packages.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h2>No Packages Found</h2>
          <p>Start by creating your first travel package</p>
          <Link to="/manage-packages" className="create-first-button">
            Create Package
          </Link>
        </div>
      ) : (
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              {/* Display package image */}
              {pkg.images && pkg.images.length > 0 ? (
                <div className="package-image-container">
                  <img src={`${pkg.images[0]}`} alt={pkg.name} className="package-image" />
                </div>
              ) : (
                <div className="package-image-placeholder">
                  <Package size={48} />
                </div>
              )}

              {/* Package details */}
              <div className="package-header">
                <h3>{pkg.name}</h3>
              </div>
              
              <div className="package-details">
                <div className="detail-item">
                  <DollarSign size={16} />
                  <span>${pkg.price}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>{pkg.duration || 'Not specified'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="package-actions">
                <Link 
                  to={`/packages/edit/${pkg._id}`} 
                  className="edit-button"
                  title="Edit package"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(pkg._id)}
                  title="Delete package"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
