import React from 'react';
import { Users, Globe, Award, MapPin, Clock, Shield } from 'lucide-react';
import './../css/About.css';

const About = () => {
  const coreValues = [
    {
      icon: <Users className="value-icon" />,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above all else."
    },
    {
      icon: <Globe className="value-icon" />,
      title: "Sustainability",
      description: "We promote responsible tourism and environmental conservation."
    },
    {
      icon: <Award className="value-icon" />,
      title: "Excellence",
      description: "We strive for excellence in every service we provide."
    },
    {
      icon: <MapPin className="value-icon" />,
      title: "Local Impact",
      description: "We support local communities and preserve cultural heritage."
    },
    {
      icon: <Clock className="value-icon" />,
      title: "Reliability",
      description: "We deliver consistent and dependable travel experiences."
    },
    {
      icon: <Shield className="value-icon" />,
      title: "Trust",
      description: "We build lasting relationships through transparency and integrity."
    }
  ];

  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      quote: "Passionate about transforming travel experiences"
    },
    {
      name: 'Sarah Johnson',
      role: 'Operations Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      quote: "Creating seamless journeys for our customers"
    },
    {
      name: 'Michael Chen',
      role: 'Head of Customer Experience',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      quote: "Dedicated to exceptional service delivery"
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>About YatraMiles</h1>
          <p>Creating unforgettable travel experiences since 2010</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="mission-vision-container">
          <div className="mission-box">
            <h2>Our Mission</h2>
            <p>To provide exceptional travel experiences that inspire and connect people with diverse cultures, while ensuring sustainable and responsible tourism practices.</p>
          </div>
          <div className="vision-box">
            <h2>Our Vision</h2>
            <p>To become the world's most trusted travel partner, known for innovation, sustainability, and creating lasting memories for our customers.</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          {coreValues.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon-wrapper">
                {value.icon}
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Our Leadership Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-image-wrapper">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p className="team-quote">"{member.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;