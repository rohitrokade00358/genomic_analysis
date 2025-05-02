import React from "react";
import "./AboutUsComponent.css"; // Import custom styles
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is loaded

const AboutUsComponent = () => {
  const teamMembers = [
    { id: 1, name: "Dr.Mohammed Misbahuddin", role: "Head of CDAC,Bangalore", img: "/images/Mohammed Misbahuddin.png" },
    { id: 2, name: "Ms.Karuna P", role: "Project Guide", img: "/images/karuna mam.png" },
    { id: 3, name: "Ms.Nidhi Sahu", role: "Variant Impact Assesment Expert", img: "/images/Nidhi Sahu.png" },
    { id: 4, name: "Ms.Kalpana K L", role: "Variant Impact Assesment Expert", img: "/images/Kalpana.png" },
    { id: 5, name: "Mr.Rohit Rajendra Rokade", role: "Functional Annotation Expert", img: "/images/Rohit.png" },
    { id: 6, name: "Ms.Kalyani Patil", role: "Lung Cancer Prediction Expert", img: "/images/Kalyani.png" },
    { id: 7, name: "Ms.Shivaranjani A", role: "Gene Expression Prediction Expert", img: "/images/Shivaranjani.png" },
  ];

  return (
    <div id="about" className="about-section">
      {/* Background Overlay */}
      <div className="about-overlay"></div>

      <h2 className="about-title">
        <span className="about">About</span> <span className="us">Us</span>
      </h2>

      {/* Quote Section with Background Highlight */}
      <div className="about-quote-container">
        <p className="about-quote">"Together, we innovate and create the future of AI-powered healthcare."</p>
      </div>

      <div className="container">
        {/* Top Images (Centered at the Top) */}
        <div className="row justify-content-center">
          {/* Display the first two team members (ID 1 and 2) at the top */}
          {teamMembers.slice(0, 1).map((member) => (
            <div key={member.id} className="col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center">
              <div className="flip-card top-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img src={member.img} alt={member.name} className="team-image" />
                  </div>
                  <div className="flip-card-back">
                    <h4>{member.name}</h4>
                    <p>{member.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 5 Images in a Single Row (Wider and Aligned) */}
        <div className="row justify-content-center align-items-center">
          {teamMembers.slice(2).map((member) => (
            <div key={member.id} className="col-lg-2 col-md-4 col-sm-6 d-flex justify-content-center">
              <div className="flip-card wide-card"> {/* Wider bottom images */}
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img src={member.img} alt={member.name} className="team-image" />
                  </div>
                  <div className="flip-card-back">
                    <h4>{member.name}</h4>
                    <p>{member.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsComponent;