import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/authApi"; // adjust path
import "./SignUp.css";

const SignUp = () => {
    const [rightPanelActive, setRightPanelActive] = useState(false);

    // 🔑 login state
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError("");

            await loginApi({
                userName,
                password,
            });

            // ✅ redirect after successful login
            navigate("/"); // or "/dashboard"
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div
            className={`signup-slider-container ${rightPanelActive ? "right-panel-active" : ""
                }`}
        >
            {/* MOBILE TOGGLE */}
            <div className="mobile-toggle">
                <button
                    className={!rightPanelActive ? "active" : ""}
                    onClick={() => setRightPanelActive(false)}
                >
                    Sign In
                </button>
                <button
                    className={rightPanelActive ? "active" : ""}
                    onClick={() => setRightPanelActive(true)}
                >
                    Sign Up
                </button>
            </div>

            {/* SIGN IN */}
            <div className="signup-slider-form-container signup-slider-sign-in-container">
                <form onSubmit={(e) => e.preventDefault()}>
                    <h1>Sign In</h1>

                    <input
                        type="text"
                        placeholder="User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <a href="#">Forgot your password?</a>

                    <button type="button" onClick={handleLogin}>
                        Sign In
                    </button>
                </form>
            </div>

            {/* SIGN UP (UNCHANGED) */}
            <div className="signup-slider-form-container signup-slider-sign-up-container">
                <form>
                    <h1>Create Account</h1>

                    <input type="text" placeholder="Full Name" />
                    <input type="tel" placeholder="Mobile Number" />
                    <input type="email" placeholder="Email Address" />
                    <input type="password" placeholder="Password" />

                    <button type="button">Sign Up</button>
                </form>
            </div>

            {/* DESKTOP OVERLAY */}
            <div className="signup-slider-overlay-container">
                <div className="signup-slider-overlay">
                    <div className="signup-slider-overlay-panel signup-slider-overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>Login with your personal info</p>
                        <button
                            className="signup-slider-ghost"
                            onClick={() => setRightPanelActive(false)}
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="signup-slider-overlay-panel signup-slider-overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your details and start your journey</p>
                        <button
                            className="signup-slider-ghost"
                            onClick={() => setRightPanelActive(true)}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
