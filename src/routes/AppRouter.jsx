// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

// Layouts
import DocenteLayout from '../layouts/DocentesLayout';
import EstudiantesLayout from '../layouts/EstudiantesLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
    <h1 className="text-4xl font-bold mb-4">Bienvenido a Edu.AI</h1>
    <p className="mb-2">La plataforma inteligente de aprendizaje personalizado.</p>
    <p>
      Por favor, <a href="/auth" className="text-blue-600 hover:underline">inicia sesión</a> o <a href="/register" className="text-blue-600 hover:underline">regístrate</a>.
    </p>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas con ProtectedRoute */}
          <Route
            path="/dashboard/teacher/*"
            element={
              <ProtectedRoute allowedRoles={[ 'docente' ]}>
                <DocenteLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student/*"
            element={
              <ProtectedRoute allowedRoles={[ 'estudiante' ]}>
                <EstudiantesLayout />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
