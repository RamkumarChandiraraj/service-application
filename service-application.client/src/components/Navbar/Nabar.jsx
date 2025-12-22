import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderNav = () => {
    const [mobileActive, setMobileActive] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleMobileNav = () => {
        setMobileActive(!mobileActive);
    };

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <header
            id="header"
            className={`header d-flex align-items-center sticky-top ${mobileActive ? "mobile-nav-active" : ""
                }`}
        >
            <div className="container-fluid container-xl position-relative d-flex align-items-center">
                <a href="#hero" className="logo d-flex align-items-center me-auto">
                    <h1 className="sitename">OnePage</h1>
                </a>

                <nav id="navmenu" className="navmenu">
                    <ul className="ms-auto align-items-center">
                        <li>
                            <a href="#hero" className="active">Home</a>
                        </li>
                        <li>
                            <a href="#about">About</a>
                        </li>
                        <li>
                            <Link to="/servicelist">Services</Link>
                        </li>
                        <li>
                            <a href="#portfolio">Portfolio</a>
                        </li>
                        <li>
                            <a href="#team">Team</a>
                        </li>

                        <li className="dropdown">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown("main");
                                }}
                            >
                                <span>Dropdown</span>
                                <i className="bi bi-chevron-down toggle-dropdown"></i>
                            </a>
                            <ul className={openDropdown === "main" ? "dropdown-active" : ""}>
                                <li><a href="#">Dropdown 1</a></li>

                                <li className="dropdown">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleDropdown("deep");
                                        }}
                                    >
                                        <span>Deep Dropdown</span>
                                        <i className="bi bi-chevron-down toggle-dropdown"></i>
                                    </a>
                                    <ul className={openDropdown === "deep" ? "dropdown-active" : ""}>
                                        <li><a href="#">Deep Dropdown 1</a></li>
                                        <li><a href="#">Deep Dropdown 2</a></li>
                                        <li><a href="#">Deep Dropdown 3</a></li>
                                        <li><a href="#">Deep Dropdown 4</a></li>
                                        <li><a href="#">Deep Dropdown 5</a></li>
                                    </ul>
                                </li>

                                <li><a href="#">Dropdown 2</a></li>
                                <li><a href="#">Dropdown 3</a></li>
                                <li><a href="#">Dropdown 4</a></li>
                            </ul>
                        </li>

                        <li>
                            <a href="#contact">Contact</a>
                        </li>
                    </ul>

                    <i
                        className="mobile-nav-toggle d-xl-none bi bi-list"
                        onClick={toggleMobileNav}
                    ></i>
                </nav>

                <a className="btn-getstarted" href="#about">
                    Get Started
                </a>
            </div>
        </header>
    );
};

export default HeaderNav;
