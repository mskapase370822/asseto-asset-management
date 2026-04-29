import api from './api';

export const uploadImage = (formData) =>
  api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const uploadAssetsCsv = (formData) =>
  api.post('/upload/csv/assets', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const uploadUsersCsv = (formData) =>
  api.post('/upload/csv/users', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
