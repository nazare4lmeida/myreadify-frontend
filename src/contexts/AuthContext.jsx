// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// 1. Cria o Contexto
const AuthContext = createContext({});

// 2. Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efeito para carregar dados do localStorage ao iniciar
  useEffect(() => {
    const loadStoragedData = async () => {
      const storagedUser = localStorage.getItem('@MyReadify:user');
      const storagedToken = localStorage.getItem('@MyReadify:token');

      if (storagedUser && storagedToken) {
        api.defaults.headers.authorization = `Bearer ${storagedToken}`;
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    };
    loadStoragedData();
  }, []);

  // Função de Login
  const signIn = async ({ email, password }) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: apiUser, token } = response.data;

      setUser(apiUser);
      api.defaults.headers.authorization = `Bearer ${token}`;

      localStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      localStorage.setItem('@MyReadify:token', token);
    } catch (error) {
      // Lançamos o erro para ser tratado na página de login
      throw new Error(error.response?.data?.error || 'Falha no login');
    }
  };

  // Função de Logout
  const signOut = () => {
    localStorage.removeItem('@MyReadify:user');
    localStorage.removeItem('@MyReadify:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Cria um Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}