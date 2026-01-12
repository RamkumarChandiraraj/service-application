import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/authApi";
import "./ForgotPasswordModal.css";

const ForgotPasswordModal = () => {
    const navigate = useNavigate();
    const [userNameOrEmail, setUserNameOrEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!userNameOrEmail.trim()) {
            setError("Username or Email is required");
            return;
        }

        try {
            setLoading(true);
            await sendOtp({ userNameOrEmail: userNameOrEmail.trim() });

            navigate("/verify-otp", {
                state: { email: userNameOrEmail.trim() }
            });
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-container">
            <div className="auth-modal-box">
                <h2>Forgot Password</h2>
                <p className="auth-modal-text">
                    Enter your registered email or username
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Username or Email"
                        value={userNameOrEmail}
                        onChange={(e) => setUserNameOrEmail(e.target.value)}
                    />

                    {error && <div className="auth-error">{error}</div>}

                    <button className="auth-btn" disabled={loading}>
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="auth-back">
                    <a onClick={() => navigate("/signup")}>
                        Back to Sign In
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
