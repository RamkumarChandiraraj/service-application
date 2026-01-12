import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Chat from "./Chat";

const ChatPage = () => {
    // Receiver (Vendor Mobile) from URL
    const { receiverId } = useParams();

    useEffect(() => {
        console.log("ChatPage - Vendor Mobile (receiverId):", receiverId);

        
    }, [receiverId]);

    // Sender (Customer Mobile)
    const [customerMobile, setCustomerMobile] = useState("");
    const [startChat, setStartChat] = useState(false);
    const [error, setError] = useState("");

    // ✅ Validate 10-digit mobile number
    const isValidMobile = /^[0-9]{10}$/.test(customerMobile);

    const isValid = receiverId && isValidMobile;

    const handleStartChat = () => {
        if (!isValidMobile) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }
        setError("");
        setStartChat(true);
    };

    // ❌ If vendor mobile missing
    if (!receiverId) {
        return (
            <div style={{ padding: "20px" }}>
                <h3>Invalid vendor</h3>
                <p>Vendor mobile number not found in URL.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat with Vendor</h2>

            <p>
                <b>Vendor Mobile:</b> {receiverId}
            </p>

            {/* Step 1: Ask customer mobile */}
            {!startChat && (
                <div style={{ marginTop: "20px" }}>
                    <input
                        type="text"
                        placeholder="Enter 10-digit mobile number"
                        value={customerMobile}
                        maxLength={10}
                        onChange={(e) => {
                            // allow only numbers
                            const value = e.target.value.replace(/\D/g, "");
                            setCustomerMobile(value);
                        }}
                        style={{
                            padding: "8px",
                            width: "250px",
                            marginRight: "10px",
                            border: error ? "1px solid red" : "1px solid #ccc"
                        }}
                    />

                    <button
                        onClick={handleStartChat}
                        disabled={!isValid}
                        style={{
                            padding: "8px 16px",
                            opacity: !isValid ? 0.5 : 1,
                            cursor: !isValid ? "not-allowed" : "pointer"
                        }}
                    >
                        Start Chat
                    </button>

                    {error && (
                        <div style={{ color: "red", marginTop: "8px" }}>
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Start Chat */}
            {startChat && (
                
                <Chat
                    senderId={Number(customerMobile)}
                    receiverId={Number(receiverId)}
                />
            )}
            {/*<Chat senderId={Number(customerMobile)} />*/}
        </div>
    );
};

export default ChatPage;
