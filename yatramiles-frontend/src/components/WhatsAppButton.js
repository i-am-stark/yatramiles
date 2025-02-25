import React from "react";
import { MessageSquareText } from "lucide-react"; // Import WhatsApp-like icon from Lucide

const WhatsAppButton = () => {
  const phoneNumber = "7536048161"; // Your WhatsApp Number
  const message = "Hello! I need more information."; // Default message
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366",
        color: "white",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        textDecoration: "none",
        fontSize: "30px",
        zIndex: 1000,
      }}
    >
      <MessageSquareText size={32} color="white" />
    </a>
  );
};

export default WhatsAppButton;

