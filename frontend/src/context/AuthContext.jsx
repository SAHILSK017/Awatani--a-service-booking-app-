import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, getCurrentUser } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  // ✅ LOGIN
  const loginUser = async (email, password) => {
    try {
      const userData = await login(email, password);

      setUser(userData);

      return { success: true, user: userData }; // ✅ FIXED
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // ✅ REGISTER (AUTO LOGIN)
  const registerUser = async (name, email, password, role) => {
    try {
      const userData = await register(name, email, password, role);

      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // ✅ LOGOUT
  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};