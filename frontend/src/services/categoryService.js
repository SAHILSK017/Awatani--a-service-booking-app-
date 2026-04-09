import api from './api.js';

export const getCategories = async () => {
  const response = await api.get('/category');
  return response.data;
};

export const addCategory = async (data) => {
  const response = await api.post('/category', data);
  return response.data;
};

export const getServices = async () => {
  const response = await api.get('/service');
  return response.data;
};

export const addService = async (data) => {
  const response = await api.post('/service', data);
  return response.data;
};

