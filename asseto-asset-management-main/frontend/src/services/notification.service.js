import api from './api';

export const getNotifications = (params) => api.get('/notifications', { params });
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markAllRead = () => api.patch('/notifications/mark-all-read');
export const markRead = (id) => api.patch(`/notifications/${id}/read`);
