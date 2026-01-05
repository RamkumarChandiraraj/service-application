import { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import VerifyOtpModal from "./VerifyOtpModal";

const AuthPage = () => {
    const [showForgot, setShowForgot] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [email, setEmail] = useState("");

    return (
        <>
            <button onClick={() => setShowForgot(true)}>Forgot Password?</button>

            <ForgotPasswordModal
                isOpen={showForgot}
                onClose={() => setShowForgot(false)}
                onSuccess={(email) => {
                    setEmail(email);
                    setShowForgot(false);
                    setShowVerify(true);
                }}
            />

            <VerifyOtpModal
                isOpen={showVerify}
                email={email}
                onClose={() => setShowVerify(false)}
            />
        </>
    );
};

export default AuthPage;
