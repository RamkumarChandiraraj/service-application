import { useState, useEffect } from "react";
import Chat from "./Chat";
import "./ChatPage.css";

const ChatPage = () => {
    // ✅ Receiver (Vendor Mobile) – now from input (not URL)
    const [receiverId, setReceiverId] = useState("");

    useEffect(() => {
        console.log("ChatPage - Vendor Mobile (receiverId):", receiverId);
    }, [receiverId]);

    // Sender inputs
    const [customerMobile, setCustomerMobile] = useState("");
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState(""); // V or C
    const [startChat, setStartChat] = useState(false);
    const [error, setError] = useState("");

    // ✅ Validate 10-digit mobile number
    const isValidMobile = /^[0-9]{10}$/.test(customerMobile);

    const isValid =
        isValidMobile &&
        username.trim() !== "" &&
        userType !== "";

    const handleStartChat = () => {
        if (!isValidMobile) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }
        if (!username.trim()) {
            setError("Please enter username");
            return;
        }
        if (!userType) {
            setError("Please select V or C");
            return;
        }
        setError("");
        setStartChat(true);
    };

    // ✅ CONCATENATED SENDER ID
    const senderId = `${username}_${customerMobile}_${userType}`;

    return (
        <div className="chat-page">
            {/* ✅ Hide Login title once chat starts */}
            {!startChat && (
                <div className="chat-card">
                    <h2>Login Chat</h2>

                    {/* Customer Mobile */}
                    <input
                        type="text"
                        placeholder="Enter 10-digit mobile number"
                        value={customerMobile}
                        maxLength={10}
                        onChange={(e) =>
                            setCustomerMobile(e.target.value.replace(/\D/g, ""))
                        }
                    />

                    {/* Username */}
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Radio Buttons */}
                    <div className="user-type">
                        <label>
                            <input
                                type="radio"
                                name="userType"
                                value="V"
                                checked={userType === "V"}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            Vendor
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="userType"
                                value="C"
                                checked={userType === "C"}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            Customer
                        </label>
                    </div>

                    <button
                        onClick={handleStartChat}
                        disabled={!isValid}
                    >
                        Start Chat
                    </button>

                    {error && (
                        <div className="chat-error">
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Start Chat */}
            {startChat && (
                <div className="chat-wrapper">
                    <Chat senderId={senderId} />
                </div>
            )}
        </div>
    );
};

export default ChatPage;
