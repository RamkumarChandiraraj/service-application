import api from "./baseapiinstance";


// GET ALL
export const getAllAnnouncements = async () => {
    try {
        const response = await api.get("/api/announcements/list");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching announcements:", error);
        throw error;
    }
};

// CREATE
export const createAnnouncement = async (payload) => {
    try {
        const response = await api.post("/api/announcements", payload);
        return response.data;
    } catch (error) {
        console.error("Error creating announcement:", error);
        throw error;
    }
};

// UPDATE
export const updateAnnouncement = async (id, payload) => {
    try {
        const response = await api.put(`/api/announcements/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Error updating announcement:", error);
        throw error;
    }
};

// GET BY ID (for edit mode)
export const getAnnouncementById = async (id) => {
    try {
        const response = await api.get(`/api/announcements/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching announcement:", error);
        throw error;
    }
};

// DELETE
export const deleteAnnouncement = async (id) => {
    try {
        const response = await api.delete(`/api/announcements/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting announcement:", error);
        throw error;
    }
};
