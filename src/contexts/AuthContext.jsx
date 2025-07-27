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
      // Não precisamos mais do token aqui, só do usuário
      if (storagedUser) {
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    };
    loadStoragedData();
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: apiUser, token } = response.data;

      // Salvamos no localStorage
      localStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      localStorage.setItem('@MyReadify:token', token);
      
      // E atualizamos o estado
      setUser(apiUser);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Falha no login');
    }
  };

  const signOut = () => {
    // Apenas limpamos o localStorage e o estado
    localStorage.removeItem('@MyReadify:user');
    localStorage.removeItem('@MyReadify:token');
    setUser(null);
  };

  const signUp = async ({ name, email, password }) => {
    try {
      await api.post('/register', { name, email, password });
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