import React, { useState } from 'react';
import { Mail, User, Phone, MapPin, Clipboard, Calendar, DollarSign, Home, Send } from 'lucide-react';
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
    <div className="contact-container">
      <div className="contact-header">
        <h1>Plan Your Dream Vacation</h1>
        <p>Fill out the form below and we'll help you create the perfect travel experience</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>
              <User size={18} />
              <span>Name</span>
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Your full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>
              <Phone size={18} />
              <span>WhatsApp</span>
            </label>
            <input
              name="whatsapp"
              type="text"
              value={formData.whatsapp}
              onChange={handleChange}
              className={errors.whatsapp ? 'error' : ''}
              placeholder="WhatsApp number"
            />
            {errors.whatsapp && <span className="error-text">{errors.whatsapp}</span>}
          </div>

          <div className="form-group">
            <label>
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>
              <MapPin size={18} />
              <span>Traveling From</span>
            </label>
            <input
              name="travelingFrom"
              type="text"
              value={formData.travelingFrom}
              onChange={handleChange}
              placeholder="Your city"
            />
          </div>

          <div className="form-group">
            <label>
              <MapPin size={18} />
              <span>Destination</span>
            </label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
              placeholder="Where to?"
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label>
              <Clipboard size={18} />
              <span>Number of Adults</span>
            </label>
            <input
              name="adults"
              type="number"
              value={formData.adults}
              onChange={handleChange}
              className={errors.adults ? 'error' : ''}
              placeholder="0"
              min="1"
            />
            {errors.adults && <span className="error-text">{errors.adults}</span>}
          </div>

          <div className="form-group">
            <label>
              <Clipboard size={18} />
              <span>Number of Kids</span>
            </label>
            <input
              name="kids"
              type="number"
              value={formData.kids}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>
              <Calendar size={18} />
              <span>Duration (days)</span>
            </label>
            <input
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Number of days"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>
              <Home size={18} />
              <span>Hotel Preference</span>
            </label>
            <select name="hotelType" value={formData.hotelType} onChange={handleChange}>
              <option value="">Select hotel type</option>
              <option value="budget">Budget</option>
              <option value="standard">Standard</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <DollarSign size={18} />
              <span>Budget</span>
            </label>
            <input
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Your budget"
              min="0"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>
            <Clipboard size={18} />
            <span>Additional Information</span>
          </label>
          <textarea
            name="extraInfo"
            value={formData.extraInfo}
            onChange={handleChange}
            placeholder="Tell us more about your travel preferences..."
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send size={18} />
              <span>Send Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Contact;