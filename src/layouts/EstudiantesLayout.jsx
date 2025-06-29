import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronLeft, BookOpen, GraduationCap, Calculator, FileText, Star, Sparkles } from 'lucide-react';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('level');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const levels = [
    { 
      id: 'primaria', 
      name: 'Primaria', 
      enabled: true,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      description: 'Fundamentos del aprendizaje'
    },
    { 
      id: 'secundaria', 
      name: 'Secundaria', 
      enabled: false,
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      description: 'Próximamente disponible'
    },
  ];

  const grades = [
    { id: '1ro', name: '1ro', enabled: false, progress: 0 },
    { id: '2do', name: '2do', enabled: false, progress: 0 },
    { id: '3ro', name: '3ro', enabled: true, progress: 75 },
    { id: '4to', name: '4to', enabled: false, progress: 0 },
    { id: '5to', name: '5to', enabled: false, progress: 0 },
    { id: '6to', name: '6to', enabled: false, progress: 0 },
  ];

  const subjects = [
    { 
      id: 'matematicas', 
      name: 'Matemáticas', 
      enabled: true,
      icon: Calculator,
      color: 'from-emerald-500 to-teal-500',
      lessons: 12,
      completed: 8
    },
    { 
      id: 'lenguaje', 
      name: 'Lenguaje', 
      enabled: false,
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      lessons: 10,
      completed: 0
    },
  ];

  const handleTransition = (callback) => {
    setIsLoading(true);
    setTimeout(() => {
      callback();
      setIsLoading(false);
    }, 300);
  };

  const handleLevelSelect = (levelId) => {
    if (levels.find(l => l.id === levelId)?.enabled) {
      handleTransition(() => {
        setSelectedLevel(levelId);
        setActiveSection('grade');
      });
    }
  };

  const handleGradeSelect = (gradeId) => {
    if (selectedLevel === 'primaria' && grades.find(g => g.id === gradeId)?.enabled) {
      handleTransition(() => {
        setSelectedGrade(gradeId);
        setActiveSection('subject');
      });
    }
  };

  const handleSubjectSelect = (subjectId) => {
    if (selectedLevel === 'primaria' && selectedGrade === '3ro' && subjects.find(s => s.id === subjectId)?.enabled) {
      // Simular navegación
      console.log(`Navegando a: /student/lessons?level=${selectedLevel}&grade=${selectedGrade}&subject=${subjectId}`);
    }
  };

  const goBack = () => {
    if (activeSection === 'grade') {
      handleTransition(() => setActiveSection('level'));
    } else if (activeSection === 'subject') {
      handleTransition(() => setActiveSection('grade'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        
        {/* Estrellas flotantes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Star className="w-4 h-4 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header con animación */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              ¡Hola Estudiante!
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
          <p className="text-purple-200 text-xl font-light">Descubre el mundo del conocimiento</p>
        </div>

        {/* Contenedor principal con transiciones */}
        <div className={`transition-all duration-500 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          
          {/* Sección de Niveles */}
          {activeSection === 'level' && (
            <div className="animate-slide-in">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Elige tu Nivel de Estudio</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {levels.map((level, index) => {
                  const IconComponent = level.icon;
                  return (
                    <div
                      key={level.id}
                      className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                        level.enabled ? 'animate-fade-in-up' : 'animate-fade-in-up opacity-60'
                      }`}
                      style={{ animationDelay: `${index * 200}ms` }}
                      onClick={() => handleLevelSelect(level.id)}
                    >
                      <div className={`relative bg-gradient-to-br ${level.color} p-8 rounded-3xl shadow-2xl overflow-hidden ${
                        !level.enabled ? 'grayscale cursor-not-allowed' : 'hover:shadow-3xl'
                      }`}>
                        {/* Efecto brillante */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
                        
                        <div className="relative z-10 text-center">
                          <IconComponent className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
                          <h3 className="text-2xl font-bold text-white mb-2">{level.name}</h3>
                          <p className="text-white/80 text-sm">{level.description}</p>
                          
                          {!level.enabled && (
                            <div className="absolute top-4 right-4">
                              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                                Próximamente
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Partículas decorativas */}
                        <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        <div className="absolute bottom-4 right-4 w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sección de Grados */}
          {activeSection === 'grade' && selectedLevel && (
            <div className="animate-slide-in">
              <div className="flex items-center justify-center mb-8">
                <button
                  onClick={goBack}
                  className="absolute left-0 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-white">
                  Grados de {selectedLevel === 'primaria' ? 'Primaria' : 'Secundaria'}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {grades.map((grade, index) => (
                  <div
                    key={grade.id}
                    className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                      grade.enabled ? 'animate-fade-in-up' : 'animate-fade-in-up opacity-50'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleGradeSelect(grade.id)}
                  >
                    <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 ${
                      !grade.enabled ? 'cursor-not-allowed' : 'hover:shadow-2xl'
                    }`}>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">{grade.name}</div>
                        {grade.enabled && (
                          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${grade.progress}%` }}
                            ></div>
                          </div>
                        )}
                        <div className="text-white/70 text-sm">
                          {grade.enabled ? `${grade.progress}% Completado` : 'Bloqueado'}
                        </div>
                      </div>
                      
                      {!grade.enabled && (
                        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                          <div className="text-white/60 text-xs font-bold">🔒</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sección de Materias */}
          {activeSection === 'subject' && selectedGrade && (
            <div className="animate-slide-in">
              <div className="flex items-center justify-center mb-8">
                <button
                  onClick={goBack}
                  className="absolute left-0 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-white">Materias de {selectedGrade}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {subjects.map((subject, index) => {
                  const IconComponent = subject.icon;
                  const completionPercentage = subject.enabled ? Math.round((subject.completed / subject.lessons) * 100) : 0;
                  
                  return (
                    <div
                      key={subject.id}
                      className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                        subject.enabled ? 'animate-fade-in-up' : 'animate-fade-in-up opacity-60'
                      }`}
                      style={{ animationDelay: `${index * 200}ms` }}
                      onClick={() => handleSubjectSelect(subject.id)}
                    >
                      <div className={`relative bg-gradient-to-br ${subject.color} p-8 rounded-3xl shadow-2xl overflow-hidden ${
                        !subject.enabled ? 'grayscale cursor-not-allowed' : 'hover:shadow-3xl'
                      }`}>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <IconComponent className="w-12 h-12 text-white animate-pulse" />
                            {!subject.enabled && (
                              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                                Próximamente
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-2xl font-bold text-white mb-2">{subject.name}</h3>
                          
                          {subject.enabled && (
                            <div className="space-y-3">
                              <div className="flex justify-between text-white/80 text-sm">
                                <span>{subject.completed}/{subject.lessons} lecciones</span>
                                <span>{completionPercentage}%</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-3">
                                <div 
                                  className="bg-white h-3 rounded-full transition-all duration-1000 animate-pulse"
                                  style={{ width: `${completionPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default StudentLevelSelection;