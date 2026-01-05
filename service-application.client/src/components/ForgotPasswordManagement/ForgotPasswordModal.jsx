import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/authApi";

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
        <div className="signup-slider-container single-panel">
            <div className="signup-slider-form-container signup-slider-sign-in-container">
                <form onSubmit={handleSubmit}>
                    <h2>Forgot Password</h2>
                    <span>Enter your registered email or username</span>

                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={userNameOrEmail}
                        onChange={(e) => setUserNameOrEmail(e.target.value)}
                    />

                    {error && <span style={{ color: "red" }}>{error}</span>}

                    <button disabled={loading}>
                        {loading ? "Sending OTP..."
                            : "Send OTP"}
                    </button>

                    <a onClick={() => navigate("/")}>

                        <h6> Back to Sign In</h6>  
                    </a>
                </form>
            </div>
        </div>
    );

};

export default ForgotPasswordModal;
