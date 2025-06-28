// src/features/Auth/pages/AuthPage.jsx
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { user, loading } = useAuth(); // Usamos 'user' para redirigir si ya está logueado
  const navigate = useNavigate();

  // Si el usuario ya está autenticado y no está cargando, redirige al dashboard
  if (!loading && user) {
    navigate('/dashboard');
    return null; // No renderiza nada mientras redirige
  }

  const handleAuthSuccess = () => {
    // Puedes añadir lógica aquí si necesitas hacer algo específico
    // después de un login/registro exitoso, aparte de la redirección
    // que ya maneja LoginForm/RegisterForm y el AuthProvider.
    console.log('Autenticación exitosa!');
  };

  return (
    <div className="auth-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '400px',
        maxWidth: '90%',
        textAlign: 'center'
      }}>
        <h1>Edu.AI</h1>
        {isLoginView ? (
          <LoginForm onLoginSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm onRegisterSuccess={handleAuthSuccess} />
        )}
        <p style={{ marginTop: '20px' }}>
          {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <span
            onClick={() => setIsLoginView(!isLoginView)}
            style={{ color: '#007bff', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isLoginView ? 'Regístrate aquí' : 'Inicia Sesión'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;