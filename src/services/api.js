// src/services/api.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

import axios from 'axios';

const api = axios.create({
  // <<< CORREÇÃO PRINCIPAL AQUI >>>
  // Agora o código busca a variável de ambiente que você configurou na Vercel.
  baseURL: import.meta.env.VITE_API_URL, 
});

// O seu interceptor para adicionar o token de autenticação está perfeito.
// Ele garante que o usuário continue logado em todas as requisições.
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