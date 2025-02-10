import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader, AlertCircle, Eye, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './../css/AllQueries.css';

const AllQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://147.93.103.220:5001/api/queries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueries(response.data);
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
        await axios.delete(`http://147.93.103.220:5001/api/queries/${id}`, {
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
      const aValue = key.includes('.') ? key.split('.').reduce((obj, prop) => obj[prop], a) : a[key];
      const bValue = key.includes('.') ? key.split('.').reduce((obj, prop) => obj[prop], b) : b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setQueries(sortedQueries);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString(); // Format as MM/DD/YYYY
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader className="loading-spinner" />
        <p>Loading queries...</p>
      </div>
    );
  }

  return (
    <div className="queries-page">
      <div className="queries-header">
        <h1>All Queries</h1>
        <p>Manage and respond to all customer queries from this page.</p>
      </div>

      {error ? (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="table-container">
          <table className="queries-table">
            <thead>
              <tr>
                <th onClick={() => sortQueries('name')}>Customer Name <ChevronUp /> <ChevronDown /></th>
                <th onClick={() => sortQueries('email')}>Email <ChevronUp /> <ChevronDown /></th>
                <th onClick={() => sortQueries('whatsapp')}>Whatsapp <ChevronUp /> <ChevronDown /></th>
                <th onClick={() => sortQueries('status')}>Status <ChevronUp /> <ChevronDown /></th>
                <th onClick={() => sortQueries('handler.name')}>Handler <ChevronUp /> <ChevronDown /></th>
                <th onClick={() => sortQueries('createdAt')}>Created At <ChevronUp /> <ChevronDown /></th>
                <th onClick={() => sortQueries('updatedAt')}>Updated At <ChevronUp /> <ChevronDown /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query._id}>
                  <td>{query.name}</td>
                  <td>{query.email}</td>
                  <td>{query.whatsapp}</td>
                  <td>
                    <span className={`status-badge ${query.status.toLowerCase()}`}>
                      {query.status}
                    </span>
                  </td>
                  <td>{query.handler?.name || 'Unassigned'}</td>
                  <td>{formatDate(query.createdAt)}</td>
                  <td>{formatDate(query.updatedAt)}</td>
                  <td className="action-buttons">
                    <Link
                      to={`/queries/${query._id}`}
                      className="view-button"
                      title="View query details"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/queries/edit/${query._id}`}
                      className="edit-button"
                      title="Edit query"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(query._id)}
                      className="delete-button"
                      title="Delete query"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllQueries;
