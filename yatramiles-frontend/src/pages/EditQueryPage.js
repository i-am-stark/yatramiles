import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Save, Trash2, User, Mail, Phone, MapPin, Users, Clock, Hotel, Wallet, MessageSquare } from 'lucide-react';
import './../css/EditQueryPage.css';

const EditQueryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuery();
  }, []);

  const fetchQuery = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://api.yatramiles.in/api/queries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueryData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch query data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQueryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://api.yatramiles.in/api/queries/${id}`,
        queryData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      navigate('/queries');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update query');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`https://api.yatramiles.in/api/queries/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(response.data.message);
        navigate('/queries');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete query');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="loading-spinner" />
        <p>Loading query data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );
  }

  const statusOptions = [
    'New',
    'Working',
    'Follow Up',
    'Advance Received',
    'Booking Pending',
    'Booked',
    'Only Query',
    'Completed'
  ];

  return (
    <div className="edit-query-page">
      <div className="query-header">
        <h1>Edit Travel Query</h1>
        <div className="status-badge" data-status={queryData.status.toLowerCase().replace(' ', '-')}>
          {queryData.status}
        </div>
      </div>

      <form className="edit-query-form">
        <div className="form-grid">
          <div className="form-group">
            <label>
              <User size={18} />
              <span>Customer Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={queryData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={queryData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Phone size={18} />
              <span>WhatsApp</span>
            </label>
            <input
              type="text"
              name="whatsapp"
              value={queryData.whatsapp}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <MapPin size={18} />
              <span>Traveling From</span>
            </label>
            <input
              type="text"
              name="travelingFrom"
              value={queryData.travelingFrom}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <MapPin size={18} />
              <span>Destination</span>
            </label>
            <input
              type="text"
              name="location"
              value={queryData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Users size={18} />
              <span>Number of Adults</span>
            </label>
            <input
              type="number"
              name="adults"
              value={queryData.adults}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>
              <Users size={18} />
              <span>Number of Kids</span>
            </label>
            <input
              type="number"
              name="kids"
              value={queryData.kids}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>
              <Clock size={18} />
              <span>Tour Duration (Days)</span>
            </label>
            <input
              type="number"
              name="duration"
              value={queryData.duration}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>
              <Hotel size={18} />
              <span>Hotel Type</span>
            </label>
            <input
              type="text"
              name="hotelType"
              value={queryData.hotelType}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>
              <Wallet size={18} />
              <span>Budget</span>
            </label>
            <input
              type="number"
              name="budget"
              value={queryData.budget}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>
              <MessageSquare size={18} />
              <span>Status</span>
            </label>
            <select
              name="status"
              value={queryData.status}
              onChange={handleInputChange}
              className="status-select"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>
            <MessageSquare size={18} />
            <span>Extra Information</span>
          </label>
          <textarea
            name="extraInfo"
            value={queryData.extraInfo}
            onChange={handleInputChange}
            rows="4"
          ></textarea>
        </div>

        <div className="action-buttons">
          <button type="button" onClick={handleSave} className="save-button">
            <Save size={18} />
            <span>Save Changes</span>
          </button>
          <button type="button" onClick={handleDelete} className="delete-button">
            <Trash2 size={18} />
            <span>Delete Query</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQueryPage;
