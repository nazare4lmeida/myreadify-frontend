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
      // Token não é mais carregado ou usado aqui
      // const storagedToken = localStorage.getItem('@MyReadify:token');

      if (storagedUser) {
        setUser(JSON.parse(storagedUser));
        // api.defaults.headers.Authorization = `Bearer ${storagedToken}`; // Não é mais necessário
      }
      setLoading(false);
    };
    loadStoragedData();
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: apiUser } = response.data; // Removido 'token' da desestruturação

      localStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      // localStorage.removeItem('@MyReadify:token'); // Token não é mais salvo

      setUser(apiUser);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Falha no login');
    }
  };

  const signOut = () => {
    localStorage.removeItem('@MyReadify:user');
    localStorage.removeItem('@MyReadify:token'); // Remove o token mesmo que não seja salvo (para limpar qualquer resquício)
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
