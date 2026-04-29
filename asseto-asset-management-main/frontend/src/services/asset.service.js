import api from './api';

export const getAssets = (params) => api.get('/assets', { params });
export const getAsset = (id) => api.get(`/assets/${id}`);
export const createAsset = (data) => api.post('/assets', data);
export const updateAsset = (id, data) => api.patch(`/assets/${id}`, data);
export const deleteAsset = (id) => api.delete(`/assets/${id}`);
export const searchAssets = (params) => api.get('/assets/search', { params });
export const updateAssetStatus = (id, data) => api.patch(`/assets/${id}/status`, data);
export const assignAsset = (id, data) => api.post(`/assets/${id}/assign`, data);
export const unassignAsset = (id, data) => api.post(`/assets/${id}/unassign`, data);
export const getNotifications = () => api.get('/assets/notifications');
export const markNotificationsRead = () => api.patch('/assets/notifications/mark-read');
export const getWarrantyFlag = () => api.get('/assets/warranty-flag');
