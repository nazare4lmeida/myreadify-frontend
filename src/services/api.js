// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://myreadify-backend.onrender.com/api',
});

// O interceptor para adicionar o token de autenticação foi removido.
/*
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@MyReadify:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API INTERCEPTOR: Token JWT adicionado à requisição.', config.url);
    } else {
      console.log('API INTERCEPTOR: Nenhum token JWT encontrado no localStorage para esta requisição.', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

export default api;
