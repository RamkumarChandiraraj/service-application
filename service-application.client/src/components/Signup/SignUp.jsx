import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css";
import { createUser} from "../../api/UserApi";



// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile); 

const SignUp = () => {
    const [rightPanelActive, setRightPanelActive] = useState(false);

    const [signUpForm, setSignUpForm] = useState({
        userName: "",
        mobileNumber: "",
        email: "",
        password: ""
    });

    const [signInForm, setSignInForm] = useState({
        mobileNumber: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const handleSignUpChange = (e) => {
        setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
    };

    const handleSignInChange = (e) => {
        setSignInForm({ ...signInForm, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!signUpForm.userName.trim()) newErrors.userName = "Name is required";

        if (!signUpForm.email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(signUpForm.email)) newErrors.email = "Invalid email format";

        if (!signUpForm.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
        else if (!validateMobile(signUpForm.mobileNumber))
            newErrors.mobileNumber = "Enter valid 10-digit mobile number";

        if (!signUpForm.password.trim()) newErrors.password = "Password is required";
        else if (signUpForm.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const payload = {
            userName: signUpForm.userName.trim(),
            mobileNumber: signUpForm.mobileNumber.trim(),
            email: signUpForm.email.trim(),
            password: signUpForm.password,
            role: 1
        };

        try {
            const res = await createUser(payload);
            alert(res.data?.message || "User created successfully");
            setSignUpForm({ userName: "", mobileNumber: "", email: "", password: "" });
            setErrors({});
            setRightPanelActive(false);

        } catch (err) {
            console.log("Backend error:", err.response?.data);
            alert(JSON.stringify(err.response?.data, null, 2));
        }
    };

    return (
        <div className={`signup-slider-container ${rightPanelActive ? "right-panel-active" : ""}`}>

            {/* SIGN IN */}
            <div className="signup-slider-form-container signup-slider-sign-in-container">
                <form onSubmit={(e) => e.preventDefault()}>
                    <h1>Sign In</h1>
                    <input
                        type="tel"
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        value={signInForm.mobileNumber}
                        onChange={handleSignInChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={signInForm.password}
                        onChange={handleSignInChange}
                    />
                    <button type="button">Sign In</button>
                </form>
            </div>

            {/* SIGN UP */}
            <div className="signup-slider-form-container signup-slider-sign-up-container">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>

                    <input
                        type="text"
                        placeholder="Full Name"
                        name="userName"
                        value={signUpForm.userName}
                        onChange={handleSignUpChange}
                    />
                    {errors.userName && <small className="text-danger">{errors.userName}</small>}

                    <input
                        type="tel"
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        value={signUpForm.mobileNumber}
                        onChange={handleSignUpChange}
                    />
                    {errors.mobileNumber && <small className="text-danger">{errors.mobileNumber}</small>}

                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={signUpForm.email}
                        onChange={handleSignUpChange}
                    />
                    {errors.email && <small className="text-danger">{errors.email}</small>}

                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={signUpForm.password}
                        onChange={handleSignUpChange}
                    />
                    {errors.password && <small className="text-danger">{errors.password}</small>}

                    <button type="submit">Sign Up</button>
                </form>
            </div>

            {/* OVERLAY */}
            <div className="signup-slider-overlay-container">
                <div className="signup-slider-overlay">
                    <div className="signup-slider-overlay-panel signup-slider-overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>Login with your personal info</p>
                        <button className="signup-slider-ghost" onClick={() => setRightPanelActive(false)}>
                            Sign In
                        </button>
                    </div>
                    <div className="signup-slider-overlay-panel signup-slider-overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your details and start your journey</p>
                        <button className="signup-slider-ghost" onClick={() => setRightPanelActive(true)}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
