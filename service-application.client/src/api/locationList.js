import api from "./baseapiinstance";

// GET ALL
export const getAllLocations = async () => {
    try {
        const response = await api.get("/api/location/list");
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw error;
    }
};

// CREATE
export const createLocation = async (payload) => {
    try {
        const response = await api.post("/api/location", payload);
        return response.data;
    } catch (error) {
        console.error("Error creating location:", error);
        throw error;
    }
};

// UPDATE
export const updateLocation = async (payload) => {
    try {
        const response = await api.put("/api/location", payload);
        return response.data;
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
};

// GET BY ID
export const getLocationById = async (id) => {
    try {
        const response = await api.get(`/api/location/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching location with id ${id}:`, error);
        throw error;
    }
};

// DELETE
export const deleteLocation = async (id) => {
    try {
        const response = await api.delete(`/api/location/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting location:", error);
        throw error;
    }
};
