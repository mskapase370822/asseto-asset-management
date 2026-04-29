import api from './api';

export const getPendingAudits = () => api.get('/audits/pending');
export const getCompletedAudits = () => api.get('/audits/completed');
export const createAudit = (data) => api.post('/audits', data);
export const getAudit = (id) => api.get(`/audits/${id}`);
export const getAuditTags = () => api.get('/audits/tags');
export const getAssignedUser = (tag) => api.get(`/audits/assigned-user/${tag}`);
