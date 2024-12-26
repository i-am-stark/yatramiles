import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../css/CustomerDashboard.css'; // Ensure you have a CSS file for styling
// import { toast } from 'react-toastify';

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
        setTransactions(response.data); // Set transactions in state
        setError('');
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
      <h1>Customer Dashboard</h1>
      <p>Track your transactions and manage your account.</p>

      {loading ? (
        <p>Loading your transactions...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : transactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Transaction Date</th>
              <th>Status</th>
              <th>Staff</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.package?.name || 'N/A'}</td>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td>{transaction.status}</td>
                <td>{transaction.staff?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found. Start by booking a package!</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
