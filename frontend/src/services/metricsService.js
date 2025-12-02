import api from './api';

export const metricsService = {
  listDailyMetrics: async (filters = {}) => {
    const { clientId, adAccountId, platform, dateFrom, dateTo } = filters;
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (adAccountId) params.append('adAccountId', adAccountId);
    if (platform) params.append('platform', platform);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const response = await api.get(`/api/metrics/daily?${params.toString()}`);
    return response.data;
  },

  getDailyMetricById: async (metricId) => {
    const response = await api.get(`/api/metrics/daily/${metricId}`);
    return response.data;
  },

  createDailyMetric: async (metricData) => {
    const response = await api.post('/api/metrics/daily', metricData);
    return response.data;
  },

  updateDailyMetric: async (metricId, metricData) => {
    const response = await api.put(`/api/metrics/daily/${metricId}`, metricData);
    return response.data;
  },

  deleteDailyMetric: async (metricId) => {
    const response = await api.delete(`/api/metrics/daily/${metricId}`);
    return response.data;
  },
};

