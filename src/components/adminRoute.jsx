// src/routes/AdminRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
  const { signed, user, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  // Se o usuário está logado E é admin, permite acesso às rotas filhas.
  // Senão, redireciona para a página inicial.
  return signed && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;