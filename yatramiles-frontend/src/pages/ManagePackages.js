import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: null });

  useEffect(() => {
    // Fetch existing packages
    const fetchPackages = async () => {
      const response = await axios.get('http://localhost:5001/api/packages');
      setPackages(response.data);
    };
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      await axios.post('http://localhost:5001/api/packages', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Package added successfully!');
    } catch (error) {
      toast.error('Failed to add package!');
    }
  };

  return (
    <div>
      <h1>Manage Packages</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        <input type="file" name="image" onChange={handleFileChange} required />
        <button type="submit">Add Package</button>
      </form>

      <h2>Existing Packages</h2>
      <ul>
        {packages.map((pkg) => (
          <li key={pkg._id}>
            {pkg.name} - ${pkg.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePackages;
