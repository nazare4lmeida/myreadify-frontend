// src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoragedData = () => {
      const storagedUser = localStorage.getItem('@MyReadify:user');
      const storagedToken = localStorage.getItem('@MyReadify:token'); // <<-- Reativado: Carrega o token

      if (storagedUser && storagedToken) { // <<-- Reativado: Verifica também o token
        setUser(JSON.parse(storagedUser));
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`; // <<-- Reativado: Define o token no Axios
      }
      setLoading(false);
    };
    loadStoragedData();
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: apiUser, token } = response.data; // <<-- Recebe o token da resposta

      localStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      localStorage.setItem('@MyReadify:token', token); // <<-- Armazena o token

      setUser(apiUser);
      api.defaults.headers.Authorization = `Bearer ${token}`; // <<-- Define o token para requisições futuras

    } catch (error) {
      throw new Error(error.response?.data?.error || 'Falha no login');
    }
  };

  const signOut = () => {
    localStorage.removeItem('@MyReadify:user');
    localStorage.removeItem('@MyReadify:token'); // <<-- Remove o token também
    setUser(null);
    delete api.defaults.headers.Authorization; // <<-- Remove o token do Axios
  };

  const signUp = async ({ name, email, password }) => {
    try {
      const response = await api.post('/register', { name, email, password }); // <<-- Ajustado para capturar a resposta
      const { user: apiUser, token } = response.data; // <<-- Captura user e token do registro

      // Opcional: Logar automaticamente após o registro
      localStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      localStorage.setItem('@MyReadify:token', token);
      setUser(apiUser);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Não foi possível realizar o cadastro.');
    }
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
