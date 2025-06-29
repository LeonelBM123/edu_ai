import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeleccionCursos = () => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNivel, setSelectedNivel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const studentId = user?.id;

        if (!studentId) {
          setError("No se ha encontrado la sesión del usuario. Por favor, inicia sesión de nuevo.");
          setIsLoading(false);
          return;
        }

        let { data: cursosData, error: dbError } = await supabase
          .from('curso_estudiante')
          .select(`curso ( id_curso , nombre )`)
          .eq('id_estudiante', studentId);

        if (dbError) {
          setError(`Error al cargar tus cursos: ${dbError.message}`);
          setIsLoading(false);
          return;
        }

        const cursoId = cursosData?.[0]?.curso?.id_curso;
        if (!cursoId) {
          setError("No se encontraron cursos asociados a tu cuenta.");
          setIsLoading(false);
          return;
        }

        const { data: materiasData, error: materiasError } = await supabase
          .from('materia_curso')
          .select(`id_materia, materia ( id_materia, nombre )`)
          .eq('id_curso', cursoId);

        if (materiasError) {
          setError(`Error al cargar las materias: ${materiasError.message}`);
          setIsLoading(false);
          return;
        }

        setStudentData({ cursos: cursosData, materias: materiasData });
      } catch (e) {
        setError("Ocurrió un error al cargar los datos. Por favor, recarga la página.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentContent();
  }, []);

  const nivelesDisponibles = () => {
    if (!studentData?.cursos) return [];
    const nombres = studentData.cursos.map(c => c.curso.nombre.toLowerCase());
    return [
      nombres.some(n => n.includes("primaria")) && "primaria",
      nombres.some(n => n.includes("secundaria")) && "secundaria",
    ].filter(Boolean);
  };

  const cursoActual = () => {
    return studentData?.cursos?.[0]?.curso?.nombre?.toLowerCase() || '';
  };

  const cursoIdActual = () => {
    return studentData?.cursos?.[0]?.curso?.id_curso || null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
        <div className="text-center p-6 bg-white/10 rounded-lg shadow-xl">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Cargando tu progreso...</h2>
          <p className="text-purple-200">Esto puede tardar un momento.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-rose-900 text-white p-4">
        <div className="text-center p-6 bg-white/10 rounded-lg shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const niveles = nivelesDisponibles();
  const nivelDelCurso = cursoActual();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Selecciona tu Nivel</h1>
      </div>

      <div className="flex justify-center gap-6 mb-8">
        {niveles.map((nivel) => (
          <button
            key={nivel}
            onClick={() => setSelectedNivel(nivel)}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${selectedNivel === nivel ? 'bg-yellow-400 text-black' : 'bg-white/20 hover:bg-white/30'}`}
          >
            {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
          </button>
        ))}
      </div>

      {selectedNivel && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Grado Disponible</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4, 5, 6].map(grado => {
              const gradoTexto = `${grado}ro ${selectedNivel}`;
              const habilitado = nivelDelCurso.includes(selectedNivel) && nivelDelCurso.includes(`${grado}ro`);
              return (
                <button
                  key={grado}
                  className={`px-5 py-2 rounded-lg font-medium ${habilitado ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 cursor-not-allowed opacity-50'}`}
                  disabled={!habilitado}
                  onClick={() => habilitado && navigate(`materias-cursos/${cursoIdActual()}`)}
                >
                  {gradoTexto}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeleccionCursos;
