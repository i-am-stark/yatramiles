import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Loader, 
  AlertCircle, 
  MapPin, 
  Clock, 
  IndianRupee, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Plane,
  Coffee,
  XCircle,
  AlertTriangle,
  Heart
} from 'lucide-react';
import './../css/PackageDetails.css';

const PackageDetails = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/packages/${id}`);
        setPackageDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  useEffect(() => {
    if (packageDetails?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % packageDetails.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [packageDetails?.images]);

  const handlePrevImage = () => {
    if (packageDetails?.images?.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + packageDetails.images.length) % packageDetails.images.length
      );
    }
  };

  const handleNextImage = () => {
    if (packageDetails?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % packageDetails.images.length);
    }
  };

  const handleBookNow = () => {
    // Implement booking functionality
    console.log('Booking package:', packageDetails?.name);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader className="spin" size={40} />
        <p>Loading package details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="package-details-container">
      <div className="package-header">
        <h1 className="package-title">{packageDetails.name}</h1>
        <button 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart fill={isLiked ? "#ff4757" : "none"} />
        </button>
      </div>

      <div className="package-image-section">
        <div className="package-image-carousel">
          {packageDetails.images?.length > 0 && (
            <>
              <button className="carousel-arrow left-arrow" onClick={handlePrevImage}>
                <ChevronLeft size={24} />
              </button>
              <img
                src={`http://localhost:5001/${packageDetails.images[currentImageIndex]}`}
                alt={packageDetails.name}
                className="carousel-image"
              />
              <button className="carousel-arrow right-arrow" onClick={handleNextImage}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
        
        <div className="image-indicators">
          {packageDetails.images?.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="package-highlights">
        <div className="highlight-card">
          <IndianRupee size={24} />
          <div className="highlight-content">
            <h3>Price</h3>
            <p>₹{packageDetails.price}</p>
          </div>
        </div>
        <div className="highlight-card">
          <Clock size={24} />
          <div className="highlight-content">
            <h3>Duration</h3>
            <p>{packageDetails.duration} days</p>
          </div>
        </div>
        <div className="highlight-card">
          <MapPin size={24} />
          <div className="highlight-content">
            <h3>Destination</h3>
            <p>{packageDetails.destination || 'Not specified'}</p>
          </div>
        </div>
      </div>

      <div className="package-content">
        <div className="content-section">
          <h2><Calendar size={20} /> Overview</h2>
          <p>{packageDetails.packageOverview}</p>
        </div>

        <div className="content-section">
          <h2><Plane size={20} /> Tour Itinerary</h2>
          <p>{packageDetails.tourItinerary}</p>
        </div>

        <div className="content-section">
          <h2><Coffee size={20} /> Inclusions</h2>
          <p>{packageDetails.inclusions}</p>
        </div>

        <div className="content-section">
          <h2><XCircle size={20} /> Exclusions</h2>
          <p>{packageDetails.exclusions}</p>
        </div>

        <div className="content-section">
          <h2><AlertTriangle size={20} /> Important Notes</h2>
          <p>{packageDetails.importantNotes}</p>
        </div>
      </div>

      <div className="booking-section">
        <button className="book-now-button" onClick={handleBookNow}>
          Book Now
        </button>
        <p className="booking-note">* Secure your adventure today with instant booking</p>
      </div>
    </div>
  );
};

export default PackageDetails;