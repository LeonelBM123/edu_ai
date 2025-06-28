// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Muestra un loader mientras se verifica la autenticación
    return <div>Cargando...</div>;
  }

  // Si el usuario no está autenticado, redirige a la página de login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Si está autenticado, renderiza el componente hijo de la ruta
  return <Outlet />;
};

export default ProtectedRoute;