// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';
import TemaView from '../pages/TemaView';

// Layouts
import DocenteLayout from '../layouts/DocentesLayout';
import EstudiantesLayout from '../layouts/EstudiantesLayout';


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
                    {/* --- RUTAS PÚBLICAS --- */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* --- RUTAS PROTEGIDAS PARA DOCENTES --- */}
                    <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
                        <Route path="/dashboard/teacher" element={<DocenteLayout />}>
                            {/* Rutas anidadas para el docente */}
                        </Route>
                    </Route>
                    
                    {/* --- RUTAS PROTEGIDAS PARA ESTUDIANTES --- */}
                    <Route element={<ProtectedRoute allowedRoles={['estudiante']} />}>
                        {/* El dashboard principal del estudiante */}
                        <Route path="/dashboard/student" element={<EstudiantesLayout />} />
                        
                        {/* La vista del tema, ahora protegida. Es una ruta hermana al layout,
                            lo que significa que reemplazará toda la página, que es lo que quieres. */}
                        <Route path="/dashboard/student/tema/:id_tema" element={<TemaView />} />
                    </Route>

                    {/* --- FALLBACK --- */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRouter;