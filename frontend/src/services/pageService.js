import api from './api';

export const pageService = {
  list: async () => {
    const res = await api.get('/api/pages');
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post('/api/pages', payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/api/pages/${id}`, payload);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/api/pages/${id}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/pages/${id}`);
    return res.data;
  },
  getBySlugPublic: async (slug) => {
    const res = await api.get(`/api/pages/public/${slug}`);
    return res.data;
  },
};
