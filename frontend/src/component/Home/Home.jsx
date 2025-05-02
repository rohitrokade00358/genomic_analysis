import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./Navbar";
import CarouselComponent from "./CarouselComponent";
import AboutUsComponent from "./AboutUsComponent";
import AnalysisComponent from "./AnalysisComponent";
import FooterComponent from "./FooterComponent";
import CursorEffect from "./CursorEffect";

const Home = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
     
      <NavigationBar scrollToSection={scrollToSection} navigate={navigate} />
      <CarouselComponent id="home" /> {/* Add id for Home section */}
      <AboutUsComponent id="about" /> {/* Add id for About section */}
      <AnalysisComponent id="analysis" /> {/* Add id for Analysis section */}
      <FooterComponent id="contact" scrollToSection={scrollToSection} /> {/* Add id for Contact section */}
    </>
  );
};
export default Home;