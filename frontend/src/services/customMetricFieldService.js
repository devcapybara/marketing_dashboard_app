import api from './api';

export const customMetricFieldService = {
  listCustomFields: async (filters = {}) => {
    const { clientId, platform } = filters;
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (platform) params.append('platform', platform);
    
    const response = await api.get(`/api/custom-metric-fields?${params.toString()}`);
    return response.data;
  },

  createCustomField: async (fieldData) => {
    const response = await api.post('/api/custom-metric-fields', fieldData);
    return response.data;
  },

  updateCustomField: async (fieldId, fieldData) => {
    const response = await api.put(`/api/custom-metric-fields/${fieldId}`, fieldData);
    return response.data;
  },

  deleteCustomField: async (fieldId) => {
    const response = await api.delete(`/api/custom-metric-fields/${fieldId}`);
    return response.data;
  },
};

