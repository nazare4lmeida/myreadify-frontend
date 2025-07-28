// src/services/api.js (VERSÃO FINAL COM URL "CHUMBADA" PARA PRODUÇÃO)

import axios from 'axios';

const api = axios.create({
  // <<< A CORREÇÃO FINAL ESTÁ AQUI >>>
  // Nós colocamos a URL completa e correta do seu backend no Render,
  // incluindo o /api no final.
  baseURL: 'https://myreadify-backend.onrender.com/api', 
});

// O seu interceptor para adicionar o token de autenticação está perfeito.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@MyReadify:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;