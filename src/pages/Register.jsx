import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [sexo, setSexo] = useState('M');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo.trim(),
      password: password.trim(),
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const { user } = authData;

    const { error: insertError } = await supabase.from('usuario').insert({
      id_usuario: user.id,
      nombre: nombre,
      correo: correo,
      password: password, // ⚠️ Ojo: idealmente deberías evitar guardar contraseñas acá
      sexo: sexo,
      fecha_creacion: new Date().toISOString().split('T')[0],
      rol: 'estudiante', // 👈 fijo el rol directamente
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate('/');
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
        <button type="submit">Registrarse</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
