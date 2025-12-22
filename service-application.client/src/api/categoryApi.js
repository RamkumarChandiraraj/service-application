import api from "./baseapiinstance";

export const getAllCategories = async () => {
    const res = await api.get("/api/category/list");
    return res.data;
};

export const getCategoryById = async (id) => {
    const res = await api.get(`/api/category/${id}`);
    return res.data;
};

export const createCategory = async (payload) => {
    return await api.post("/api/category", payload);
};

export const updateCategory = async (id, payload) => {
    return await api.put(`/api/category/${id}`, payload);
};

export const deleteCategory = async (id) => {
    return await api.delete(`/api/category/${id}`);
};
