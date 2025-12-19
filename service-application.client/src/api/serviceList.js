import api from './baseapiinstance';

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