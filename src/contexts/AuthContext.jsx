import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const signIn = async ({ email, password }) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: apiUser, token } = response.data;

      setUser(apiUser);
      api.defaults.headers.authorization = `Bearer ${token}`;

      localStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      localStorage.setItem('@MyReadify:token', token);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Falha no login');
    }
  };

  const signOut = () => {
    localStorage.removeItem('@MyReadify:user');
    localStorage.removeItem('@MyReadify:token');
    setUser(null);
  };

  const signUp = async ({ name, email, password }) => {
    try {
      await api.post('/users', { name, email, password });

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Não foi possível realizar o cadastro.';
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}