import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.method.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method.toUpperCase(), response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, 'Status:', error.response?.status);
    return Promise.reject(error);
  }
);

export default api;
