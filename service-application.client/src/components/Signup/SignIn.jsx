import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../Auth/AuthProvider";
import "./SignUp.css";
const SignIn = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoginError("");
      setLoginSuccess("");
      setLoading(true);

      const decodedUser = await loginApi({ userName, password });
      setAuth(decodedUser);

      setLoginSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/management/locations"), 800);
    } catch {
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
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
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
