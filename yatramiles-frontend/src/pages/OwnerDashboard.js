import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './../css/OwnerDashboard.css'; // Ensure you have a CSS file for styling

const OwnerDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await axios.get('http://localhost:5001/api/packages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPackages(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="owner-dashboard">
      <h1>Owner Dashboard</h1>
      <p>Manage your packages and track performance.</p>

      <div className="dashboard-actions">
        <Link to="/manage-packages" className="action-button">
          Add New Package
        </Link>
      </div>

      {loading ? (
        <p>Loading packages...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : packages.length > 0 ? (
        <table className="packages-table">
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Total Bookings</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id}>
                <td>{pkg.name}</td>
                <td>{pkg.bookings || 0}</td>
                <td>${pkg.revenue || 0}</td>
                <td>{pkg.status}</td>
                <td>
                  <Link to={`/packages/edit/${pkg._id}`} className="edit-button">
                    Edit
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(pkg._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No packages found. Create your first package now!</p>
      )}
    </div>
  );
};

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this package?')) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Package deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete package:', error);
    }
  }
};

export default OwnerDashboard;
