import api from './api';

export const auditLogService = {
  getAuditLogs: async ({ page = 1, limit = 20, filters = {} } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.email) params.append('email', filters.email);
    if (filters.action) params.append('action', filters.action);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const response = await api.get(`/api/audit-logs?${params.toString()}`);
    return response.data;
  },
};
