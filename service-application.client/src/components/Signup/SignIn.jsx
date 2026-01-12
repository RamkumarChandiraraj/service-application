import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../Auth/AuthProvider";
import { getDecodedUser } from "../../utils/jwtUtils";
import "./SignUp.css";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userInput || !password) {
      setError("Username/Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await loginApi({
        userNameOrEmail: userInput,
        password,
      });

      // ✅ Store JWT
      localStorage.setItem("token", response.token);

      // ✅ Decode & store in AuthContext
      const decodedUser = getDecodedUser();
      setAuth(decodedUser);

      // ✅ Redirect back to protected page
      navigate(from, { replace: true });
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h1>Sign In</h1>

      <input
        type="text"
        placeholder="Username or Email"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        autoComplete="username"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      {error && <p className="error-text">{error}</p>}

      <button type="button" disabled={loading} onClick={handleLogin}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <Link to="/forgot-password">Forgot Password?</Link>
    </form>
  );
};

export default SignIn;
