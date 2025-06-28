
import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ConsultaCursos() {
  useEffect(() => {
    const obtenerCursos = async () => {
      // Obtener todos los cursos
      const { data: cursos, error: errorCursos } = await supabase
        .from('curso')
        .select('id_curso, nombre');

      if (errorCursos) {
        console.error('Error al obtener cursos:', errorCursos);
        return;
      }

      console.log('Cursos obtenidos:', cursos);

      // Iterar sobre los cursos y obtener las materias asociadas
      for (const curso of cursos) {
        const { data: materias, error: errorMaterias } = await supabase
          .from('materia_curso')
          .select(`materia (nombre)`)
          .eq('id_curso', curso.id_curso);

        if (errorMaterias) {
          console.error(`Error al obtener materias para el curso ${curso.nombre}:`, errorMaterias);
        } else {
          console.log(`Materias del curso ${curso.nombre}:`, materias);
        }
      }
    };

    obtenerCursos();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Consulta de Cursos</h1>
    </div>
  );
}