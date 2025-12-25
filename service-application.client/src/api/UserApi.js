import api from "./baseapiinstance";

// GET ALL USERS
export const getAllUsers = async () => {
    try {
        const { data } = await api.get("/api/user/list");
        return data;
    } catch (error) {
        console.error("Error fetching users:", error.response || error.message);
        throw error;
    }
};

// CREATE USER
export const createUser = async (payload) => {
    try {
        const { data } = await api.post("/api/user", payload);
        return data;
    } catch (error) {
        console.error("Error creating user:", error.response || error.message);
        throw error;
    }
};

// UPDATE USER
export const updateUser = async (payload) => {
    try {
        const { data } = await api.put("/api/user", payload);
        return data;
    } catch (error) {
        console.error("Error updating user:", error.response || error.message);
        throw error;
    }
};

// GET USER BY ID
export const getUserById = async (id) => {
    try {
        const { data } = await api.get(`/api/user/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
        throw error;
    }
};

// DELETE USER
export const deleteUser = async (id) => {
    try {
        const { data } = await api.delete(`/api/user/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting user:", error.response || error.message);
        throw error;
    }
};
