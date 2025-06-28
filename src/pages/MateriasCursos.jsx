import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const MateriasCursos = () => {
  const { id } = useParams(); // este 'id' es el id_curso
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    const fetchMaterias = async () => {
      const { data: materiaCurso, error: error1 } = await supabase
        .from('materia_curso')
        .select('id_materia')
        .eq('id_curso', id);

      if (error1) {
        console.error("Error en materia_curso:", error1.message);
        return;
      }

      const idsMaterias = materiaCurso.map(m => m.id_materia);

      const { data: materiasData, error: error2 } = await supabase
        .from('materia')
        .select('id_materia, nombre')
        .in('id_materia', idsMaterias);

      if (error2) {
        console.error("Error en materia:", error2.message);
        return;
      }

      setMaterias(materiasData);
    };

    fetchMaterias();
  }, [id]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Materias del Curso</h1>
      <ul className="space-y-2">
        {materias.map(m => (
          <li key={m.id_materia} className="bg-white/10 p-4 rounded-lg">
            {m.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MateriasCursos;
