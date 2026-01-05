import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/authApi";


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

            await verifyOtp({
                email,
                otp,
                newPassword
            });

            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-slider-container">
            <div className="signup-slider-form-container signup-slider-sign-in-container">
                <form onSubmit={handleSubmit}>
                    <h2>Verify OTP</h2>
                    <span>OTP sent to {email}</span>

                    <input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <span style={{ color: "red" }}>{error}</span>}

                    <button disabled={loading}>
                        {loading ? "Verifying..." : "Reset Password"}
                    </button>

                    <a onClick={() => navigate("/")}>
                        Back to Sign In
                    </a>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpModal;
