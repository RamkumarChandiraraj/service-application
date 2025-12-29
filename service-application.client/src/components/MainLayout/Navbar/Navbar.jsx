import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../logo.jpeg";

const Navbar = () => {
  const [mobileActive, setMobileActive] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileNav = () => {
    setMobileActive(!mobileActive);
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Close mobile nav when a link is clicked
  const handleLinkClick = () => {
    setMobileActive(false);
    setOpenDropdowns({});
  };

  // ✅ ADDED: universal smooth scroll
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

  return (
    <header
      id="header"
      className={`header d-flex align-items-center sticky-top ${
        mobileActive ? "mobile-nav-active" : ""
      }`}
    >
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <Link
          to="/"
          className="logo d-flex align-items-center me-auto"
          onClick={handleLinkClick}
        >
          <img
            src={logo}
            alt="Aanaiyaan Logo"
            style={{
              maxHeight: "60px", // maximum height
              width: "auto", // keep aspect ratio
              objectFit: "contain",
            }}
          />
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul className="ms-auto align-items-center">
            <li>
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("hero");
                }}
              >
                Home
              </a>
            </li>

            {/* ✅ About scroll */}
            <li>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
              >
                About
              </a>
            </li>

            {/* Main Dropdown */}
            <li className="dropdown">
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("main");
                }}
              >
                <span>Content Management</span>
                <i
                  className={`bi bi-chevron-down toggle-dropdown ${
                    openDropdowns["main"] ? "active" : ""
                  }`}
                ></i>
              </a>

              <ul className={openDropdowns["main"] ? "dropdown-active" : ""}>
                <li>
                  <Link to="/example1" onClick={handleLinkClick}>
                    Dropdown 1
                  </Link>
                </li>

                {/* Nested Dropdown */}
                <li className="dropdown">
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("deep");
                    }}
                  >
                    <span>Master Data</span>
                    <i
                      className={`bi bi-chevron-down toggle-dropdown ${
                        openDropdowns["deep"] ? "active" : ""
                      }`}
                    ></i>
                  </a>

                  <ul
                    className={openDropdowns["deep"] ? "dropdown-active" : ""}
                  >
                    <li>
                      <Link to="/servicelist" onClick={handleLinkClick}>
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link to="/categorylist" onClick={handleLinkClick}>
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link to="/locationlist" onClick={handleLinkClick}>
                        Location
                      </Link>
                    </li>
                    <li>
                      <Link to="/userlist" onClick={handleLinkClick}>
                        User
                      </Link>
                    </li>
                    <li>
                      <Link to="/Registrationlist" onClick={handleLinkClick}>
                      Registration
                      <Link to="/attachmentlist" onClick={handleLinkClick}>
                        Attachments
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/example2" onClick={handleLinkClick}>
                    Dropdown 2
                  </Link>
                </li>
                <li>
                  <Link to="/example3" onClick={handleLinkClick}>
                    Dropdown 3
                  </Link>
                </li>
                <li>
                  <Link to="/example4" onClick={handleLinkClick}>
                    Dropdown 4
                  </Link>
                </li>
              </ul>
            </li>

            {/* ✅ Contact scroll */}
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Mobile toggle */}
          <i
            className="mobile-nav-toggle d-xl-none bi bi-list"
            onClick={toggleMobileNav}
          ></i>
        </nav>

        <Link to="/signup" className="btn-getstarted" onClick={handleLinkClick}>
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
