// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../features/Auth/AuthService';
import { supabase } from '../supabaseClient'; // Asegúrate de importar supabase

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener la sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching initial user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Suscribirse a los cambios de estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // console.log(`Supabase Auth event: ${event}`, session); // Para depuración
        setUser(session?.user || null);
      }
    );

    // Limpiar el listener al desmontar el componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const newUser = await AuthService.signIn(email, password);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const newUser = await AuthService.signUp(email, password);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Register error:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user, // Booleano para verificar si hay un usuario logueado
  };

  // Solo renderiza los hijos una vez que el estado de carga inicial ha terminado
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Cargando autenticación...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};