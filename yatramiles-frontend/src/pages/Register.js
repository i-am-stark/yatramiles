import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);
      alert(response.data.message); // Replace with a toast notification later
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/verify-otp', {
        email: formData.email,
        otp,
      });
      alert(response.data.message); // Replace with a toast notification later
    } catch (error) {
      alert(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div>
      {!otpSent ? (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <button type="submit">Register</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default Register;
