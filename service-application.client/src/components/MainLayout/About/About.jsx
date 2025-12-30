import React from "react";

const About = () => {
  return (
    <section id="about" className="about section py-5">
      <div className="container">

        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">About Us</h2>
          <p className="text-muted mt-2">
            Connecting people with trusted services — anytime, anywhere.
          </p>
        </div>

        {/* Main Content */}
        <div className="row align-items-center">

          <div className="col-md-6 mb-4">
            <h4 className="fw-semibold">Who We Are</h4>
            <p className="text-muted">
              We are a service-based platform dedicated to simplifying everyday
              needs by connecting users with verified professionals across
              multiple industries. From home maintenance to agriculture and
              food services, we bring reliable solutions under one roof.
            </p>

            <p className="text-muted">
              Our goal is to make quality services easily accessible while
              supporting skilled workers and local businesses.
            </p>
          </div>

          <div className="col-md-6 mb-4">
            <h4 className="fw-semibold">Our Mission</h4>
            <p className="text-muted">
              To build a trusted ecosystem where customers receive dependable,
              high-quality services and service providers grow through
              technology-driven opportunities.
            </p>

            <h4 className="fw-semibold mt-4">Our Vision</h4>
            <p className="text-muted">
              To become a leading service platform that empowers communities
              and improves daily life through seamless digital solutions.
            </p>
          </div>
        </div>

        {/* Features / Why Choose Us */}
        <div className="row mt-5 text-center">
          <div className="col-md-3 mb-4">
            <i className="bi bi-shield-check fs-2 text-primary"></i>
            <h6 className="mt-3 fw-semibold">Trusted Professionals</h6>
            <p className="text-muted small">
              Verified service providers you can rely on.
            </p>
          </div>

          <div className="col-md-3 mb-4">
            <i className="bi bi-clock-history fs-2 text-primary"></i>
            <h6 className="mt-3 fw-semibold">On-Time Service</h6>
            <p className="text-muted small">
              Punctual and efficient service delivery.
            </p>
          </div>

          <div className="col-md-3 mb-4">
            <i className="bi bi-gear fs-2 text-primary"></i>
            <h6 className="mt-3 fw-semibold">Multiple Services</h6>
            <p className="text-muted small">
              Home, mechanical, agriculture, and food services.
            </p>
          </div>

          <div className="col-md-3 mb-4">
            <i className="bi bi-people fs-2 text-primary"></i>
            <h6 className="mt-3 fw-semibold">Customer First</h6>
            <p className="text-muted small">
              Your satisfaction is our top priority.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
