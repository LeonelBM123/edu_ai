import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [sexo, setSexo] = useState('M');
  const [rol, setRol] = useState('estudiante');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo.trim(),
      password: password.trim(),
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    // 2. Insertar en la tabla usuarios
    const { user } = authData;
    const { error: insertError } = await supabase.from('usuarios').insert({
      id_usuario: user.id,
      nombre,
      correo,
      password, // ⚠️ No deberías guardar contraseñas en texto plano (ver nota abajo)
      sexo,
      fecha_creacion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      rol,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate('/'); // O redirige a login
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        /><br /><br />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select><br /><br />
        <select value={rol} onChange={(e) => setRol(e.target.value)} required>
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
        </select><br /><br />
        <button type="submit">Registrarse</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
