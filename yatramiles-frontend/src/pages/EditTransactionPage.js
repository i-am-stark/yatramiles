import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import './../css/EditTransactionPage.css';

const EditTransactionPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://api.yatramiles.in/api/transactions/${transactionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransaction(response.data); // Set transaction data
      } catch (err) {
        setError('Transaction ID is invalid.');
        toast.error('Transaction ID is invalid.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested field changes (customer, staff, package)
  const handleNestedChange = (e, category, field) => {
    const { value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://api.yatramiles.in/api/transactions/${transactionId}`,
        transaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Transaction updated successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to update transaction');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading transaction data...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="edit-transaction-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Back
        </button>
        <h1>Edit Transaction</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-section">
          <h2>Customer Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                type="text"
                name="name"
                value={transaction.customer?.name || ''}
                onChange={(e) => handleNestedChange(e, 'customer', 'name')}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerEmail">Customer Email</label>
              <input
                id="customerEmail"
                type="email"
                name="email"
                value={transaction.customer?.email || ''}
                onChange={(e) => handleNestedChange(e, 'customer', 'email')}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="customerWhatsapp">Customer WhatsApp</label>
            <input
              id="customerWhatsapp"
              type="text"
              name="whatsappNumber"
              value={transaction.customer?.whatsappNumber || ''}
              onChange={(e) => handleNestedChange(e, 'customer', 'whatsappNumber')}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Staff Information</h2>
          <div className="form-group">
            <label htmlFor="staffName">Staff Name</label>
            <input
              id="staffName"
              type="text"
              name="name"
              value={transaction.staff?.name || ''}
              onChange={(e) => handleNestedChange(e, 'staff', 'name')}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Trip Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="travelingFrom">Traveling From</label>
              <input
                id="travelingFrom"
                type="text"
                name="travelingFrom"
                value={transaction.travelingFrom || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                type="text"
                name="location"
                value={transaction.location || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="noOfAdults">Number of Adults</label>
              <input
                id="noOfAdults"
                type="number"
                name="noOfAdults"
                value={transaction.noOfAdults || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="noOfKids">Number of Kids</label>
              <input
                id="noOfKids"
                type="number"
                name="noOfKids"
                value={transaction.noOfKids || 0}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="extraInfo">Extra Info</label>
            <textarea
              id="extraInfo"
              name="extraInfo"
              value={transaction.extraInfo || ''}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tourDuration">Tour Duration (Days)</label>
              <input
                id="tourDuration"
                type="number"
                name="tourDuration"
                value={transaction.tourDuration || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="hotelType">Hotel Type</label>
              <input
                id="hotelType"
                type="text"
                name="hotelType"
                value={transaction.hotelType || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Budget</label>
              <input
                id="budget"
                type="number"
                name="budget"
                value={transaction.budget || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dropCity">Drop City</label>
              <input
                id="dropCity"
                type="text"
                name="dropCity"
                value={transaction.package?.dropCity || ''}
                onChange={(e) => handleNestedChange(e, 'package', 'dropCity')}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Transaction Status</h2>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              name="status" 
              value={transaction.status} 
              onChange={handleChange}
              className={`status-select status-${transaction.status?.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <option value="New">New</option>
              <option value="Working">Working</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Advance Received">Advance Received</option>
              <option value="Booking Pending">Booking Pending</option>
              <option value="Booked">Booked</option>
              <option value="Only Query">Only Query</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Financial Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalRevenue">Total Revenue</label>
              <input
                id="totalRevenue"
                type="number"
                name="totalRevenue"
                value={transaction.totalRevenue || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="hotelCost">Hotel Cost</label>
              <input
                id="hotelCost"
                type="number"
                name="hotelCost"
                value={transaction.hotelCost || 0}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cabCost">Cab Cost</label>
              <input
                id="cabCost"
                type="number"
                name="cabCost"
                value={transaction.cabCost || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="advance">Advance Payment</label>
              <input
                id="advance"
                type="number"
                name="advance"
                value={transaction.advance || 0}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tpc">Total Package Cost</label>
              <input
                id="tpc"
                type="number"
                name="tpc"
                value={transaction.tpc || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="pendingAmount">Pending Amount</label>
              <input
                id="pendingAmount"
                type="number"
                name="pendingAmount"
                value={transaction.pendingAmount || 0}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="profit">Profit</label>
            <input
              id="profit"
              type="number"
              name="profit"
              value={transaction.profit || 0}
              onChange={handleChange}
              className={transaction.profit > 0 ? 'profit-positive' : 'profit-negative'}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            <Save size={18} />
            Update Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransactionPage;