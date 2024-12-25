import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../css/CustomerDashboard.css'; // Ensure you have a CSS file for styling

const CustomerDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await axios.get('http://localhost:5001/api/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="customer-dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <p>Here are your recent transactions:</p>

      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : transactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Package</th>
              <th>Status</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{txn._id}</td>
                <td>{txn.package.name}</td>
                <td>{txn.status}</td>
                <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                <td>${txn.amount || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
