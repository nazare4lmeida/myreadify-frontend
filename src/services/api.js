// src/services/api.js

import axios from 'axios';

const backendUrl = 'https://myreadify-backend.vercel.app';

const apiUrl = import.meta.env.PROD ? backendUrl : 'http://localhost:3333';

const api = axios.create({
  baseURL: apiUrl
});

// Interceptor que insere o token JWT no cabeçalho Authorization
api.interceptors.request.use((config) => {

  // A chave usada para buscar o token agora é a mesma usada no seu AuthContext.
  const token = localStorage.getItem('@MyReadify:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;