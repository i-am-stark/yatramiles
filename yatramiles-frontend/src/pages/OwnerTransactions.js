import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnerTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yatramiles.in/api/transactions', {
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
      <h1>All Transactions</h1>
      {transactions.length > 0 ? (
        <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            <strong>Customer Name:</strong> {transaction.customer.name || 'N/A'} <br />
            <strong>Package:</strong> {transaction.package.name || 'N/A'} <br />
            <strong>Status:</strong> {transaction.status} <br />
            <strong>Created By:</strong> {transaction.staff.name || 'N/A'}
          </li>
        ))}
      </ul>
      
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default OwnerTransactions;
