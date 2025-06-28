import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Login con supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const userId = data.user.id;

    // 2. Consultar el rol en la tabla usuario
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario')
      .select('rol')
      .eq('id_usuario', userId)
      .single();

    if (usuarioError) {
      setError('Error al obtener el rol del usuario.');
      return;
    }

    // 3. Redirigir según el rol
    if (usuarioData.rol === 'estudiante') {
      navigate('/estudiantelayout');
    } else if (usuarioData.rol === 'docente') {
      navigate('/docentelayout');
    } else {
      setError('Rol no reconocido.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-dark flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-lg border border-gray-200 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Iniciar sesión</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Correo"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-all font-semibold"
          >
            Ingresar
          </button>
        </form>

        {error && (
          <p className="text-danger mt-4 text-center font-medium">{error}</p>
        )}

        <div className="text-center mt-6 text-sm">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-secondary font-semibold hover:underline">
            Registrate
          </a>
        </div>
      </div>
    </div>
  );
}
