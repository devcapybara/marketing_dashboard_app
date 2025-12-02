import api from './api';

export const topupService = {
  listTopups: async (filters = {}) => {
    const { clientId, adAccountId, platform, dateFrom, dateTo } = filters;
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (adAccountId) params.append('adAccountId', adAccountId);
    if (platform) params.append('platform', platform);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const response = await api.get(`/api/topups?${params.toString()}`);
    return response.data;
  },

  getTopupById: async (topupId) => {
    const response = await api.get(`/api/topups/${topupId}`);
    return response.data;
  },

  createTopup: async (topupData) => {
    const response = await api.post('/api/topups', topupData);
    return response.data;
  },

  updateTopup: async (topupId, topupData) => {
    const response = await api.put(`/api/topups/${topupId}`, topupData);
    return response.data;
  },

  deleteTopup: async (topupId) => {
    const response = await api.delete(`/api/topups/${topupId}`);
    return response.data;
  },

  uploadReceipt: async (file) => {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await api.post('/api/topups/upload-receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

