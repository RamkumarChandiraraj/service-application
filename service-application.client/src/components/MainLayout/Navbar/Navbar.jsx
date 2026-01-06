import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo.jpeg";
import api from "../../../api/baseapiinstance";

const Navbar = () => {
  const [mobileActive, setMobileActive] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [activeHash, setActiveHash] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Detect login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  // Active hash update
  useEffect(() => {
    setActiveHash(location.hash);
  }, [location]);

  const toggleMobileNav = () => {
    setMobileActive(!mobileActive);
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleLinkClick = () => {
    setMobileActive(false);
    setOpenDropdowns({});
  };

  // 🔒 LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    delete api.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    navigate("/signup");
  };

  // Smooth scroll
  const scrollToSection = (id) => {
    handleLinkClick();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isHashActive = (hash) => activeHash === hash;

  return (
    <header
      id="header"
      className={`header d-flex align-items-center sticky-top ${
        mobileActive ? "mobile-nav-active" : ""
      }`}
    >
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <NavLink to="/" className="logo d-flex align-items-center me-auto" onClick={handleLinkClick}>
          <img src={logo} alt="Mr LookUp Logo" style={{ maxHeight: "40px" }} />
          <h1>Mr LookUp</h1>
        </NavLink>

        <nav id="navmenu" className="navmenu">
          <ul className="ms-auto align-items-center">
            <li>
              <a href="#hero" className={isHashActive("#hero") ? "active" : ""} onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}>
                Home
              </a>
            </li>

            <li>
              <a href="#about" className={isHashActive("#about") ? "active" : ""} onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}>
                About
              </a>
            </li>

            {/* CONTENT MANAGEMENT */}
            {isLoggedIn && (
              <li className={`dropdown ${openDropdowns.main ? "active" : ""}`}>
                <a href="#!" onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("main");
                }}>
                  <span>Content Management</span>
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>

                <ul className={openDropdowns.main ? "dropdown-active" : ""}>
                  <li className={`dropdown ${openDropdowns.deep ? "active" : ""}`}>
                    <a href="#!" onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("deep");
                    }}>
                      <span>Master Data</span>
                      <i className="bi bi-chevron-down toggle-dropdown"></i>
                    </a>

                    <ul className={openDropdowns.deep ? "dropdown-active" : ""}>
                      <li><NavLink to="/management/services" onClick={handleLinkClick}>Services</NavLink></li>
                      <li><NavLink to="/management/categories" onClick={handleLinkClick}>Category</NavLink></li>
                      <li><NavLink to="/management/locations" onClick={handleLinkClick}>Location</NavLink></li>
                      <li><NavLink to="/management/users" onClick={handleLinkClick}>User</NavLink></li>
                      <li><NavLink to="/management/registrations" onClick={handleLinkClick}>Registration</NavLink></li>
                      <li><NavLink to="/management/attachments" onClick={handleLinkClick}>Attachments</NavLink></li>
                    </ul>
                  </li>

                  <li>
                    <NavLink to="/searchvendors" onClick={handleLinkClick}>
                      Search
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            <li>
              <a href="#contact" className={isHashActive("#contact") ? "active" : ""} onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}>
                Contact
              </a>
            </li>
          </ul>

          <i className="mobile-nav-toggle d-xl-none bi bi-list" onClick={toggleMobileNav}></i>
        </nav>

        {/* AUTH BUTTON */}
        {!isLoggedIn ? (
          <NavLink to="/signup" className="btn-getstarted" onClick={handleLinkClick}>
            Sign Up
          </NavLink>
        ) : (
          <button
            className="btn-getstarted"
            style={{ backgroundColor: "#dc3545", border: "none" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
