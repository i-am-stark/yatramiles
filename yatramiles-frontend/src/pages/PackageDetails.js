import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, AlertCircle, MapPin, Clock, DollarSign } from 'lucide-react';
import './../css/PackageDetails.css'; // Create a CSS file for styling this page.

const PackageDetails = () => {
  const { id } = useParams(); // Get the package ID from the URL.
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <h1>{packageDetails.name}</h1>
      <div className="package-images">
        {packageDetails.images?.map((image, index) => (
          <img key={index} src={`http://localhost:5001/${image}`} alt={packageDetails.name} />
        ))}
      </div>
      <div className="package-info">
        <div className="detail-item">
          <DollarSign size={16} />
          <span>Price: ${packageDetails.price}</span>
        </div>
        <div className="detail-item">
          <Clock size={16} />
          <span>Duration: {packageDetails.duration} days</span>
        </div>
        <div className="detail-item">
          <MapPin size={16} />
          <span>Destination: {packageDetails.destination || 'Not specified'}</span>
        </div>
      </div>
      <div className="package-description">
        <h2>Description</h2>
        <p>{packageDetails.description}</p>
      </div>
    </div>
  );
};

export default PackageDetails;
