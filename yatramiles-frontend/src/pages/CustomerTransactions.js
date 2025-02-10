import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://147.93.103.220:5001/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>My Transactions</h1>
      {transactions.length > 0 ? (
        <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            <strong>Package:</strong> {transaction.package.name || 'N/A'} <br />
            <strong>Status:</strong> {transaction.status} <br />
            <strong>Staff Name:</strong> {transaction.staff.name || 'N/A'}
          </li>
        ))}
      </ul>           
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default CustomerTransactions;
