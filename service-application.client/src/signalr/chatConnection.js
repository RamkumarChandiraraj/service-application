import * as signalR from "@microsoft/signalr";

/**
 * CREATE CHAT CONNECTION
 */
export const createChatConnection = async (userId) => {
    try {

        ///* Base URL configuration */
        const BASE_URL =
            import.meta.env.VITE_API_CHAT_BASE_URL ||
            `${window.location.origin}`;

        //alert(BASE_URL);

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${BASE_URL}/chatHub?userId=${userId}`, {
                withCredentials: false   // 🔑 IMPORTANT
            })
            .withAutomaticReconnect()
            .build();

        await connection.start();
        console.log("SignalR connected for user:", userId);

        return connection;
    } catch (error) {
        console.error("Error creating chat connection:", error);
        throw error;
    }
};

/**
 * STOP CHAT CONNECTION
 */
export const stopChatConnection = async (connection) => {
    try {
        if (connection) {
            await connection.stop();
            console.log("SignalR disconnected");
        }
    } catch (error) {
        console.error("Error stopping connection:", error);
    }
};
