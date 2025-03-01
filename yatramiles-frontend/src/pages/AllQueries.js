import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader, AlertCircle, Edit, Trash2, ChevronDown, ChevronUp, Search, RefreshCw, Filter } from 'lucide-react';
import './../css/AllQueries.css';

const AllQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://api.yatramiles.in/api/queries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueries(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yatramiles.in/api/queries/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQueries(queries.filter((query) => query._id !== id));
        alert('Query deleted successfully');
      } catch (error) {
        alert('Failed to delete query');
      }
    }
  };

  const sortQueries = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const sortedQueries = [...queries].sort((a, b) => {
      const aValue = key.includes('.') ? key.split('.').reduce((obj, prop) => obj && obj[prop], a) : a[key];
      const bValue = key.includes('.') ? key.split('.').reduce((obj, prop) => obj && obj[prop], b) : b[key];

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
    setQueries(sortedQueries);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredQueries = queries.filter(query => 
    query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.whatsapp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.handler?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="sort-icons"><ChevronUp size={14} /><ChevronDown size={14} /></span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon active"><ChevronUp size={14} /></span>
      : <span className="sort-icon active"><ChevronDown size={14} /></span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <Loader size={32} />
        </div>
        <p className="loading-text">Loading queries...</p>
      </div>
    );
  }

  return (
    <div className="queries-container">
      <div className="queries-header">
        <div className="header-content">
          <h1>All Queries</h1>
          <p className="header-description">Manage and respond to all customer queries from this page.</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search queries..." 
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
          <button className="retry-button" onClick={fetchQueries}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="table-stats">
            <div className="stats-item">
              <span className="stats-label">Total Queries:</span>
              <span className="stats-value">{queries.length}</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Filtered Results:</span>
              <span className="stats-value">{filteredQueries.length}</span>
            </div>
          </div>

          {filteredQueries.length === 0 ? (
            <div className="no-results">
              <Filter size={48} />
              <h3>No queries found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="queries-table">
                <thead>
                  <tr>
                    <th onClick={() => sortQueries('name')}>
                      Customer Name {getSortIcon('name')}
                    </th>
                    <th onClick={() => sortQueries('email')}>
                      Email {getSortIcon('email')}
                    </th>
                    <th onClick={() => sortQueries('whatsapp')}>
                      WhatsApp {getSortIcon('whatsapp')}
                    </th>
                    <th onClick={() => sortQueries('status')}>
                      Status {getSortIcon('status')}
                    </th>
                    <th onClick={() => sortQueries('handler.name')}>
                      Handler {getSortIcon('handler.name')}
                    </th>
                    <th onClick={() => sortQueries('createdAt')}>
                      Created {getSortIcon('createdAt')}
                    </th>
                    <th onClick={() => sortQueries('updatedAt')}>
                      Updated {getSortIcon('updatedAt')}
                    </th>
                    <th className="actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.map((query) => (
                    <tr key={query._id}>
                      <td className="customer-name">{query.name || 'N/A'}</td>
                      <td className="customer-email">{query.email || 'N/A'}</td>
                      <td className="customer-whatsapp">{query.whatsapp || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${query.status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
                          {query.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="handler-name">{query.handler?.name || 'Unassigned'}</td>
                      <td className="date-cell">{formatDate(query.createdAt)}</td>
                      <td className="date-cell">{formatDate(query.updatedAt)}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <Link
                            to={`/queries/edit/${query._id}`}
                            className="action-button edit-button"
                            title="Edit query"
                          >
                            <Edit size={16} />
                            <span className="action-text">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(query._id)}
                            className="action-button delete-button"
                            title="Delete query"
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

export default AllQueries;