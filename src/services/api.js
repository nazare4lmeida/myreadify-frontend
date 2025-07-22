// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
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