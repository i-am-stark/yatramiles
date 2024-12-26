import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditTransactionPage = () => {
  const { transactionId } = useParams(); // Extract transactionId from URL
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/transactions/${transactionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransaction(response.data);
        setStatus(response.data.status); // Populate status from fetched data
      } catch (err) {
        setError('Transaction ID is invalid.');
        toast.error('Transaction ID is invalid.');
        navigate('/'); // Redirect to transactions page
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/transactions/${transactionId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Transaction updated successfully!');
      navigate('/'); // Redirect after successful update
    } catch (err) {
      toast.error('Failed to update transaction');
    }
  };

  if (loading) return <p>Loading transaction...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Edit Transaction</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Initiated">Initiated</option>
          <option value="Paid">Paid</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
        <button type="submit">Update Transaction</button>
      </form>
    </div>
  );
};

export default EditTransactionPage;
