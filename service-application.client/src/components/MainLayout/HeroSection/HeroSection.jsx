import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import heroBg from "./hero-bg-abstract.jpg";

const HeroSection = () => {
  // Smooth scroll to Hero when this page loads
  useEffect(() => {
    const hero = document.getElementById("hero");
    hero?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="hero" className="hero">
      {/* Background Image */}
      <img
        src={heroBg}
        alt="Service Platform Background"
        data-aos="fade-in"
        className="img-fluid"
      />

      <div className="container">
        {/* Heading */}
        <div className="row justify-content-center" data-aos="zoom-out">
          <div className="col-xl-7 col-lg-9 text-center">
            <h1>Your Trusted Services, One Platform</h1>
            <p>
              Connecting you with skilled professionals and verified service
              providers near your location — fast, reliable, and affordable.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="text-center" data-aos="zoom-out" data-aos-delay="100">
          <a href="#services" className="btn-get-started">
            Find a Service
          </a>
        </div>

        {/* Service Categories */}
        <div className="row gy-4 mt-5">
          {/* Home */}
          <div
            className="col-md-6 col-lg-3"
            data-aos="zoom-out"
            data-aos-delay="100"
          >
            <div className="icon-box">
              <div className="icon">
                <i className="bi bi-house"></i>
              </div>
              <h4 className="title">
                <Link to="/services/home">Home Services</Link>
              </h4>
              <p className="description">
                Hassle-free home maintenance and smart solutions for everyday comfort.
              </p>
            </div>
          </div>

          {/* Mechanic */}
          <div
            className="col-md-6 col-lg-3"
            data-aos="zoom-out"
            data-aos-delay="200"
          >
            <div className="icon-box">
              <div className="icon">
                <i className="bi bi-tools"></i>
              </div>
              <h4 className="title">
                <Link to="/services/mechanic">Mechanical Services</Link>
              </h4>
              <p className="description">
                Expert mechanics you can rely on — from vehicles to machinery.
              </p>
            </div>
          </div>

          {/* Agriculture */}
          <div
            className="col-md-6 col-lg-3"
            data-aos="zoom-out"
            data-aos-delay="300"
          >
            <div className="icon-box">
              <div className="icon">
                <i className="bi bi-tree"></i>
              </div>
              <h4 className="title">
                <Link to="/services/agriculture">Agriculture</Link>
              </h4>
              <p className="description">
                Modern agricultural support for sustainable and profitable farming.
              </p>
            </div>
          </div>

          {/* Food */}
          <div
            className="col-md-6 col-lg-3"
            data-aos="zoom-out"
            data-aos-delay="400"
          >
            <div className="icon-box">
              <div className="icon">
                <i className="bi bi-basket"></i>
              </div>
              <h4 className="title">
                <Link to="/services/food">Food Services</Link>
              </h4>
              <p className="description">
                Fresh, hygienic, and trustworthy food services — farm to table.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
