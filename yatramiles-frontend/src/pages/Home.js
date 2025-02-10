import React, { useEffect, useState } from 'react';
import { ArrowRight, Compass, Shield, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './../css/home.css';

// PackageCard Component
const PackageCard = ({ pkg }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (pkg.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pkg.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [pkg.images]);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '15px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
        }}
      >
        Customizable
      </span>
      {pkg.images?.length > 0 ? (
        <img
          src={pkg.images[currentImageIndex]} // Backend already provides full URLs
          alt={pkg.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '5px',
          }}
        >
          <p style={{ color: '#999' }}>Image Not Available</p>
        </div>
      )}
      <h3>{pkg.name}</h3>
      <p>Price: ₹{pkg.price}</p>
      <p>Duration: {pkg.duration} Days</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '15px',
        }}
      >
        <Link
          to={`/packages/${pkg._id}`}
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            border: '1px solid #000',
            borderRadius: '5px 0 0 5px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Book Now!
        </Link>
        <Link
          to="/contact"
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#fff',
            color: '#000',
            textDecoration: 'none',
            border: '1px solid #000',
            borderRadius: '0 5px 5px 0',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

// Home Component
const Home = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1200',
  ];

  // Rotating Background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Fetch Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://147.93.103.220:5001/api/packages'); // Adjust the URL
        setFeaturedPackages(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
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

      {/* Featured Packages Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Packages</h2>
          <p>Handpicked destinations for your next journey</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing destinations...</p>
            </div>
          ) : error ? (
            <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
          ) : featuredPackages.length > 0 ? (
            featuredPackages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
          ) : (
            <p>No packages available at the moment.</p>
          )}
        </div>
      </section>

      {/* Features Section */}
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
