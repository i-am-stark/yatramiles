import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, Plus, Loader, AlertCircle, Package, Users, Receipt, MessageCircle, TrendingUp, Calendar } from 'lucide-react';
import './../css/OwnerDashboard.css';

const OwnerDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [packagesResponse, transactionsResponse, queriesResponse] = await Promise.all([
        axios.get('http://147.93.103.220:5001/api/packages', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://147.93.103.220:5001/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://147.93.103.220:5001/api/queries', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPackages(packagesResponse.data.slice(0, 10));
      setTransactions(transactionsResponse.data.slice(0, 10));
      setQueries(queriesResponse.data.slice(0, 10));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://147.93.103.220:5001/api/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(packages.filter((pkg) => pkg._id !== id));
        toast.success('Package deleted successfully');
      } catch (error) {
        toast.error('Failed to delete package');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Packages',
      value: packages.length,
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Active Transactions',
      value: transactions.filter((t) => t.status !== 'Completed').length,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Pending Queries',
      value: queries.filter((q) => q.status === 'New' || q.status === 'new').length,
      icon: MessageCircle,
      color: 'orange',
    },
    {
      title: 'This Month',
      value: transactions.filter(
        (t) => new Date(t.createdAt).getMonth() === new Date().getMonth()
      ).length,
      icon: Calendar,
      color: 'purple',
    },
  ];

  const quickActions = [
    {
      to: "/manage-packages",
      icon: Plus,
      label: "New Package",
      color: "blue"
    },
    {
      to: "/owner-transactions",
      icon: Receipt,
      label: "View Transactions",
      color: "green"
    },
    {
      to: "/manage-staff",
      icon: Users,
      label: "Manage Staff",
      color: "orange"
    },
    {
      to: "/queries",
      icon: MessageCircle,
      label: "Handle Queries",
      color: "purple"
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Owner Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business today.</p>
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.to} 
              className={`action-button ${action.color}`}
            >
              <div className="action-icon">
                <action.icon size={20} />
              </div>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item packages-section">
          <div className="section-header">
            <h2>Travel Packages</h2>
            <Link to="/packages" className="view-all">View All</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td>{pkg.name}</td>
                    <td>${pkg.price}</td>
                    <td>{pkg.duration || 'Not specified'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/packages/${pkg._id}`} className="action-btn view">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/packages/edit/${pkg._id}`} className="action-btn edit">
                          <Edit size={16} />
                        </Link>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeletePackage(pkg._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-item transactions-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/transactions" className="view-all">View All</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Revenue</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{txn.customer.name}</td>
                    <td>
                      <div className="contact-info">
                        <span>{txn.customer.email}</span>
                        <span>{txn.customer.whatsappNumber}</span>
                      </div>
                    </td>
                    <td>{txn.location}</td>
                    <td>
                      <span className={`status-badge ${txn.status.toLowerCase()}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td>${txn.totalRevenue || 'N/A'}</td>
                    <td>
                      <Link to={`/transactions/${txn._id}`} className="action-btn view">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-item queries-section">
          <div className="section-header">
            <h2>Recent Queries</h2>
            <Link to="/queries" className="view-all">View All</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Handler</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query._id}>
                    <td>{query.name}</td>
                    <td>
                      <div className="contact-info">
                        <span>{query.email}</span>
                        <span>{query.whatsapp}</span>
                      </div>
                    </td>
                    <td>{query.location}</td>
                    <td>
                      <span className={`status-badge ${query.status.toLowerCase()}`}>
                        {query.status}
                      </span>
                    </td>
                    <td>{query.handler?.name || 'Unassigned'}</td>
                    <td>
                      <Link to={`/queries/${query._id}`} className="action-btn view">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
