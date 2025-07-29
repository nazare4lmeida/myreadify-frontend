// src/services/api.js

import axios from 'axios';

const api = axios.create({
  // A URL base da API é carregada das variáveis de ambiente do Vite.
  // Isso permite configurar URLs diferentes para desenvolvimento e produção.
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para adicionar o token de autenticação a cada requisição.
// ESSENCIAL para rotas protegidas.
api.interceptors.request.use(
  (config) => {
    // Tenta obter o token JWT do localStorage.
    const token = localStorage.getItem('@MyReadify:token');
    if (token) {
      // Se o token existe, adiciona-o ao cabeçalho de Autorização.
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('API INTERCEPTOR: Token JWT adicionado à requisição.', config.url); // Para depuração
    } else {
      // console.log('API INTERCEPTOR: Nenhum token JWT encontrado no localStorage para esta requisição.', config.url); // Para depuração
    }
    return config; // Retorna a configuração da requisição modificada.
  },
  (error) => {
    // Em caso de erro na requisição (ex: erro de rede antes de ser enviada), rejeita a Promise.
    return Promise.reject(error);
  }
);


export default api;
