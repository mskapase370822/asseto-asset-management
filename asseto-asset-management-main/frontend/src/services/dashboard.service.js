import api from './api';

export const getDashboardAssets = () => api.get('/dashboard/assets');
export const getDashboardUsers = () => api.get('/dashboard/users');
export const getDashboardProducts = () => api.get('/dashboard/products');
export const getDashboardVendors = () => api.get('/dashboard/vendors');
export const getDashboardLocations = () => api.get('/dashboard/locations');
export const getDashboardActivity = () => api.get('/dashboard/activity');
