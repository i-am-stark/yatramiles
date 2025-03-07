import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Package, 
  User, 
  Calendar, 
  AlertCircle, 
  Loader,
  CheckCircle,
  RefreshCw,
  BarChart
} from 'lucide-react';
import './../css/StaffDashboard.css';

const StaffDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://api.yatramiles.in/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdate({ ...statusUpdate, [id]: newStatus });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Initiated': 'status-initiated',
      'In Progress': 'status-progress',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return colors[status] || '';
  };

  const handleUpdateStatus = async (id) => {
    setUpdatingStatus({ ...updatingStatus, [id]: true });
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://api.yatramiles.in/api/transactions/${id}`,
        { status: statusUpdate[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction._id === id ? { ...transaction, status: statusUpdate[id] } : transaction
        )
      );
      
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus({ ...updatingStatus, [id]: false });
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

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'Completed').length,
    inProgress: transactions.filter(t => t.status === 'In Progress').length,
    initiated: transactions.filter(t => t.status === 'Initiated').length
  };

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Staff Dashboard</h1>
          <p>Manage and track customer transactions efficiently</p>
        </div>
        <Link to="/staff-transactions" className="view-all-button">
          <BarChart size={20} />
          View All Transactions
        </Link>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Total</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress">
            <RefreshCw size={24} />
          </div>
          <div className="stat-info">
            <h3>In Progress</h3>
            <p>{stats.inProgress}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon initiated">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Initiated</h3>
            <p>{stats.initiated}</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h2>No Transactions Found</h2>
          <p>New transactions will appear here</p>
        </div>
      ) : (
        <div className="transactions-grid">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="transaction-card">
              <div className="transaction-header">
                <FileText size={20} />
                <span className="transaction-id">#{transaction._id.slice(-6)}</span>
              </div>
              
              <div className="transaction-details">
                <div className="detail-row">
                  <Package size={16} />
                  <span>{transaction.package?.name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <User size={16} />
                  <span>{transaction.customer?.name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Calendar size={16} />
                  <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="status-section">
                <select
                  value={statusUpdate[transaction._id] || transaction.status}
                  onChange={(e) => handleStatusChange(transaction._id, e.target.value)}
                  className={getStatusColor(statusUpdate[transaction._id] || transaction.status)}
                >
                  <option value="Initiated">Initiated</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleUpdateStatus(transaction._id)}
                  className={`update-button ${updatingStatus[transaction._id] ? 'loading' : ''}`}
                  disabled={updatingStatus[transaction._id]}
                >
                  {updatingStatus[transaction._id] ? (
                    <RefreshCw size={16} className="loading-spinner" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  <span>Update</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
