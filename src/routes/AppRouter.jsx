// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AuthPage from '../features/Auth/pages/AuthPage';
import ProtectedRoute from './ProtectedRoute';

// Páginas de ejemplo para dashboard
import TeacherDashboardOverview from '../features/TeacherDashboard/pages/DashboardOverview'; // Renombra si tienes conflicto
import StudentDashboardOverview from '../features/StudentDashboard/pages/DashboardOverview'; // Renombra si tienes conflicto

// Componente para una página de inicio simple
const HomePage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Bienvenido a Edu.AI</h1>
    <p>La plataforma inteligente de aprendizaje personalizado.</p>
    <p>Por favor, <a href="/auth">inicia sesión</a> o <a href="/auth">regístrate</a> para continuar.</p>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider> {/* Envuelve toda la aplicación con el AuthProvider */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Rutas protegidas para docentes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<TeacherDashboardOverview />} />
            {/* Agrega más rutas protegidas para docentes aquí */}
            {/* <Route path="/teacher/content" element={<TeacherContentManagementPage />} /> */}
          </Route>

          {/* Rutas protegidas para estudiantes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/student/dashboard" element={<StudentDashboardOverview />} />
            {/* Agrega más rutas protegidas para estudiantes aquí */}
            {/* <Route path="/student/learning-path" element={<StudentLearningPathPage />} /> */}
          </Route>

          {/* Ruta de redirección por defecto si no se encuentra nada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;