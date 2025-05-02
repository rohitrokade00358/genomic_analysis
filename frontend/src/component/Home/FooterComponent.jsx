import React from "react";
import "./FooterComponent.css"; // Import styles
import { FaHome, FaUser, FaChartBar, FaEnvelope } from "react-icons/fa"; // Import icons

const FooterComponent = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content" id="contact">
        {/* Left Section - Logo & Address */}
        <div className="footer-left">
          <h2 className="footer-logo">
            <span className="genovate">Genovate</span><span className="ai">AI</span>
          </h2>
          <p>Wipro Gate, Electronic City</p>
          <p>Pincode: 560100</p>
          <p>Bangalore, Karnataka</p>
          <p><a href="https://www.genovateAI.com" target="_blank" rel="noopener noreferrer">www.genovateAI.com</a></p>
        </div>

        {/* Right Section - Navigation Links with Icons */}
        <div className="footer-right">
          <ul className="footer-nav">
            <li onClick={() => scrollToSection("home")}>
              <FaHome className="footer-icon" /> HOME
            </li>
            <li onClick={() => scrollToSection("about")}>
              <FaUser className="footer-icon" /> ABOUT US
            </li>
            <li onClick={() => scrollToSection("analysis")}>
              <FaChartBar className="footer-icon" /> ANALYSIS
            </li>
            <li onClick={() => scrollToSection("contact")}>
              <FaEnvelope className="footer-icon" /> CONTACT US
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="footer-bottom">
        <p>© Copyright 2025</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
