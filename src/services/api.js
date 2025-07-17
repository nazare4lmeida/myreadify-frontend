// src/services/api.js
import axios from 'axios';

// Cria uma instância do axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'http://localhost:3333/api', // A porta deve ser a mesma do seu back-end
});

export default api;