import React, { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import { loginApi } from "../../api/authApi";
import { createUser } from "../../api/UserApi";
import "./SignUp.css";

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

const SignUp = () => {
    const navigate = useNavigate();
    const [rightPanelActive, setRightPanelActive] = useState(false);

    // Login state
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // Signup state
    const [signUpForm, setSignUpForm] = useState({
        userName: "",
        mobileNumber: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const handleSignUpChange = (e) => {
        setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!signUpForm.userName.trim()) newErrors.userName = "Name is required";

        if (!signUpForm.email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(signUpForm.email))
            newErrors.email = "Invalid email format";

        if (!signUpForm.mobileNumber.trim())
            newErrors.mobileNumber = "Mobile number is required";
        else if (!validateMobile(signUpForm.mobileNumber))
            newErrors.mobileNumber = "Enter valid 10-digit mobile number";

        if (!signUpForm.password.trim())
            newErrors.password = "Password is required";
        else if (signUpForm.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await createUser({ ...signUpForm, role: 1 });
            alert("User created successfully");
            setRightPanelActive(false);
            setSignUpForm({
                userName: "",
                mobileNumber: "",
                email: "",
                password: "",
            });
            setErrors({});
        } catch {
            alert("Signup failed");
        }
    };

    const handleLogin = async () => {
        try {
            setLoginError("");
            await loginApi({ userName, password });
            navigate("/");
        } catch {
            setLoginError("Invalid username or password");
        }
    };

    const handleForgotPassword = () => {
        navigate("/reset-password");
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

                    {loginError && <p style={{ color: "red" }}>{loginError}</p>}

                    <button type="button" onClick={handleLogin}>
                        Sign In
                    </button>

                    <Link to="/forgot-password">Forgot Password?</Link>
                </form>
            </div>

            {/* SIGN UP */}
            <div className="signup-slider-form-container signup-slider-sign-up-container">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>

                    <input
                        name="userName"
                        placeholder="Full Name"
                        value={signUpForm.userName}
                        onChange={handleSignUpChange}
                    />
                    {errors.userName && (
                        <small className="text-danger">{errors.userName}</small>
                    )}

                    <input
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        value={signUpForm.mobileNumber}
                        onChange={handleSignUpChange}
                    />
                    {errors.mobileNumber && (
                        <small className="text-danger">{errors.mobileNumber}</small>
                    )}

                    <input
                        name="email"
                        placeholder="Email"
                        value={signUpForm.email}
                        onChange={handleSignUpChange}
                    />
                    {errors.email && (
                        <small className="text-danger">{errors.email}</small>
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={signUpForm.password}
                        onChange={handleSignUpChange}
                    />
                    {errors.password && (
                        <small className="text-danger">{errors.password}</small>
                    )}

                    <button type="submit">Sign Up</button>
                </form>
            </div>

            {/* OVERLAY (DESKTOP ONLY) */}
            <div className="signup-slider-overlay-container">
                <div className="signup-slider-overlay">
                    <div className="signup-slider-overlay-panel signup-slider-overlay-left">
                        <h1>Welcome Back!</h1>
                        <button onClick={() => setRightPanelActive(false)}>
                            Sign In
                        </button>
                    </div>

                    <div className="signup-slider-overlay-panel signup-slider-overlay-right">
                        <h1>Hello, Friend!</h1>
                        <button onClick={() => setRightPanelActive(true)}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
