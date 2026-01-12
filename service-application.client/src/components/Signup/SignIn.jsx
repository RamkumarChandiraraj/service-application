import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../Auth/AuthProvider";
import "./SignUp.css";

const SignIn = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [userInput, setUserInput] = useState(""); // username or email
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!userInput || !password) {
            setLoginError("Please enter username/email and password");
            return;
        }

        try {
            setLoginError("");
            setLoginSuccess("");
            setLoading(true);

            const response = await loginApi({
                userNameOrEmail: userInput, // send username/email
                password: password,
            });

            // Optionally store JWT token
            localStorage.setItem("token", response.token);
            setAuth(response);

            setLoginSuccess("Login successful! Redirecting...");
            setTimeout(() => navigate("/management/locations"), 800);
        } catch (err) {
            console.error(err);
            setLoginError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <h1>Sign In</h1>

            <input
                type="text"
                placeholder="User Name or Email"
                value={userInput} // ✅ fixed
                onChange={(e) => setUserInput(e.target.value)} // ✅ fixed
                autoComplete="username"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
            />

            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            {loginSuccess && <p style={{ color: "green" }}>{loginSuccess}</p>}

            <button type="button" disabled={loading} onClick={handleLogin}>
                {loading ? "Signing in..." : "Sign In"}
            </button>

            <Link to="/forgot-password">Forgot Password?</Link>
        </form>
    );
};

export default SignIn;
