import React from "react";

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="text-center">
          <h2>About Us</h2>
          <p>
            We are a team of skilled developers and designers building scalable,
            modern web applications using React and Bootstrap.
          </p>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <h4>Our Mission</h4>
            <p>
              To deliver high-quality digital solutions that empower businesses
              and individuals.
            </p>
          </div>

          <div className="col-md-6">
            <h4>Why Choose Us?</h4>
            <ul>
              <li>Modern UI/UX</li>
              <li>Scalable Architecture</li>
              <li>Reliable Support</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
