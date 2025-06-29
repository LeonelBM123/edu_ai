// src/routes/AppRouter.jsx
import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logito.png';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Brain, Sparkles, ArrowRight, BookOpen, Users, Zap } from 'lucide-react';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';
import TemaView from '../pages/TemaView';

// Layouts
import DocenteLayout from '../layouts/DocentesLayout';
import EstudiantesLayout from '../layouts/EstudiantesLayout';


const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: Brain, text: "IA Avanzada", delay: "0.2s" },
    { icon: BookOpen, text: "Aprendizaje Personalizado", delay: "0.4s" },
    { icon: Users, text: "Comunidad Global", delay: "0.6s" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-100"> {/* Fondo más claro */}
      {/* Fondo animado con partículas */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-200/50 rounded-full animate-pulse" // Partículas más claras
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Efecto de seguimiento del mouse */}
      <div 
        className="absolute w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none transition-all duration-300" // Efecto del mouse más claro
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* Logo animado con tu logo original */}
        <div 
          className={`mb-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          }`}
        >
          <div className="relative group">
            {/* Halo de luz de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-300 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 animate-pulse" /> {/* Halo más claro */}
            
            {/* Contenedor del logo */}
            <div className="relative bg-gradient-to-r from-blue-100/40 to-purple-200/40 backdrop-blur-sm p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300 border border-blue-200/50"> {/* Contenedor más claro */}
              {/* Tu logo original */}
              <img 
                src={logo}
                alt="Logo de Edu.AI" 
                className="h-32 w-32 object-contain relative z-10" 
              />
            </div>
            
            {/* Cerebro decorativo flotante */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-300 to-purple-300 p-2 rounded-full shadow-lg animate-bounce"> {/* Cerebro decorativo más claro */}
              <Brain className="w-6 h-6 text-white" />
            </div>
            
            {/* Sparkles animados */}
            <Sparkles className="absolute -bottom-2 -left-2 w-8 h-8 text-yellow-300 animate-spin" /> {/* Sparkles más claros */}
            <Sparkles className="absolute -top-2 -right-8 w-6 h-6 text-blue-300 animate-pulse" /> {/* Sparkles más claros */}
          </div>
        </div>

        {/* Título principal */}
        <h1 
          className={`text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-900 to-purple-900 bg-clip-text text-transparent transition-all duration-1000 delay-200 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Bienvenido a
          <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text animate-pulse"> {/* Título Edu.AI más claro */}
            Edu.AI
          </span>
        </h1>

        {/* Subtítulo con efecto de escritura */}
        <p 
          className={`text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl transition-all duration-1000 delay-400 transform ${ // Texto más oscuro para contraste
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          La plataforma inteligente de{' '}
          <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold"> {/* Resaltado más claro */}
            aprendizaje personalizado
          </span>{' '}
          que se adapta a ti
        </p>

        {/* Características */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {features.map((Feature, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 bg-blue-50/50 backdrop-blur-sm rounded-full px-6 py-3 transform transition-all duration-1000 hover:scale-105 hover:bg-blue-100/70 ${ // Características más claras
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: Feature.delay }}
            >
              <Feature.icon className="w-5 h-5 text-blue-400" /> {/* Íconos más claros */}
              <span className="text-gray-800 font-medium">{Feature.text}</span> {/* Texto más oscuro para contraste */}
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-800 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <a href='/auth' className="group relative overflow-hidden bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"> {/* Botón de iniciar sesión más claro */}
            <span className="relative z-10 flex items-center justify-center">
              Iniciar Sesión
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          <a href='/register' className="group border-2 border-blue-300 hover:border-blue-200 text-blue-700 hover:text-blue-900 font-bold py-4 px-8 rounded-full backdrop-blur-sm hover:bg-blue-200/50 transform hover:scale-105 transition-all duration-300"> {/* Botón de registrarse más claro */}
            <span className="flex items-center justify-center">
              Registrarse
              <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </a>
        </div>

        {/* Indicador de scroll */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center"> {/* Indicador de scroll más claro */}
              <div className="w-1 h-3 bg-blue-300 rounded-full mt-2 animate-pulse" /> {/* Animación del indicador más clara */}
            </div>
          </div>
        </div>
      </div>

      {/* Ondas decorativas en el fondo */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-blue-400/20" // Ondas más claras
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-blue-400/10" // Ondas más claras
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-blue-400/5" // Ondas más claras
          />
        </svg>
      </div>
    </div>
  );
};

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