import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHomeClick = () => {
    navigate("/"); // Navigate to the root route (Home component)
  };

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to /login on button click
  };

  return (
    <>
      {/* Full-width Navbar */}
      <Navbar expand="lg" fixed="top" className="navbar-box">
        <Container fluid>
          <Navbar.Brand onClick={handleHomeClick} className="navbar-brand">
            <img src="/images/logo.png" alt="Logo" className="navbar-logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto navbar-links">
              <Nav.Link onClick={handleHomeClick} className="nav-item">Home</Nav.Link>
              <Nav.Link onClick={() => scrollToSection("about")} className="nav-item">About</Nav.Link>
              <Nav.Link onClick={() => scrollToSection("analysis")} className="nav-item">Analysis</Nav.Link>
              <Nav.Link onClick={() => scrollToSection("contact")} className="nav-item">Contact Us</Nav.Link>
            </Nav>
            <Button variant="dark" className="custom-login-btn" onClick={handleLoginClick}>
              Login
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Quote Box Below Navbar */}
      <div className="quote-box">
        "Your health is an investment, not an expense."
      </div>
    </>
  );
};
export default NavigationBar;