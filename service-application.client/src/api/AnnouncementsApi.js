import api from "./baseapiinstance";

// Get all announcements
export const getAllAnnouncements = () =>
    api.get("/api/announcements");

// Get announcement by ID
export const getAnnouncementById = (id) =>
    api.get(`/api/announcements/${id}`);

// Create announcement
export const createAnnouncement = (data) =>
    api.post("/api/announcements", data);

// Update announcement
export const updateAnnouncement = (id, data) =>
    api.put(`/api/announcements/${id}`, data);

// Delete announcement
export const deleteAnnouncement = (id) =>
    api.delete(`/api/announcements/${id}`);
