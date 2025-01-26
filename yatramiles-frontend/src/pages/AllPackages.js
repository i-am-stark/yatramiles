import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/packages/search', {
        params: {
          search: searchTerm,
          ...filters,
        },
      });
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPackages();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Explore Our Packages</h1>

      {/* Search and Filters */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '30px',
        }}
      >
        <input
          type="text"
          placeholder="Search for packages..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              flex: 1,
            }}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              flex: 1,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            name="minDuration"
            placeholder="Min Days"
            value={filters.minDuration}
            onChange={handleFilterChange}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              flex: 1,
            }}
          />
          <input
            type="number"
            name="maxDuration"
            placeholder="Max Days"
            value={filters.maxDuration}
            onChange={handleFilterChange}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              flex: 1,
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {/* Error or Packages */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading packages...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
};

const PackageCard = ({ pkg }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pkg.images.length);
    }, 3000);

    return () => clearInterval(interval);
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
      <img
        src={`http://localhost:5001/${pkg.images[currentImageIndex]}`}
        alt={pkg.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '5px',
        }}
      />
      <h3>{pkg.name}</h3>
      <p>
        Price: <IndianRupee size={16} />
        {pkg.price}
      </p>
      <p>Duration: {pkg.duration} Days</p>

      {/* New Buttons */}
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

export default AllPackages;