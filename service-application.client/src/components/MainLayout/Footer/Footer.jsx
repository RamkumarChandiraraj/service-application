import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="footer light-background">
      <div className="container footer-top">
        <div className="row gy-4">

          {/* About */}
          <div className="col-lg-5 col-md-12 footer-about">
            <a href="/" className="logo d-flex align-items-center">
              <span className="sitename">Anaiyaan Services</span>
            </a>
            <p>
              We provide reliable, on-demand services across home maintenance,
              mechanical support, agriculture solutions, and food services.
              Our mission is to connect people with trusted professionals
              quickly and securely.
            </p>
            <div className="social-links d-flex mt-4">
              <a href="#" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="col-lg-2 col-6 footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-6 footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><a href="/services/home">Home Services</a></li>
              <li><a href="/services/mechanic">Mechanical Services</a></li>
              <li><a href="/services/agriculture">Agriculture Solutions</a></li>
              <li><a href="/services/food">Food Services</a></li>
              <li><a href="/services/others">Other Services</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-12 footer-contact text-center text-md-start">
            <h4>Contact Us</h4>
            <p>Anaiyaan Technologies</p>
            <p>Chennai, Tamil Nadu</p>
            <p>India</p>
            <p className="mt-4">
              <strong>Phone:</strong> <span>+91 90000 00000</span>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <span>support@anaiyaantechnologies.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container copyright text-center mt-4">
        <p>
          © <span>Copyright</span>{" "}
          <strong className="px-1 sitename">Anaiyaan Services</strong>{" "}
          <span>All Rights Reserved</span>
        </p>
        <div className="credits">
          Powered by{" "}
          <a
            href="https://anaiyaantechnologies.com"
            target="_blank"
            rel="noreferrer"
          >
            Anaiyaan Technologies
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
