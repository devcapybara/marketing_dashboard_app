import api from './api';

export const leadService = {
  list: async (clientId, page = 1, limit = 25, search = '') => {
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    params.append('page', page);
    params.append('limit', limit);
    if (search) params.append('search', search);
    const res = await api.get(`/api/leads?${params.toString()}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post('/api/leads', payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/api/leads/${id}`, payload);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/api/leads/${id}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/leads/${id}`);
    return res.data;
  },
};

