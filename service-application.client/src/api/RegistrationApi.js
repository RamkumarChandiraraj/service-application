import api from './baseapiinstance'; 

// GET ALL
export const getAllRegistrations = async () => {
    try {
        const response = await api.get('/api/Registration/list');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching registrations:', error);
        throw error; 
    }
};

// CREATE
export const createRegistration = async (payload) => {
    try {
        const response = await api.post("/api/Registration", payload);
        return response.data;
    } catch (error) {
        console.error("Error creating registration:", error);
        throw error;
    }
};

// UPDATE
export const updateRegistration = async (payload) => {
    try {
        const response = await api.put(`/api/Registration`, payload);
        return response.data;
    } catch (error) {
        console.error("Error updating registration:", error);
        throw error;
    }
};

// GET BY ID
export const getRegistrationById = async (id) => {
    try {
        const response = await api.get(`/api/Registration/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching registration:", error);
        throw error;
    }
};

// DELETE
export const deleteRegistration = async (id) => {
    try {
        const response = await api.delete(`/api/Registration/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting registration:", error);
        throw error;
    }
};