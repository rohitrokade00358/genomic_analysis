import React from "react";
import { Carousel } from "react-bootstrap";
import "./CarouselComponent.css"; // Import custom styles

const CarouselComponent = () => {
  return (
    <div id="home">
      <div className="carousel-container ">
        <Carousel fade controls={false} indicators interval={2000} pause={false} wrap>
          <Carousel.Item>
            <img className="d-block w-100 banner-image" src="/images/slide1.webp" alt="Slide 1" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 banner-image" src="/images/slide2.webp" alt="Slide 2" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 banner-image" src="/images/slide3.webp" alt="Slide 3" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 banner-image" src="/images/slide8.webp" alt="Slide 4" />
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselComponent;
