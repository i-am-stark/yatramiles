import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      console.log('Sending Login Request:', formData);
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);

      // Store the token in localStorage
      console.log('Login Successful, Token:', response.data.token);
      localStorage.setItem('token', response.data.token);

      // Decode the token to get the user role
      const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
      const userRole = tokenPayload.role;

      // Redirect based on the user role
      if (userRole === 'Owner') navigate('/owner-dashboard');
      else if (userRole === 'Staff') navigate('/staff-dashboard');
      else if (userRole === 'Customer') navigate('/customer-dashboard');
    } catch (error) {
      // Handle errors
      console.error('Error in Login:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
