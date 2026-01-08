import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "./SignUp.css";

const AuthSlider = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  return (
    <div
      className={`signup-slider-container ${
        rightPanelActive ? "right-panel-active" : ""
      }`}
    >
      {/* MOBILE TOGGLE */}
      <div className="mobile-toggle">
        <button
          className={!rightPanelActive ? "active" : ""}
          onClick={() => setRightPanelActive(false)}
          type="button"
        >
          Sign In
        </button>
        <button
          className={rightPanelActive ? "active" : ""}
          onClick={() => setRightPanelActive(true)}
          type="button"
        >
          Sign Up
        </button>
      </div>

      {/* SIGN IN */}
      <div className="signup-slider-form-container signup-slider-sign-in-container">
        <SignIn />
      </div>

      {/* SIGN UP */}
      <div className="signup-slider-form-container signup-slider-sign-up-container">
        <SignUp onSuccess={() => setRightPanelActive(false)} />
      </div>

      {/* OVERLAY */}
      <div className="signup-slider-overlay-container">
        <div className="signup-slider-overlay">
          <div className="signup-slider-overlay-panel signup-slider-overlay-left">
            <h1>Welcome Back!</h1>
            <button onClick={() => setRightPanelActive(false)}>Sign In</button>
          </div>

          <div className="signup-slider-overlay-panel signup-slider-overlay-right">
            <h1>Hello, Friend!</h1>
            <button onClick={() => setRightPanelActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
