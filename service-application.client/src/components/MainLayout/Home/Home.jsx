import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "../../../assets/images/hero-bg-abstract.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hero = document.getElementById("hero");
    hero?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="hero" className="hero">
      <img
        src={heroBg}
        alt="Service Platform Background"
        data-aos="fade-in"
        className="img-fluid"
      />

      <div className="container">
        <div className="row justify-content-center" data-aos="zoom-out">
          <div className="col-xl-7 col-lg-9 text-center">
            <h1>Your Trusted Services, One Platform</h1>
            <p>
              Connecting you with skilled professionals and verified service
              providers near your location — fast, reliable, and affordable.
            </p>
          </div>
        </div>

        <div className="text-center" data-aos="zoom-out" data-aos-delay="100">
          <button
            className="btn-get-started"
            onClick={() => navigate("/categories")}
          >
            Find a Service
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
