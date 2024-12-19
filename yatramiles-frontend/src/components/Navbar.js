import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {!token && <li><Link to="/register">Register</Link></li>}
        {!token && <li><Link to="/login">Login</Link></li>}
        {token && (
          <li>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};


export default Navbar;
