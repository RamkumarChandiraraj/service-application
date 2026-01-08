import { useEffect, useRef, useState } from "react";
import { createChatConnection, stopChatConnection } from "../../signalr/chatConnection";

const Chat = ({ senderId, receiverId }) => {
    const connectionRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [activeusers, setUsers] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {

        console.log("initialized...");

        if (!senderId) return;

        const connect = async () => {
            if (connectionRef.current) return;

            const conn = await createChatConnection(senderId);

            conn.on("ReceiveMessage", (msg) => {
                //console.log("receive" + JSON.stringify(msg));
                setMessages(prev => [...prev, msg]);
            });

            conn.on("ReceiveUsers", (msg) => {
                console.log("ReceiveUsers" + JSON.stringify(msg));

                setUsers(prev => [...prev, msg]);
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
    }, [senderId]); // ✅ depends on senderId

    const sendMessage = async () => {
        if (!text.trim() || !connectionRef.current) return;

        try {
            await connectionRef.current.invoke(
                "SendMessage",
                senderId,
                receiverId,
                text
            );

            console.log("send" + text);
            //setMessages(prev => [...prev, text]);

            // show message instantly
            setMessages(prev => [
                ...prev,
                {
                    senderId: senderId,
                    receiverId: receiverId,
                    message: text,
                },
            ]);

            setText("");
        } catch (error) {
            console.error("Send message failed:", error);
        }
    };

    return (
        <div>
            <h3>Active Users</h3>

            <div
                style={{
                    height: 300,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: 10,
                }}
            >
                {activeusers.map((m, i) => (
                    <div key={i}>
                        <span> Data :  {JSON.stringify(m)} </span>
                       
                    </div>
                ))}
            </div>
            <h3>Live Chat</h3>

            <div
                style={{
                    height: 300,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: 10,
                }}
            >
                {messages.map((m, i) => (
                    <div key={i}>
                        <span> Data :  {JSON.stringify(m)} </span>
                        <b>{m.senderId === senderId ? "Me" : "Vendor"}:</b>
                        {m.message}
                    </div>
                ))}
            </div>

            <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
