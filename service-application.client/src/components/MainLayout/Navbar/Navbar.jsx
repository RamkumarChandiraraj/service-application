import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth"; // AuthContext
import logo from "../../../assets/images/logo.jpeg";
import { ROLES } from "../../../constants/roles";

// === Role-based menu configuration ===
const NAV_ITEMS = [
  { label: "Home", hash: "#hero" },
  { label: "About", hash: "#about" },
  {
    label: "Content Management",
    dropdown: [
      {
        label: "Master Data",
        dropdown: [
          { label: "Services", path: "/management/services", roles: [ROLES.ADMIN] },
          { label: "Category", path: "/management/categories", roles: [ROLES.ADMIN] },
          { label: "Location", path: "/management/locations", roles: [ROLES.ADMIN] },
          { label: "User", path: "/management/users", roles: [ROLES.ADMIN, ROLES.MANAGER] },
          { label: "Registration", path: "/management/registrations", roles: [ROLES.ADMIN, ROLES.MANAGER] },
          { label: "Attachments", path: "/management/attachments", roles: [ROLES.ADMIN] },
        ],
      },
      { label: "Search", path: "/searchvendors"},
      { label: "Dropdown 4", path: "/example4" },
    ],
  },
  { label: "Contact", hash: "#contact" },
];

const Navbar = () => {
  const [mobileActive, setMobileActive] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [activeHash, setActiveHash] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();

  // Update hash on location change
  useEffect(() => {
    setActiveHash(location.hash);
  }, [location]);

  const toggleMobileNav = () => setMobileActive(!mobileActive);

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

  // Recursive rendering of nav items
  const renderNavItem = (item) => {
    // Skip items if roles defined and user role not included
    if (item.roles && !item.roles.includes(auth?.role)) return null;

    // Dropdown items
    if (item.dropdown) {
      return (
        <li
          className={`dropdown ${openDropdowns[item.label] ? "active" : ""}`}
          key={item.label}
        >
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown(item.label);
            }}
            className={openDropdowns[item.label] ? "active" : ""}
          >
            <span>{item.label}</span>
            <i
              className={`bi bi-chevron-down toggle-dropdown ${
                openDropdowns[item.label] ? "active" : ""
              }`}
            ></i>
          </a>
          <ul className={openDropdowns[item.label] ? "dropdown-active" : ""}>
            {item.dropdown.map(renderNavItem)}
          </ul>
        </li>
      );
    }

    // NavLink items
    if (item.path) {
      return (
        <li key={item.label}>
          <NavLink
            to={item.path}
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        </li>
      );
    }

    // Hash link items
    if (item.hash) {
      return (
        <li key={item.label}>
          <a
            href={item.hash}
            className={isHashActive(item.hash) ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(item.hash.substring(1));
            }}
          >
            {item.label}
          </a>
        </li>
      );
    }

    return null;
  };

  return (
    <header
      id="header"
      className={`header d-flex align-items-center sticky-top ${
        mobileActive ? "mobile-nav-active" : ""
      }`}
    >
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        {/* Logo */}
        <NavLink to="/" className="logo d-flex align-items-center me-auto" onClick={handleLinkClick}>
          <img
            src={logo}
            alt="Mr LookUp Logo"
            className="d-none d-xl-block"
            style={{ maxHeight: "40px", width: "auto", objectFit: "contain" }}
          />
          <h1 className="m-0 ms-2">Mr LookUp</h1>
        </NavLink>

        {/* Navbar Menu */}
        <nav id="navmenu" className="navmenu">
          <ul className="ms-auto align-items-center">
            {NAV_ITEMS.map(renderNavItem)}
          </ul>

          {/* Mobile toggle */}
          <i className="mobile-nav-toggle d-xl-none bi bi-list" onClick={toggleMobileNav}></i>
        </nav>

        {/* Sign Up / Logout */}
        {auth ? (
          <button
            className="btn-getstarted"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        ) : (
          <NavLink to="/signup" className="btn-getstarted" onClick={handleLinkClick}>
            Sign Up
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
