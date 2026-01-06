import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/authApi";
import "./ForgotPasswordModal.css";
const VerifyOtpModal = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email;

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) navigate("/forgot-password");
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) return setError("OTP must be 6 digits");
        if (newPassword.length < 6) return setError("Password too short");
        if (newPassword !== confirmPassword) return setError("Passwords do not match");

        try {
            setLoading(true);
            await verifyOtp({ email, otp, newPassword });
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-container">
            <div className="auth-modal-box">
                <h2>Verify OTP</h2>
                <p className="auth-modal-text">
                    OTP sent to {email}
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <div className="auth-error">{error}</div>}

                    <button className="auth-btn" disabled={loading}>
                        {loading ? "Verifying..." : "Reset Password"}
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

export default VerifyOtpModal;
