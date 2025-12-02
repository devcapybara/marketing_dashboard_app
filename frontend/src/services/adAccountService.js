import api from './api';

export const adAccountService = {
  listAdAccounts: async (filters = {}) => {
    const { clientId, platform, isActive } = filters;
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (platform) params.append('platform', platform);
    if (isActive !== undefined) params.append('isActive', isActive);
    
    const response = await api.get(`/api/ad-accounts?${params.toString()}`);
    return response.data;
  },

  getAdAccountById: async (adAccountId) => {
    const response = await api.get(`/api/ad-accounts/${adAccountId}`);
    return response.data;
  },

  createAdAccount: async (adAccountData) => {
    const response = await api.post('/api/ad-accounts', adAccountData);
    return response.data;
  },

  updateAdAccount: async (adAccountId, adAccountData) => {
    const response = await api.put(`/api/ad-accounts/${adAccountId}`, adAccountData);
    return response.data;
  },

  deleteAdAccount: async (adAccountId) => {
    const response = await api.delete(`/api/ad-accounts/${adAccountId}`);
    return response.data;
  },
};

