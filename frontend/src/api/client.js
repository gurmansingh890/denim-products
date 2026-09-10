import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('indigo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && (response.data.trim().startsWith('<!DOCTYPE') || response.data.trim().startsWith('<html'))) {
      return Promise.reject(new Error('API endpoint returned HTML instead of JSON'));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
