import { supabase } from '../supabaseClient'; // Importamos el cliente que ya tienes configurado

/**
 * Obtiene los datos del usuario que tiene la sesión activa.
 * Esta es la forma correcta de identificar al usuario en cualquier página después del login.
 */
export const fetchCurrentUserData = async () => {
  // 1. Obtenemos la sesión del usuario actual desde Supabase Auth.
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // 2. Si no hay usuario logueado o hay un error, devolvemos un perfil de "invitado".
  if (authError || !user) {
    console.error('No hay usuario logueado:', authError?.message);
    return { nombre: 'Invitado', correo: '' };
  }

  // 3. Si tenemos el usuario, usamos su ID para buscar su perfil en nuestra tabla 'usuario'.
  const { data: profileData, error: profileError } = await supabase
    .from('usuario') // Usando el nombre de tu tabla 'usuario'
    .select('nombre, correo') // Obtenemos el nombre y correo
    .eq('id_usuario', user.id) // Comparamos con el ID de Supabase Auth
    .single(); // .single() para obtener un solo objeto

  // 4. Si hay un error buscando el perfil, lo notificamos y devolvemos un valor por defecto.
  if (profileError) {
    console.error('Error al obtener el perfil del usuario:', profileError.message);
    return { nombre: 'Estudiante', correo: user.email }; // Usamos el email de Auth como fallback
  }
  
  return profileData;
};


/**
 * Obtiene todos los cursos de la base de datos, ordenados de manera ascendente.
 */
export const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('curso')
    .select('*')
    // Esta línea asegura que los cursos se muestren en orden ascendente (1ro, 2do, 3ro...)
    .order('id_curso', { ascending: true });

  if (error) {
    console.error('Error al obtener los cursos:', error);
    return [];
  }
  return data;
};

/**
 * Obtiene las materias para un curso específico usando la tabla intermedia 'materia_curso'.
 * @param {number} courseId - El ID del curso.
 */
export const fetchSubjectsForCourse = async (courseId) => {
  const { data, error } = await supabase
    .from('materia_curso')
    .select('materia(*)')
    .eq('id_curso', courseId);

  if (error) {
    console.error('Error al obtener las materias del curso:', error);
    return [];
  }
  return data.map(item => item.materia);
};

/**
 * Obtiene los temas (temario) para una materia dentro de un curso específico.
 * @param {number} subjectId - El ID de la materia.
 * @param {number} courseId - El ID del curso.
 */
export const fetchSyllabusForSubject = async (subjectId, courseId) => {
  const { data, error } = await supabase
    .from('tema')
    .select('*')
    .eq('id_materia', subjectId)
    .eq('id_curso', courseId)
    .order('nro_tema', { ascending: true });

  if (error) {
    console.error('Error al obtener el temario:', error);
    return [];
  }
  return data;
};