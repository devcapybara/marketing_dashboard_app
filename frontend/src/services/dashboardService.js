import api from './api';

export const dashboardService = {
  getSuperAdminSummary: async (filters = {}) => {
    const { dateFrom, dateTo, clientId, adminId } = filters;
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if (clientId) params.append('clientId', clientId);
    if (adminId) params.append('adminId', adminId);
    
    const response = await api.get(`/api/dashboard/super-admin?${params.toString()}`);
    return response.data;
  },

  getAdminSummary: async (filters = {}) => {
    const { dateFrom, dateTo, clientId } = filters;
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if (clientId) params.append('clientId', clientId);
    
    const response = await api.get(`/api/dashboard/admin?${params.toString()}`);
    return response.data;
  },

  getClientSummary: async (filters = {}) => {
    const { dateFrom, dateTo } = filters;
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const response = await api.get(`/api/dashboard/client?${params.toString()}`);
    return response.data;
  },
};

