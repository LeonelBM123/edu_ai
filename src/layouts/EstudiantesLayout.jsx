
import { Outlet } from 'react-router-dom';

export default function EstudianteLayout() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Hola estudiante 👨‍🎓</h1>
      <p>Bienvenido a tu panel educativo.</p>
       <Outlet />
    </div>
  );
}
