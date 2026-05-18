import api from './api.js';

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get('/admin/bookings');
  return response.data;
};

export const getAllServices = async () => {
  const response = await api.get('/admin/services');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};
