import React, { useState } from 'react';
import './Footer.css';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';


function Footer() {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <div className="footer-contact-list">
            <a href="tel:+15551234567" className="footer-contact-item">
              <Phone className="footer-icon" />
              <span>+1 (555) 123-4567</span>
            </a>
            <a href="mailto:info@travelpro.com" className="footer-contact-item">
              <Mail className="footer-icon" />
              <span>info@travelpro.com</span>
            </a>
            <div className="footer-contact-item">
              <MapPin className="footer-icon" />
              <span>123 Travel Street, City, Country</span>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/packages" className="hover:text-blue-400">All Packages</Link></li>
            <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="footer-section">
          <h3 className="footer-title">Legal</h3>
          <ul className="footer-links">
            <li><Link to="/faq" className="hover:text-blue-400">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section">
          <h3 className="footer-title">Newsletter</h3>
          <p className="footer-text">
            Subscribe to get special offers and travel updates!
          </p>
          <form className="footer-form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="footer-input"
              required
            />
            <button type="submit" className="footer-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} TravelPro. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;