import api from './api';

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const logout = (data) => api.post('/auth/logout', data);
export const refreshToken = (data) => api.post('/auth/token/refresh', data);
export const generateOtp = () => api.get('/auth/generate-otp');
export const verifyOtp = (data) => api.post('/auth/verify-otp', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const changePassword = (data) => api.post('/auth/change-password', data);
