import React, { useState, useEffect } from "react";
import "./AnalysisComponent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const functionalities = [
  {
    id: 1,
    title: "Gene Expression Prediction",
    img: "/images/gene.jpg",
    description: "Prediction of gene expression levels based on DNA sequences to find which gene has stronger and weaker impact, also regulatory elements bio meta tracks.",
    video: "/video/gene.mp4",
    inputDescription: "DNA sequence file (.fasta, .fa)",
    outputDescription: "Contribution scores, biometa tracks, and gene expression levels.",
  },
  {
    id: 2,
    title: "Lung Cancer Prediction",
    img: "/images/lung.jpg",
    description: "Prediction of lung cancer by evaluating on unseen data to assess accuracy and other metrics.",
    video: "/video/lung.mp4",
    inputDescription: "X-ray image of lung",
    outputDescription: "Prediction of lung cancer or not.",
  },
  {
    id: 3,
    title: "Variant Impact Assessment",
    img: "/images/variant.jpg",
    description: "Evaluated the functional effects of genetic mutations by calculating variant scores from gene sequences and categorizing variants into 'benign', 'pathogenic', 'likely pathogenic', 'uncertain' based on scores.",
    video: "/images/dna.mp4",
    inputDescription: "DNA sequence file (.fasta, .fa) and ClinVar file (.vcf)",
    outputDescription: "Variant scores, categorization charts.",
  },
  {
    id: 4,
    title: "Functional Annotation",
    img: "/images/annotation.jpg",
    description: "Analyzing the biological/functional significance of genetic variants by calculating the prior and likelihood and predicting the most likely functional category.",
    video: "/video/annotation.mp4",
    inputDescription: "DNA sequence or protein data (.fasta)",
    outputDescription: "Predicts the functional annotations of genes and recommends therapeutic targets.",
  },
];

const AnalysisComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFunctionality, setSelectedFunctionality] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".analysis-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setAnimate(true);
        } else {
          setAnimate(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShow = (func) => {
    setSelectedFunctionality(func);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div id="analysis">
      <div className="analysis-section">
        <h2 className="analysis-title">Analysis</h2>
        <div className="container">
          <div className="row">
            {functionalities.map((func, index) => (
              <div
                key={func.id}
                className={`col-lg-6 col-md-6 mb-4 analysis-card-wrapper ${
                  animate ? (index % 2 === 0 ? "slide-in-left" : "slide-in-right") : ""
                }`}
              >
                <div className="analysis-card" onClick={() => handleShow(func)}>
                  <div className="analysis-image-container">
                    <img src={func.img} alt={func.title} className="analysis-image" />
                    <div className="analysis-title-overlay">
                      {func.title}
                      <span className="arrow-down">↓</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedFunctionality && (
          <Modal show={showModal} onHide={handleClose} centered className="custom-modal modal-large fade-in">
            <Modal.Header closeButton className="modal-header-highlight">
              <Modal.Title>{selectedFunctionality.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-blue">
              <div className="modal-content-wrapper">
                <div className="modal-video-section">
                  <video
                    src={selectedFunctionality.video}
                    className="modal-video"
                    controls
                    onClick={(e) => e.target.requestFullscreen()}
                  />
                  <p className="modal-description">{selectedFunctionality.description}</p>
                </div>
                <div className="modal-info-section">
                  <div className="input-description">
                    <h5 className="highlight-title">Input :</h5>
                    <p>{selectedFunctionality.inputDescription}</p>
                  </div>
                  <div className="output-description">
                    <h5 className="highlight-title">Output :</h5>
                    <p>{selectedFunctionality.outputDescription}</p>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AnalysisComponent;