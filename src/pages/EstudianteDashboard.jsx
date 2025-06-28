
  import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ConsultaCursos() {
  useEffect(() => {
    const obtenerCursos = async () => {
      const { data, error } = await supabase
        .from('curso')
        .select('nombre');

      if (error) {
        console.error('Error al obtener cursos:', error);
      } else {
        console.log('Cursos obtenidos:', data);
      }
    };

    const obtenerMaterias = async () => {
      const { data, error } = await supabase
        .from('materia_curso')
        .select('');

      if (error) {
        console.error('Error al obtener cursos:', error);
      } else {
        console.log('Cursos obtenidos:', data);
      }
    };

    obtenerCursos();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Hola prueba</h1>
      
    </div>); // No renderiza nada, solo consulta
}