import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo.jpeg";
import { useAuth } from "../../../Auth/AuthProvider.jsx";
import { clearAuthTokens } from "../../../api/baseApiInstance";

const Navbar = () => {
  const [mobileActive, setMobileActive] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [activeHash, setActiveHash] = useState("");

  const { auth, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileNav = () => setMobileActive(!mobileActive);
  const toggleDropdown = (name) =>
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleLinkClick = () => {
    setMobileActive(false);
    setOpenDropdowns({});
  };

  const handleLogout = () => {
    clearAuthTokens();
    logout();
    navigate("/auth");
  };

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

  const isAdmin = auth?.role === "Admin";
  const isManager = auth?.role === "Manager";

  return (
    <header
      className={`header d-flex align-items-center sticky-top ${
        mobileActive ? "mobile-nav-active" : ""
      }`}
    >
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        {/* LOGO */}
        <NavLink
          to="/"
          className="logo d-flex align-items-center me-auto"
          onClick={handleLinkClick}
        >
          <img src={logo} alt="Logo" style={{ maxHeight: "40px" }} />
          <h1>Mr LookUp</h1>
        </NavLink>

        {/* NAV */}
        <nav id="navmenu" className="navmenu">
          <ul className="ms-auto align-items-center">
            {/* HOME */}
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

            {/* ABOUT */}
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
           
            {/* Serch */}
            <li>
              <NavLink to="/searchvendors" onClick={handleLinkClick}>
                Search
              </NavLink>
            </li>
            {/* CONTENT MANAGEMENT – ONLY AFTER LOGIN */}
            {auth && (
              <li className={`dropdown ${openDropdowns.main ? "active" : ""}`}>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("main");
                  }}
                >
                  <span>Content Management</span>
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>

                <ul className={openDropdowns.main ? "dropdown-active" : ""}>
                  {/* MASTER DATA */}
                  {(isAdmin || isManager) && (
                    <li
                      className={`dropdown ${
                        openDropdowns.master ? "active" : ""
                      }`}
                    >
                      <a
                        href="#!"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleDropdown("master");
                        }}
                      >
                        <span>Master Data</span>
                        <i className="bi bi-chevron-down toggle-dropdown"></i>
                      </a>

                      <ul
                        className={
                          openDropdowns.master ? "dropdown-active" : ""
                        }
                      >
                        {/* ADMIN ONLY */}
                        {isAdmin && (
                          <>
                            <li>
                              <NavLink
                                to="/management/services"
                                onClick={handleLinkClick}
                              >
                                Services
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/management/categories"
                                onClick={handleLinkClick}
                              >
                                Categories
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/management/locations"
                                onClick={handleLinkClick}
                              >
                                Locations
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/management/attachments"
                                onClick={handleLinkClick}
                              >
                                Attachments
                              </NavLink>
                            </li>
                          </>
                        )}

                        {/* ADMIN + MANAGER */}
                        {(isAdmin || isManager) && (
                          <>
                            <li>
                              <NavLink
                                to="/management/users"
                                onClick={handleLinkClick}
                              >
                                Users
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/management/registrations"
                                onClick={handleLinkClick}
                              >
                                Registrations
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/dashboard"
                                onClick={handleLinkClick}
                              >
                                Dashboard
                              </NavLink>
                            </li>
                          </>
                        )}
                      </ul>
                    </li>
                  )}
                </ul>
              </li>
            )}

            

            {/* CONTACT */}
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

          <i
            className="mobile-nav-toggle d-xl-none bi bi-list"
            onClick={toggleMobileNav}
          ></i>
        </nav>

        {/* AUTH BUTTON */}
        {!auth ? (
          <NavLink
            to="/auth"
            className="btn-getstarted"
            onClick={handleLinkClick}
          >
            Sign In
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
