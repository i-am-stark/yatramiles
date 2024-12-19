import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const updateTransactionStatus = async (transactionId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/transactions/${transactionId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === transactionId ? { ...transaction, status } : transaction
        )
      );
      alert('Transaction status updated!');
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  return (
    <div>
      <h1>My Transactions</h1>
      {transactions.length > 0 ? (
        <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            <strong>Customer Name:</strong> {transaction.customer.name || 'N/A'} <br />
            <strong>Package:</strong> {transaction.package.name || 'N/A'} <br />
            <strong>Status:</strong> {transaction.status} <br />
            <button onClick={() => updateTransactionStatus(transaction._id, 'Completed')}>
              Mark as Completed
            </button>
          </li>
        ))}
      </ul>      
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default StaffTransactions;
