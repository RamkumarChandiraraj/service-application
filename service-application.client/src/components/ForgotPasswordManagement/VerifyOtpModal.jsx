import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/authApi";
import AlertToast from "../common/AlertToast"; // 👈 adjust path if needed
import "./ForgotPasswordModal.css";

const VerifyOtpModal = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    // Email or Username
    const userNameOrEmail = state?.email;

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔔 Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        if (!userNameOrEmail) {
            navigate("/forgot-password");
        }
    }, [userNameOrEmail, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^\d{6}$/.test(otp))
            return setError("OTP must be 6 digits");

        if (newPassword.length < 6)
            return setError("Password must be at least 6 characters");

        if (newPassword !== confirmPassword)
            return setError("Passwords do not match");

        try {
            setLoading(true);

            await verifyOtp({
                userNameOrEmail,
                otp,
                newPassword
            });

            // ✅ SHOW SUCCESS TOAST
            setToastType("success");
            setToastMessage("Your password has been updated successfully.");
            setShowToast(true);

            // ⏳ Redirect after toast
            setTimeout(() => {
                navigate("/auth");
            }, 3000);

        } catch (err) {
            setToastType("error");
            setToastMessage(
                err?.response?.data?.message || "Invalid or expired OTP"
            );
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="auth-modal-container">
                <div className="auth-modal-box">
                    <h2>Verify OTP</h2>
                    <p className="auth-modal-text">
                        OTP sent to <strong>{userNameOrEmail}</strong>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input
                            className="auth-input"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
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

            {/* 🔔 TOAST NOTIFICATION */}
            <AlertToast
                show={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default VerifyOtpModal;
