import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Trash2, User, Mail, Lock, Loader, Users } from 'lucide-react';
import './../css/ManageStaffPage.css';

const ManageStaffPage = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://api.yatramiles.in/api/auth/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffMembers(response.data);
    } catch (error) {
      toast.error('Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://api.yatramiles.in/api/auth/staff',
        { ...newStaff },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Staff member added successfully');
      fetchStaff();
      setNewStaff({ name: '', email: '', password: '' });
    } catch (error) {
      toast.error('Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from staff?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yatramiles.in/api/auth/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Staff member removed successfully');
        fetchStaff();
      } catch (error) {
        toast.error('Failed to remove staff member');
      }
    }
  };

  return (
    <div className="manage-staff-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Manage Staff</h1>
          <p>Add and manage staff members of your organization</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="add-staff-section">
          <div className="card">
            <div className="card-header">
              <h2>Add New Staff Member</h2>
              <p>Create login credentials for new staff</p>
            </div>

            <form onSubmit={handleAddStaff} className="add-staff-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <User size={20} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={newStaff.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <Mail size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={newStaff.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <Lock size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newStaff.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader className="spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                <span>{isSubmitting ? 'Adding...' : 'Add Staff Member'}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="staff-list-section">
          <div className="card">
            <div className="card-header">
              <h2>Current Staff Members</h2>
              <p>Manage existing staff accounts</p>
            </div>

            {loading ? (
              <div className="loading-state">
                <Loader className="spin" size={40} />
                <p>Loading staff members...</p>
              </div>
            ) : staffMembers.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <h3>No Staff Members</h3>
                <p>Add your first staff member to get started</p>
              </div>
            ) : (
              <div className="staff-list">
                {staffMembers.map((staff) => (
                  <div key={staff._id} className="staff-card">
                    <div className="staff-info">
                      <div className="staff-avatar">
                        <User size={24} />
                      </div>
                      <div className="staff-details">
                        <h3>{staff.name}</h3>
                        <p>{staff.email}</p>
                      </div>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteStaff(staff._id, staff.name)}
                      title="Remove staff member"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStaffPage;
