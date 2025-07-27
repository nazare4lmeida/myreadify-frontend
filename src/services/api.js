// src/services/api.js

import axios from 'axios';

const api = axios.create({
  // Se você usa variáveis de ambiente, mantenha como estava.
  // Senão, coloque a URL base aqui.
  baseURL: 'http://localhost:3333/api',
});

// >>> O INTERCEPTOR <<<
// Esta função será executada ANTES de CADA requisição que usar a instância 'api'
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage no último momento possível
    const token = localStorage.getItem('@MyReadify:token');
    
    // Se o token existir, ele é anexado ao cabeçalho da requisição
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Retorna a configuração modificada para a requisição prosseguir
  },
  (error) => {
    // Para tratar erros de requisição
    return Promise.reject(error);
  }
);

export default api;