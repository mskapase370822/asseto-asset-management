import api from './api';

export const getUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.patch(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getUserProfile = () => api.get('/users/profile');
export const getRoles = () => api.get('/users/roles');
export const searchUsers = (params) => api.get('/users/search', { params });
export const resetUserPassword = (id, data) => api.post(`/users/${id}/reset-password`, data);
