import { useEffect, useRef, useState } from "react";
import { createChatConnection, stopChatConnection } from "../../signalr/chatConnection";
import "./Chat.css";

const Chat = ({ senderId }) => {
    const connectionRef = useRef(null);
    const initializedRef = useRef(false);

    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [draftMessages, setDraftMessages] = useState({});
    const [searchText, setSearchText] = useState("");

    // Extract data from senderId (logged-in user)
    const username = senderId?.split("_")[0];
    const number = senderId?.split("_")[1];
    const user = senderId?.split("_")[2]; // V or C

    useEffect(() => {
        if (!senderId || initializedRef.current) return;
        initializedRef.current = true;

        const connect = async () => {
            const conn = await createChatConnection(senderId);

            conn.on("ReceiveMessage", (msg) => {
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const message = {
                    senderId: msg.senderId ?? msg.SenderId,
                    receiverId: msg.receiverId ?? msg.ReceiverId,
                    message: msg.message ?? msg.Message,
                    time: timestamp, // ✅ add timestamp
                };

                setMessages(prev => [...prev, message]);

                if (message.senderId !== senderId) {
                    setSelectedUser(message.senderId);
                }
            });

            conn.on("ReceiveUsers", (users) => {
                setActiveUsers(users.filter(u => u !== senderId));
            });

            connectionRef.current = conn;
        };

        connect();

        return () => {
            if (connectionRef.current) {
                stopChatConnection(connectionRef.current);
                connectionRef.current = null;
            }
        };
    }, [senderId]);

    const filteredMessages = messages.filter(m =>
        selectedUser &&
        (
            (m.senderId === senderId && m.receiverId === selectedUser) ||
            (m.senderId === selectedUser && m.receiverId === senderId)
        )
    );

    const filteredUsers = activeUsers.filter(u => {
        const name = u.split("_")[0].toLowerCase();
        const mobile = u.split("_")[1];
        return (
            name.includes(searchText.toLowerCase()) ||
            mobile.includes(searchText)
        );
    });

    const sendMessage = async () => {
        const messageText = draftMessages[selectedUser]?.trim();
        if (!messageText || !selectedUser) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        await connectionRef.current.invoke(
            "SendMessage",
            senderId,
            selectedUser,
            messageText
        );

        setMessages(prev => [
            ...prev,
            { senderId, receiverId: selectedUser, message: messageText, time: timestamp },
        ]);

        setDraftMessages(prev => ({
            ...prev,
            [selectedUser]: ""
        }));
    };

    return (
        <div className="chat-container">

            {/* Logged-in User Header */}
            <div className="chat-header">
                <div className="profile-logo">{user}</div>
                <div className="profile-info">
                    <h3>Welcome {username}</h3>
                    <span>{number}</span>
                </div>
            </div>

            <div className="chat-body">

                {/* Users Panel */}
                <div className="users-panel">

                    {/* Search */}
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search "
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>

                    {filteredUsers.map(u => (
                        <div
                            key={u}
                            className={`user-item ${selectedUser === u ? "active" : ""}`}
                            onClick={() => setSelectedUser(u)}
                        >
                            <div className="user-logo">{u.split("_")[2]}</div>
                            <div>
                                <strong>{u.split("_")[0]}</strong>
                                <p>{u.split("_")[1]}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Panel */}
                <div className="chat-panel">

                    {/* Selected User Header */}
                    {selectedUser && (
                        <div className="chat-user-header">
                            <div className="chat-user-logo">{selectedUser.split("_")[2]}</div>
                            <div className="chat-user-info">
                                <h4>{selectedUser.split("_")[0]}</h4>
                                <span>{selectedUser.split("_")[1]}</span>
                            </div>
                        </div>
                    )}

                    <div className="messages">
                        {filteredMessages.map((m, i) => (
                            <div
                                key={i}
                                className={`message ${m.senderId === senderId ? "sent" : "received"}`}
                            >
                                <span className="message-text">{m.message}</span>
                                <span className="message-time">{m.time}</span>
                            </div>
                        ))}
                    </div>

                    {selectedUser && (
                        <div className="message-input">
                            <input
                                value={draftMessages[selectedUser] || ""}
                                onChange={e => setDraftMessages(prev => ({
                                    ...prev,
                                    [selectedUser]: e.target.value
                                }))}
                                placeholder="Type a message"
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <button onClick={sendMessage}>➤</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
