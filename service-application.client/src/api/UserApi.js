import api from "./baseapiinstance";

// GET ALL USERS
export const getAllUsers = async () => {
    try {
        const { data } = await api.get("/api/User/list");
        return data;
    } catch (error) {
        console.error("Error fetching users:", error.response || error.message);
        throw error;
    }
};

// CREATE USER
export const createUser = async (payload) => {
    try {
        const { data } = await api.post("/api/User", payload);
        return data;
    } catch (error) {
        console.error("Error creating user:", error.response || error.message);
        throw error;
    }
};

// UPDATE USER
export const updateUser = async (id, payload) => {
    try {
        const { data } = await api.put(`/api/User?id=${id}`, payload);
        return data;
    } catch (error) {
        console.error("Error updating user:", error.response || error.message);
        throw error;
    }
};

// GET USER BY ID
export const getUserById = async (id) => {
    try {
        const { data } = await api.get(`/api/User/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
        throw error;
    }
};

// DELETE USER
export const deleteUser = async (id) => {
    try {
        const { data } = await api.delete(`/api/User/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting user:", error.response || error.message);
        throw error;
    }
};
