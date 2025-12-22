import api from './baseapiinstance';

// GET ALL
export const getAllServices = async () => {
    try {
        const response = await api.get('/api/service/list');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Re-throw to handle in component
    }
};

// CREATE
export const createService = async (payload) => {
    const response = await api.post("/api/service", payload);
    return response.data;
};

// UPDATE
export const updateService = async (payload) => {
    const response = await api.put(`/api/service`, payload);
    return response.data;
};

// GET BY ID (for edit mode)
export const getServiceById = async (id) => {
    const response = await api.get(`/api/service/${id}`);
    return response.data;
};

// DELETE
export const deleteService = async (id) => {
    try {
        const response = await api.delete(`/api/service/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
};