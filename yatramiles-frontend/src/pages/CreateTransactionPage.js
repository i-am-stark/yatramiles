import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateTransactionPage = () => {
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    packageId: '',
    status: 'Initiated',
  });
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [customersResponse, packagesResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/transactions/customers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5001/api/packages', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCustomers(customersResponse.data);
        setPackages(packagesResponse.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Failed to fetch dropdown data');
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/transactions',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Transaction created successfully');
      navigate('/transactions'); // Redirect after success
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to create transaction');
    }
  };

  return (
    <div>
      <h1>Create Transaction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Package</label>
          <select
            name="packageId"
            value={formData.packageId}
            onChange={handleChange}
            required
          >
            <option value="">Select a package</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Initiated">Initiated</option>
            <option value="Paid">Paid</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <button type="submit">Create Transaction</button>
      </form>
    </div>
  );
};

export default CreateTransactionPage;
