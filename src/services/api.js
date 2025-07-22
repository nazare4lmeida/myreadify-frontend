import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api'
});

// Interceptor JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@MyReadify:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
