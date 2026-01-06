import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../logo.jpeg";

const Navbar = () => {
  const [mobileActive, setMobileActive] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [activeHash, setActiveHash] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Update active hash on location change
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

  // Smooth scroll for anchors
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

  // Helper to determine if hash link is active
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
          <img
            src={logo}
            alt="Aanaiyaan Logo"
            style={{ maxHeight: "40px", width: "auto", objectFit: "contain" }}
          />
          <h1>Mr LookUp</h1>
        </NavLink>

        <nav id="navmenu" className="navmenu">
          <ul className="ms-auto align-items-center">
            <li>
              <a
                href="#hero"
                className={isHashActive("#hero") ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("hero");
                }}
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="#about"
                className={isHashActive("#about") ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
              >
                About
              </a>
            </li>

            <li className={`dropdown ${openDropdowns["main"] ? "active" : ""}`}>
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("main");
                }}
                className={openDropdowns["main"] ? "active" : ""}
              >
                <span>Content Management</span>
                <i className={`bi bi-chevron-down toggle-dropdown ${openDropdowns["main"] ? "active" : ""}`}></i>
              </a>

              <ul className={openDropdowns["main"] ? "dropdown-active" : ""}>
                <li className={`dropdown ${openDropdowns["deep"] ? "active" : ""}`}>
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("deep");
                    }}
                    className={openDropdowns["deep"] ? "active" : ""}
                  >
                    <span>Master Data</span>
                    <i className={`bi bi-chevron-down toggle-dropdown ${openDropdowns["deep"] ? "active" : ""}`}></i>
                  </a>

                  <ul className={openDropdowns["deep"] ? "dropdown-active" : ""}>
                    <li>
                      <NavLink
                        to="/servicelist"
                        onClick={handleLinkClick}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Services
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/categorylist"
                        onClick={handleLinkClick}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Category
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/locationlist"
                        onClick={handleLinkClick}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Location
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/userlist"
                        onClick={handleLinkClick}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        User
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/Registrationlist"
                        onClick={handleLinkClick}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Registration
                      </NavLink>
                    </li>
                    
                      <li>
                      <NavLink
                        to="/attachmentlist"
                        onClick={handleLinkClick}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        Attachments
                      </NavLink>
                    </li>

                                      <li>
                                          <NavLink
                                              to="/announcements"
                                              onClick={handleLinkClick}
                                              className={({ isActive }) => (isActive ? "active" : "")}
                                          >
                                              Announcement
                                          </NavLink>
                                      </li>
                  </ul>
                </li>

                
                <li>
                  <NavLink
                    to="/searchvendors"
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Search
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/example4"
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Dropdown 4
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="#contact"
                className={isHashActive("#contact") ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
              >
                Contact
              </a>
            </li>
          </ul>

          <i className="mobile-nav-toggle d-xl-none bi bi-list" onClick={toggleMobileNav}></i>
        </nav>

        <NavLink to="/signup" className="btn-getstarted" onClick={handleLinkClick}>
          Sign Up
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
