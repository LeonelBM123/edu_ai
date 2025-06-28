import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // 👈 para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log('Inicio de sesión exitoso:', data.session)
      navigate('/estudiantelayout');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto' }}>
        <h1 className="text-3xl text-primary font-bold">Hola Mau con Tailwind 🎨</h1>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Ingresar</button>
        <a href='/register'>Registrate</a>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
