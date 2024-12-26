import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader, AlertCircle } from 'lucide-react';
import './../css/AllTransactionsPage.css';

const AllTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/transactions', {
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
        await axios.delete(`http://localhost:5001/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(transactions.filter((txn) => txn._id !== id));
        alert('Transaction deleted successfully');
      } catch (error) {
        alert('Failed to delete transaction');
      }
    }
  };

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

      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Staff</th>
              <th>Package</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{txn.customer.name}</td>
                <td>{txn.staff.name}</td>
                <td>{txn.package.name}</td>
                <td>
                  <span className={`status-badge ${txn.status.toLowerCase()}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <Link
                    to={`/transactions/edit/${txn._id}`}
                    className="edit-button"
                    title="Edit transaction"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(txn._id)}
                    className="delete-button"
                    title="Delete transaction"
                  >
                    <Trash2 size={16}/>
                  </button>
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