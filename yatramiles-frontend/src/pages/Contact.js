import React, { useState, useEffect } from 'react';
import { Mail, User, Phone, MapPin, Clipboard, Calendar, DollarSign, Home } from 'lucide-react';
import './../css/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    travelingFrom: '',
    email: '',
    location: '',
    adults: '',
    kids: '',
    extraInfo: '',
    duration: '',
    hotelType: '',
    budget: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Whatsapp number is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email is required';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.adults.trim() || isNaN(formData.adults)) {
      newErrors.adults = 'Number of adults is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit query');

      alert('Thank you for contacting us!');
      setFormData({
        name: '',
        whatsapp: '',
        travelingFrom: '',
        email: '',
        location: '',
        adults: '',
        kids: '',
        extraInfo: '',
        duration: '',
        hotelType: '',
        budget: '',
      });
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <User size={16} /> Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={errors.name && 'error'}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>
            <Phone size={16} /> Whatsapp
          </label>
          <input
            name="whatsapp"
            type="text"
            value={formData.whatsapp}
            onChange={handleChange}
            className={errors.whatsapp && 'error'}
          />
          {errors.whatsapp && <span className="error-text">{errors.whatsapp}</span>}
        </div>

        <div className="form-group">
          <label>
            <Mail size={16} /> Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email && 'error'}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>
            <MapPin size={16} /> Traveling From
          </label>
          <input name="travelingFrom" type="text" value={formData.travelingFrom} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            <MapPin size={16} /> Location
          </label>
          <input name="location" type="text" value={formData.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            <Clipboard size={16} /> No of Adults
          </label>
          <input name="adults" type="number" value={formData.adults} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            <Clipboard size={16} /> No of Kids
          </label>
          <input name="kids" type="number" value={formData.kids} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            <Calendar size={16} /> Tour Duration (days)
          </label>
          <input name="duration" type="number" value={formData.duration} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            <Home size={16} /> Hotel Type
          </label>
          <input name="hotelType" type="text" value={formData.hotelType} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            <DollarSign size={16} /> Budget
          </label>
          <input name="budget" type="number" value={formData.budget} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            <Clipboard size={16} /> Extra Info
          </label>
          <textarea name="extraInfo" value={formData.extraInfo} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Contact;