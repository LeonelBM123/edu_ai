import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Login.css'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    const userId = data.user.id;

    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario')
      .select('rol')
      .eq('id_usuario', userId)
      .single();

    if (usuarioError) {
      setError('Error al obtener el rol del usuario.');
      return;
    }

    if (usuarioData.rol === 'estudiante') {
      navigate('/estudiantelayout');
    } else {
      setError('Solo los estudiantes pueden iniciar sesión.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Bienvenido</h2>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              placeholder="tucorreo@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Ingresar
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <div className="register-link">
          ¿No tienes cuenta? <a href="/register">Registrate</a>
        </div>
      </div>
    </div>
  );
}
