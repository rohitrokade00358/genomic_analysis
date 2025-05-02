import React, { useEffect } from "react";
import { gsap } from "gsap";
import "./CursorEffect.css";

const CursorEffect = () => {
  useEffect(() => {
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    document.addEventListener("mousemove", (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1, // Immediate movement
        ease: "power1.out",
      });

      gsap.to(follower, {
        x: e.clientX - 10, // Offset for better effect
        y: e.clientY - 10,
        duration: 0.2, // Smooth delayed movement
        ease: "power2.out",
      });
    });

    return () => {
      document.removeEventListener("mousemove", () => {});
    };
  }, []);

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-follower"></div>
    </>
  );
};

export default CursorEffect;
