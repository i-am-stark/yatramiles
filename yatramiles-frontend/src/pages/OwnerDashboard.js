import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, Plus, Loader, AlertCircle, Package, Users, Receipt } from 'lucide-react';
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
        <Loader className="loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Owner Dashboard</h1>
          <p>Welcome back! Manage your travel packages and business operations.</p>
        </div>
        
        <div className="quick-actions">
          <Link to="/manage-packages" className="action-card">
            <Package size={24} />
            <span>New Package</span>
          </Link>
          <Link to="/owner-transactions" className="action-card">
            <Receipt size={24} />
            <span>Transactions</span>
          </Link>
          <Link to="/manage-staff" className="action-card">
            <Users size={24} />
            <span>Staff</span>
          </Link>
        </div>
      </div>

      <div className="packages-section">
        <div className="section-header">
          <h2>Travel Packages</h2>
          <Link to="/manage-packages" className="new-package-btn">
            <Plus size={20} />
            Create Package
          </Link>
        </div>

        {error ? (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="table-container">
            <table className="packages-table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td>{pkg.name}</td>
                    <td>${pkg.price}</td>
                    <td>{pkg.duration || 'Not specified'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/packages/${pkg._id}`}
                          className="action-btn view"
                          title="View package"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/packages/edit/${pkg._id}`}
                          className="action-btn edit"
                          title="Edit package"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(pkg._id)}
                          title="Delete package"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;