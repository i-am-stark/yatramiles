import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Clock, Compass, Shield, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './../css/home.css';

const Home = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1200',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/packages');
        setFeaturedPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="home">
      <section 
        className="hero-section" 
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore the world with our curated travel packages. Create memories that last a lifetime.</p>
          <Link to="/packages" className="hero-button">
            View All Packages
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Packages</h2>
          <p>Handpicked destinations for your next journey</p>
        </div>
        <div className="featured-grid">
          {featuredPackages.length > 0 ? (
            featuredPackages.map((pkg) => (
              <div key={pkg._id} className="package-card">
                <div className="package-image-container">
                  {pkg.images?.[0] ? (
                    <img src={pkg.images[0]} alt={pkg.name} loading="lazy" />
                  ) : (
                    <div className="placeholder-image">Image Not Available</div>
                  )}
                  <div className="package-price">
                    <span>${pkg.price || 'Price not available'}</span>
                  </div>
                </div>
                <div className="package-details">
                  <h3>{pkg.name}</h3>
                  <div className="package-info">
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>{pkg.destination || 'Destination not provided'}</span>
                    </div>
                    <div className="info-item">
                      <Clock size={16} />
                      <span>{pkg.duration || 'Duration not specified'}</span>
                    </div>
                  </div>
                  <Link to={`/packages/${pkg._id}`} className="view-details-button">
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing destinations...</p>
            </div>
          )}
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <p>Experience the difference with our premium services</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <Compass size={32} />
            <h3>Handpicked Destinations</h3>
            <p>Carefully selected locations to ensure the best travel experience.</p>
          </div>
          <div className="feature-card">
            <Shield size={32} />
            <h3>Best Price Guarantee</h3>
            <p>We offer competitive prices and valuable packages.</p>
          </div>
          <div className="feature-card">
            <Headphones size={32} />
            <h3>24/7 Support</h3>
            <p>Round-the-clock assistance for all your travel needs.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;