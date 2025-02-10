// StaffTransactionsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';

const StaffTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://147.93.103.220:5001/api/transactions', {
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
        await axios.delete(`http://147.93.103.220:5001/api/transactions/${id}`, {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Transactions</h1>
      <Link to="/transactions/new" className="add-transaction-button">
        <Plus size={20} />
        Add New Transaction
      </Link>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Package</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{txn.customer.name}</td>
              <td>{txn.package.name}</td>
              <td>{txn.status}</td>
              <td>
                <Link to={`/transactions/edit/${txn._id}`}>
                  <Edit size={16} />
                </Link>
                <button onClick={() => handleDelete(txn._id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTransactionsPage;
