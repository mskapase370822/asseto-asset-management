import api from './api';

export const getLicenses = (params) => api.get('/licenses', { params });
export const getLicense = (id) => api.get(`/licenses/${id}`);
export const createLicense = (data) => api.post('/licenses', data);
export const updateLicense = (id, data) => api.patch(`/licenses/${id}`, data);
export const deleteLicense = (id) => api.delete(`/licenses/${id}`);
export const assignLicense = (id, data) => api.post(`/licenses/${id}/assign`, data);
export const unassignLicense = (id, data) => api.post(`/licenses/${id}/unassign`, data);
