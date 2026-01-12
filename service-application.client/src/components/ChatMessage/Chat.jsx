import { useEffect, useRef, useState } from "react";
import { createChatConnection, stopChatConnection } from "../../signalr/chatConnection";

const Chat = ({ senderId }) => {
    const connectionRef = useRef(null);
    const initializedRef = useRef(false);

    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = useState("");

    useEffect(() => {
        if (!senderId || initializedRef.current) return;
        initializedRef.current = true;

        const connect = async () => {
            const conn = await createChatConnection(senderId);

            // ✅ Receive message
            conn.on("ReceiveMessage", (msg) => {
                const message = {
                    senderId: msg.senderId ?? msg.SenderId,
                    receiverId: msg.receiverId ?? msg.ReceiverId,
                    message: msg.message ?? msg.Message,
                };

                setMessages(prev => [...prev, message]);

                // auto select customer when message comes
                if (message.senderId !== senderId) {
                    setSelectedUser(String(message.senderId));
                }
            });

            // ✅ Receive active users
            conn.on("ReceiveUsers", (users) => {
                setActiveUsers(users.filter(u => u !== String(senderId)));
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

    // ✅ Show only selected user's conversation
    const filteredMessages = messages.filter(m =>
        selectedUser &&
        (
            (m.senderId === senderId && m.receiverId === Number(selectedUser)) ||
            (m.senderId === Number(selectedUser) && m.receiverId === senderId)
        )
    );

    const sendMessage = async () => {
        if (!text.trim() || !selectedUser) return;

        await connectionRef.current.invoke(
            "SendMessage",
            senderId,
            Number(selectedUser),
            text
        );

        setMessages(prev => [
            ...prev,
            {
                senderId,
                receiverId: Number(selectedUser),
                message: text,
            },
        ]);

        setText("");
    };

    return (
        <div style={{ display: "flex", height: "500px", gap: 20 }}>

            {/* 👥 Active Users */}
            <div style={{ width: 220, border: "1px solid #ccc", padding: 10 }}>
                <h4>Active Users</h4>
                {activeUsers.map(u => (
                    <div
                        key={u}
                        onClick={() => setSelectedUser(u)}
                        style={{
                            padding: 8,
                            cursor: "pointer",
                            background: selectedUser === u ? "#e0f2ff" : "#fff",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        {u}
                    </div>
                ))}
            </div>

            {/* 💬 Chat Window */}
            <div style={{ flex: 1 }}>
                <h4>
                    {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
                </h4>

                <div style={{
                    height: 350,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: 10
                }}>
                    {filteredMessages.map((m, i) => (
                        <div
                            key={i}
                            style={{
                                textAlign: m.senderId === senderId ? "right" : "left",
                                marginBottom: 6
                            }}
                        >
                            <b>{m.senderId === senderId ? "Me" : selectedUser}</b>: {m.message}
                        </div>
                    ))}
                </div>

                {selectedUser && (
                    <div style={{ marginTop: 10 }}>
                        <input
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type message"
                            style={{ width: "80%" }}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
