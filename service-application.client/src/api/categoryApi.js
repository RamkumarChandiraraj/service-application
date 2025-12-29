import api from "./baseapiinstance";

//GET ALL CATEGORIES
export const getAllCategories = async () => {
    const response = await api.get("/api/category/list");
    return response.data;
};

// src/services/categoryService.js
// export const getAllCategories = async () => {
//   const response = await api.get("/api/category/list");

//   // ✅ Return ONLY the array
//   return response.data?.data ?? [];
// };


// GET CATEGORY BY ID
export const getCategoryById = async (id) => {
    const response = await api.get(`/api/category/${id}`);
    return response.data;
};

// CREATE CATEGORY
export const createCategory = async (data) => {
    const response = await api.post("/api/category", {
        name: data.name,
        description: data.description,
    });
    return response.data;
};

// UPDATE CATEGORY
export const updateCategory = async (id, data) => {
    const response = await api.put(`/api/category/${id}`, {
        name: data.name,
        description: data.description,
    });
    return response.data;
};

// DELETE CATEGORY
export const deleteCategory = async (id) => {
    const response = await api.delete(`/api/category/${id}`);
    return response.data;
};
