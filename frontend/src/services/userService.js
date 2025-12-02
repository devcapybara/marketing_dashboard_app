import api from './api';

export const listAdmins = async () => {
  const res = await api.get('/api/users/admins');
  return res.data;
};

export const assignClientToAdmin = async (adminId, clientId) => {
  const res = await api.post(`/api/users/admin/${adminId}/assign-client/${clientId}`);
  return res.data;
};

export const unassignClientFromAdmin = async (adminId, clientId) => {
  const res = await api.post(`/api/users/admin/${adminId}/unassign-client/${clientId}`);
  return res.data;
};