import api from './api';

export const getVendors = (params) => api.get('/vendors', { params });
export const getVendor = (id) => api.get(`/vendors/${id}`);
export const createVendor = (data) => api.post('/vendors', data);
export const updateVendor = (id, data) => api.patch(`/vendors/${id}`, data);
export const deleteVendor = (id) => api.delete(`/vendors/${id}`);
export const searchVendors = (params) => api.get('/vendors/search', { params });
export const getVendorsDropdown = () => api.get('/vendors/dropdown');
