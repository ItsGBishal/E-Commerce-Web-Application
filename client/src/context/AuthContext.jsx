import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return;
    }

    localStorage.setItem('token', token);
  }, [token]);

  const login = async (credentials) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    const decoded = decodeToken(data.token);
    const nextUser = { ...data.user, role: decoded?.role || data.user.role };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const { data } = await axiosInstance.post('/auth/register', payload);
    const decoded = decodeToken(data.token);
    const nextUser = { ...data.user, role: decoded?.role || data.user.role };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role || decodeToken(token)?.role,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token)
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
