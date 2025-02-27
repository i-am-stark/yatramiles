import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader, AlertCircle, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import './../css/AllTransactionsPage.css';

const AllTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://api.yatramiles.in/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yatramiles.in/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(transactions.filter((txn) => txn._id !== id));
        alert('Transaction deleted successfully');
      } catch (error) {
        alert('Failed to delete transaction');
      }
    }
  };

  const sortTransactions = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const sortedTransactions = [...transactions].sort((a, b) => {
      const aValue = key.includes('.') ? key.split('.').reduce((obj, prop) => obj[prop], a) : a[key];
      const bValue = key.includes('.') ? key.split('.').reduce((obj, prop) => obj[prop], b) : b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setTransactions(sortedTransactions);
  };

  const filteredTransactions = transactions.filter(txn => {
    const searchLower = searchTerm.toLowerCase();
    return (
      txn.customer.name.toLowerCase().includes(searchLower) ||
      txn.customer.email.toLowerCase().includes(searchLower) ||
      txn.location.toLowerCase().includes(searchLower) ||
      txn.status.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <Loader className="loading-spinner" size={40} />
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronDown size={16} />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="transactions-container">
      <div className="page-header">
        <div className="header-content">
          <h1>All Transactions</h1>
          <p>Manage and track all your business transactions</p>
        </div>
        <Link to="/transactions/new" className="add-button">
          <Plus size={20} />
          Add New Transaction
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter size={20} />
        </div>
        <div className="transactions-count">
          Showing {filteredTransactions.length} transactions
        </div>
      </div>

      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => sortTransactions('customer.name')}>
                Customer {getSortIcon('customer.name')}
              </th>
              <th onClick={() => sortTransactions('customer.email')}>
                Email {getSortIcon('customer.email')}
              </th>
              <th onClick={() => sortTransactions('customer.whatsappNumber')}>
                Contact {getSortIcon('customer.whatsappNumber')}
              </th>
              <th onClick={() => sortTransactions('staff.name')}>
                Staff {getSortIcon('staff.name')}
              </th>
              <th onClick={() => sortTransactions('location')}>
                Location {getSortIcon('location')}
              </th>
              <th onClick={() => sortTransactions('status')}>
                Status {getSortIcon('status')}
              </th>
              <th onClick={() => sortTransactions('totalRevenue')}>
                Revenue {getSortIcon('totalRevenue')}
              </th>
              <th onClick={() => sortTransactions('createdAt')}>
                Created {getSortIcon('createdAt')}
              </th>
              <th onClick={() => sortTransactions('updatedAt')}>
                Updated {getSortIcon('updatedAt')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn._id}>
                <td className="customer-name">{txn.customer.name}</td>
                <td className="email">{txn.customer.email}</td>
                <td>{txn.customer.whatsappNumber}</td>
                <td>{txn.staff.name}</td>
                <td>{txn.location}</td>
                <td>
                  <span className={`status-badge ${txn.status.toLowerCase()}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="revenue">${txn.totalRevenue || 'N/A'}</td>
                <td>{formatDate(txn.createdAt)}</td>
                <td>{formatDate(txn.updatedAt)}</td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/transactions/edit/${txn._id}`}
                      className="action-btn edit"
                      title="Edit transaction"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(txn._id)}
                      className="action-btn delete"
                      title="Delete transaction"
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
    </div>
  );
};

export default AllTransactionsPage;
