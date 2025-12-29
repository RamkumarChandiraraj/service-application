import api from "./baseapiinstance";

// Upload attachment
export const uploadAttachment = (formData) => api.post("/api/attachments/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

// Update attachment
export const updateAttachment = (id, formData) => api.put(`/api/attachments/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

// Get all attachments
export const getAllAttachments = () => api.get("/api/attachments");

// Download by ID
export const downloadAttachmentById = (id) => api.get(`/api/attachments/download/${id}`, {
    responseType: "blob"
});

// Delete attachment
export const deleteAttachment = (id) => api.delete(`/api/attachments/${id}`);
