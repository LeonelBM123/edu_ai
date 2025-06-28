// src/features/Auth/AuthService.js
import { supabase } from '../../supabaseClient';

export const AuthService = {
  /**
   * Registra un nuevo usuario con email y contraseña.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} El usuario o un error.
   */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data.user; // Retorna el objeto de usuario si el registro fue exitoso
  },

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} El usuario o un error.
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data.user; // Retorna el objeto de usuario si el login fue exitoso
  },

  /**
   * Cierra la sesión del usuario actual.
   * @returns {Promise<void>}
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Obtiene la sesión actual del usuario.
   * @returns {Promise<Object|null>} La sesión o null si no hay sesión.
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return session;
  },

  /**
   * Obtiene el usuario actual.
   * @returns {Promise<Object|null>} El usuario o null si no hay usuario.
   */
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return user;
  }
};