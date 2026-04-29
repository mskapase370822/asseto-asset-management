import api from './api';

export const getTickets = (params) => api.get('/support', { params });
export const createTicket = (data) => api.post('/support', data);
export const updateTicket = (id, data) => api.patch(`/support/${id}`, data);
export const deleteTicket = (id) => api.delete(`/support/${id}`);
