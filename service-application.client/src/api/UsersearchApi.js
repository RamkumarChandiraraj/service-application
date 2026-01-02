import api from "./baseapiinstance";
// USER SEARCH
export const userSearch = async (payload) => {
    try {
        const response = await api.post("/api/UserSearch", payload);
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
};

