import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plane, User, Package, LayoutDashboard } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Navbar.css';
import Logo from '../assets/images/logo.svg';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, isLoggedIn, userRole } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, label, icon: Icon }) => (
    <Link to={to} className="nav-link">
      {Icon && <Icon className="nav-icon" />}
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <img src={Logo} alt="YatraMiles Logo" className="logo-image" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            <NavLink to="/packages" label="All Packages" icon={Package} />
            
            {isLoggedIn && userRole === 'Owner' && (
              <NavLink to="/owner-dashboard" label="Owner Dashboard" icon={LayoutDashboard} />
            )}
            
            {isLoggedIn && userRole === 'Staff' && (
              <NavLink to="/staff-dashboard" label="Staff Dashboard" icon={LayoutDashboard} />
            )}
            
            {isLoggedIn && userRole === 'Customer' && (
              <>
                <NavLink to="/my-transactions" label="My Transactions" />
                <NavLink to="/customer-dashboard" label="Dashboard" icon={LayoutDashboard} />
              </>
            )}
            
            {!isLoggedIn ? (
              <div className="auth-buttons">
                <NavLink to="/login" label="Login" icon={User} />
                <Link to="/register" className="register-button">
                  Register
                </Link>
              </div>
            ) : (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="toggle-icon" /> : <Menu className="toggle-icon" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/about" className="mobile-link">About</Link>
            <Link to="/packages" className="mobile-link">All Packages</Link>
            
            {isLoggedIn && userRole === 'Owner' && (
              <Link to="/owner-dashboard" className="mobile-link">Owner Dashboard</Link>
            )}
            
            {isLoggedIn && userRole === 'Staff' && (
              <Link to="/staff-dashboard" className="mobile-link">Staff Dashboard</Link>
            )}
            
            {isLoggedIn && userRole === 'Customer' && (
              <>
                <Link to="/my-transactions" className="mobile-link">My Transactions</Link>
                <Link to="/customer-dashboard" className="mobile-link">Dashboard</Link>
              </>
            )}
            
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="mobile-link">Login</Link>
                <Link to="/register" className="mobile-register">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="mobile-logout">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;