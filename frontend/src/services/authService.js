import api from './api.js';

// LOGIN
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });

  const { token, user } = response.data;

  // 🔥 SAVE TOKEN
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};

// REGISTER
export const register = async (name, email, password, role) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
    role, // 🔥 important
  });

  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// GET USER
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};