// src/layouts/EstudiantesLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button'; 
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  // Estado para controlar qué sección está activa (nivel, grado, materia)
  const [activeSection, setActiveSection] = useState('level'); // 'level', 'grade', 'subject'
  const [selectedLevel, setSelectedLevel] = useState(null); // 'primaria', 'secundaria'
  const [selectedGrade, setSelectedGrade] = useState(null); // '3ro', etc.

  // --- Datos de ejemplo para el MVP ---
  const levels = [
    { id: 'primaria', name: 'Primaria', enabled: true },
    { id: 'secundaria', name: 'Secundaria', enabled: false }, // Deshabilitado para MVP
  ];

  const grades = [
    { id: '1ro', name: '1ro', enabled: false },
    { id: '2do', name: '2do', enabled: false },
    { id: '3ro', name: '3ro', enabled: true }, // Habilitado para MVP
    { id: '4to', name: '4to', enabled: false },
    { id: '5to', name: '5to', enabled: false },
    { id: '6to', name: '6to', enabled: false },
  ];

  const subjects = [
    { id: 'matematicas', name: 'Matemáticas', enabled: true }, // Habilitado para MVP
    { id: 'lenguaje', name: 'Lenguaje', enabled: false }, // Deshabilitado para MVP
  ];
  // ------------------------------------

  const handleLevelSelect = (levelId) => {
    if (levels.find(l => l.id === levelId)?.enabled) {
      setSelectedLevel(levelId);
      setActiveSection('grade');
    }
  };

  const handleGradeSelect = (gradeId) => {
    // Solo permitimos seleccionar "3ro" si el nivel es "primaria"
    if (selectedLevel === 'primaria' && grades.find(g => g.id === gradeId)?.enabled) {
      setSelectedGrade(gradeId);
      setActiveSection('subject');
    }
  };

  const handleSubjectSelect = (subjectId) => {
    // Solo permitimos seleccionar "Matemáticas" si el grado es "3ro" y nivel es "primaria"
    if (selectedLevel === 'primaria' && selectedGrade === '3ro' && subjects.find(s => s.id === subjectId)?.enabled) {
      // Navegar a la lista de lecciones con los parámetros seleccionados
      navigate(`/student/lessons?level=${selectedLevel}&grade=${selectedGrade}&subject=${subjectId}`);
    }
  };

  return (
    <div className="student-dashboard-container">
      <h1>¡Hola Estudiante!</h1>

      {/* Menú de Nivel (Primaria/Secundaria) */}
      {activeSection === 'level' && (
        <div className="selection-section">
          <h2>Elige un Nivel:</h2>
          <div className="options-grid">
            {levels.map((level) => (
              <Button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                disabled={!level.enabled}
                className={!level.enabled ? 'disabled-button' : ''}
              >
                {level.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Menú de Grado (1ro a 6to) */}
      {activeSection === 'grade' && selectedLevel && (
        <div className="selection-section">
          <h2>Elige un Grado en {selectedLevel === 'primaria' ? 'Primaria' : 'Secundaria'}:</h2>
          <div className="options-grid">
            {grades.map((grade) => (
              <Button
                key={grade.id}
                onClick={() => handleGradeSelect(grade.id)}
                disabled={!grade.enabled}
                className={!grade.enabled ? 'disabled-button' : ''}
              >
                {grade.name}
              </Button>
            ))}
          </div>
          <Button onClick={() => setActiveSection('level')} className="back-button">
            Volver a Niveles
          </Button>
        </div>
      )}

      {/* Menú de Materias (Matemáticas/Lenguaje) */}
      {activeSection === 'subject' && selectedGrade && (
        <div className="selection-section">
          <h2>Elige una Materia en {selectedGrade}:</h2>
          <div className="options-grid">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                onClick={() => handleSubjectSelect(subject.id)}
                disabled={!subject.enabled}
                className={!subject.enabled ? 'disabled-button' : ''}
              >
                {subject.name}
              </Button>
            ))}
          </div>
          <Button onClick={() => setActiveSection('grade')} className="back-button">
            Volver a Grados
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;