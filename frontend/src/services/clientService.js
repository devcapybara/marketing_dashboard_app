import api from './api';

export const clientService = {
  listClients: async (filters = {}) => {
    const { status, search } = filters;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get(`/api/clients?${params.toString()}`);
    return response.data;
  },

  getClientById: async (clientId) => {
    const response = await api.get(`/api/clients/${clientId}`);
    return response.data;
  },

  createClient: async (clientData) => {
    const response = await api.post('/api/clients', clientData);
    return response.data;
  },

  updateClient: async (clientId, clientData) => {
    const response = await api.put(`/api/clients/${clientId}`, clientData);
    return response.data;
  },

  deleteClient: async (clientId) => {
    const response = await api.delete(`/api/clients/${clientId}`);
    return response.data;
  },
};

