import { create } from 'zustand';
import api from '../api/client';

const getInitialUser = () => {
  try {
    const item = localStorage.getItem('indigo_user');
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn('Failed to parse indigo_user from localStorage', e);
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem('indigo_token') || null,
  isAuthenticated: !!localStorage.getItem('indigo_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('indigo_token', access_token);
      localStorage.setItem('indigo_user', JSON.stringify(user));

      set({
        token: access_token,
        user,
        isAuthenticated: true,
        loading: false,
      });
      return user;
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const { access_token, user } = response.data;

      localStorage.setItem('indigo_token', access_token);
      localStorage.setItem('indigo_user', JSON.stringify(user));

      set({
        token: access_token,
        user,
        isAuthenticated: true,
        loading: false,
      });
      return user;
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('indigo_token');
    localStorage.removeItem('indigo_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data });
      localStorage.setItem('indigo_user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  }
}));
