import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './../css/FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      title: "Payment Terms",
      content: "To confirm your booking, an advance payment of 40% of the total trip amount is required. The remaining 60% should be paid at least 24 hours before the start of the trip or as soon as possible. Prompt payment ensures a seamless experience for your upcoming journey."
    },
    {
      title: "Hotel Check-in and Checkout Timings",
      content: "Our partner hotels have designated check-in time at 1 PM and checkout time at 11 AM. We kindly request your cooperation in adhering to these timings. In case of late checkout or early check-in, additional charges may apply, as determined by the hotel's daily tariff."
    },
    {
      title: "Car Timings",
      content: "The car service will be available for up to 10 hours per day. If your trip begins at 8 AM, the car will be at your disposal until 6 PM. We kindly request that you adhere to the specified timings to avoid any inconvenience. Extension of car service beyond the allocated hours may result in additional charges."
    },
    {
      title: "Responsibility for Personal Belongings",
      content: "Please ensure the safety of your personal belongings throughout your trip. Although we prioritize your comfort and security, we cannot assume responsibility for any loss or damage to your belongings. We recommend exercising caution and vigilance, whether inside the hotel, car, or during visits to various destinations."
    },
    {
      title: "Cancellation and Refund Policy",
      content: "In the event of cancellation, please notify us as soon as possible. Cancellation policies may vary depending on the specific tour package and service providers involved. We will strive to assist you with any applicable refunds, but please note that certain non-refundable expenses may have already been incurred on your behalf."
    },
    {
      title: "Travel Documentation",
      content: "It is your responsibility to ensure that all travel documents, such as Aadhar cards (Indian nationals), passports/visas (non-india visitors), and identification cards, are valid and up to date for the duration of your trip. Any costs or issues arising from inadequate travel documentation will be solely your responsibility."
    },
    {
      title: "Changes or Modifications",
      content: "We understand that unforeseen circumstances may require changes or modifications to your itinerary. Please contact our customer support as soon as possible, and we will do our best to accommodate your requests. However, please note that changes may be subject to availability and additional charges, if applicable."
    },
    {
      title: "Travel Insurance",
      content: "We strongly recommend obtaining comprehensive travel insurance to protect yourself against unforeseen events, medical emergencies, trip cancellations, or other travel-related issues. We can provide guidance on reputable insurance providers if needed."
    },
    {
      title: "Force Majeure",
      content: "In the event of unforeseen circumstances beyond our control, such as natural disasters, civil unrest, or government-imposed restrictions, we reserve the right to modify or cancel your trip. We will make every effort to provide suitable alternatives or refunds, but we cannot be held liable for any losses incurred as a result."
    },
    {
      title: "Liability Disclaimer",
      content: "Please be advised that YatraMiles.in does not offer insurance coverage for accidents, sickness, death, theft, or any other incidents. We strongly recommend visitors to arrange their own insurance in their home country. It is important to note that all personal belongings are solely the responsibility of the client. By participating in our program or Yatra, I acknowledge and willingly accept all associated risks. Yatramiles.in cannot be held liable for any accidents, illnesses, or deaths that may occur during the Yatra."
    },
    {
      title: "Governing Law and Jurisdiction",
      content: "These terms and conditions are governed by the laws of Uttar Pradesh, India. Any disputes or claims arising from or related to our services will be subject to the exclusive jurisdiction of the courts in Uttar Pradesh."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Terms and Conditions</h1>
        <p>Everything you need to know about our travel services</p>
      </div>
      
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <button 
              className="faq-question" 
              onClick={() => toggleAccordion(index)}
            >
              <span>{faq.title}</span>
              <ChevronDown className="faq-icon" />
            </button>
            <div className="faq-answer">
              <div className="faq-answer-content">
                {faq.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;