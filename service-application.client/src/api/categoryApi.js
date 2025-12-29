import api from "./baseapiinstance";

// GET ALL CATEGORIES
export const getAllCategories = async () => {
    try {
        const response = await api.get("/api/category/list");
        return response.data; // expect array of categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// GET CATEGORY BY ID
// GET CATEGORY BY ID
export const getCategoryById = async (id) => {
    try {
        const response = await api.get(`/api/Category/${id}`);
        return response.data.data; // <-- Return the inner 'data' object
    } catch (error) {
        console.error(`Error fetching category with id ${id}:`, error);
        throw error;
    }
};

// CREATE CATEGORY
export const createCategory = async (data) => {
    try {
        const response = await api.post("/api/category", {
            name: data.name,
            description: data.description,
            icon: data.icon,
            link: data.link,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

// UPDATE CATEGORY
export const updateCategory = async (id, data) => {
    try {
        const response = await api.put(`/api/category/${id}`, {
            name: data.name,
            description: data.description,
            icon: data.icon,
            link: data.link,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

// DELETE CATEGORY
export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/api/category/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};
