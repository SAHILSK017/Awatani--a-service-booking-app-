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
