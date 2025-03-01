import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader, AlertCircle, ChevronDown, ChevronUp, Filter, Search, RefreshCw, DollarSign } from 'lucide-react';
import './../css/AllTransactionsPage.css';

const AllTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
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
      const aValue = key.includes('.') 
        ? key.split('.').reduce((obj, prop) => obj && obj[prop], a) 
        : a[key];
      const bValue = key.includes('.') 
        ? key.split('.').reduce((obj, prop) => obj && obj[prop], b) 
        : b[key];

      // Handle null or undefined values
      if (aValue === null || aValue === undefined) return direction === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return direction === 'asc' ? 1 : -1;

      // Handle date strings
      if (key === 'createdAt' || key === 'updatedAt') {
        return direction === 'asc' 
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numbers
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    setSortConfig({ key, direction });
    setTransactions(sortedTransactions);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? '' : status);
  };

  const filteredTransactions = transactions.filter(txn => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      (txn.customer?.name || '').toLowerCase().includes(searchLower) ||
      (txn.customer?.email || '').toLowerCase().includes(searchLower) ||
      (txn.customer?.whatsappNumber || '').toLowerCase().includes(searchLower) ||
      (txn.location || '').toLowerCase().includes(searchLower) ||
      (txn.status || '').toLowerCase().includes(searchLower) ||
      (txn.staff?.name || '').toLowerCase().includes(searchLower)
    );

    const matchesStatus = !statusFilter || txn.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="sort-icons"><ChevronUp size={14} /><ChevronDown size={14} /></span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon active"><ChevronUp size={14} /></span>
      : <span className="sort-icon active"><ChevronDown size={14} /></span>;
  };

  // Get unique statuses for filter
  const statuses = [...new Set(transactions.map(txn => txn.status))].filter(Boolean);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <Loader size={32} />
        </div>
        <p className="loading-text">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <div className="header-content">
          <h1>All Transactions</h1>
          <p className="header-description">Manage and track all your business transactions</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {error ? (
        <div className="error-container">
          <AlertCircle size={24} />
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchTransactions}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="table-stats">
            <div className="stats-item">
              <span className="stats-label">Total Transactions:</span>
              <span className="stats-value">{transactions.length}</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Filtered Results:</span>
              <span className="stats-value">{filteredTransactions.length}</span>
            </div>
            {statusFilter && (
              <div className="stats-item">
                <span className="stats-label">Status Filter:</span>
                <span className={`status-badge status-${statusFilter.toLowerCase().replace(/\s+/g, '-')}`}>
                  {statusFilter}
                </span>
                <button 
                  className="clear-filter-button" 
                  onClick={() => setStatusFilter('')}
                  title="Clear status filter"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {statuses.length > 0 && (
            <div className="status-filters">
              <span className="filter-label">Filter by status:</span>
              <div className="status-buttons">
                {statuses.map(status => (
                  <button
                    key={status}
                    className={`status-filter-button ${status === statusFilter ? 'active' : ''}`}
                    onClick={() => handleStatusFilter(status)}
                  >
                    <span className={`status-dot status-${status.toLowerCase().replace(/\s+/g, '-')}`}></span>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredTransactions.length === 0 ? (
            <div className="no-results">
              <Filter size={48} />
              <h3>No transactions found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              {(searchTerm || statusFilter) && (
                <div className="clear-filters">
                  {searchTerm && (
                    <button className="clear-button" onClick={() => setSearchTerm('')}>
                      Clear Search
                    </button>
                  )}
                  {statusFilter && (
                    <button className="clear-button" onClick={() => setStatusFilter('')}>
                      Clear Status Filter
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
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
                    <th onClick={() => sortTransactions('createdAt')}>
                      Created {getSortIcon('createdAt')}
                    </th>
                    <th className="actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn) => (
                    <tr key={txn._id}>
                      <td className="customer-name">{txn.customer?.name || 'N/A'}</td>
                      <td className="customer-email">{txn.customer?.email || 'N/A'}</td>
                      <td className="customer-contact">{txn.customer?.whatsappNumber || 'N/A'}</td>
                      <td className="staff-name">{txn.staff?.name || 'Unassigned'}</td>
                      <td className="location">{txn.location || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${(txn.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                          {txn.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="date-cell">{formatDate(txn.createdAt)}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <Link
                            to={`/transactions/edit/${txn._id}`}
                            className="action-button edit-button"
                            title="Edit transaction"
                          >
                            <Edit size={16} />
                            <span className="action-text">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(txn._id)}
                            className="action-button delete-button"
                            title="Delete transaction"
                          >
                            <Trash2 size={16} />
                            <span className="action-text">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllTransactionsPage;