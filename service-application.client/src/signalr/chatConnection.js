import * as signalR from "@microsoft/signalr";

/**
 * CREATE CHAT CONNECTION
 */
export const createChatConnection = async (userId) => {
    try {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost:44351/chatHub?userId=${userId}`)
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
