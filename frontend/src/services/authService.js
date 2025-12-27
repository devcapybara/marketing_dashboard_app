import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const payload = res?.data?.data || res?.data || {};
    return { data: payload };
  },
  getCurrentUser: async () => {
    const res = await api.get('/api/auth/me');
    const payload = res?.data?.data || res?.data || {};
    return { data: payload };
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  register: async ({ name, email, password, companyName }) => {
    const res = await api.post('/api/auth/register', { name, email, password, companyName });
    return res.data;
  },
};
