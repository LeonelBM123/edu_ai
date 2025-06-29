import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Star, Sparkles } from 'lucide-react';

const StudentLevelSelection = () => {
  const navigate = useNavigate();
  const levels = [
    {
      id: 'primaria',
      name: 'primaria',
      enabled: true,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      description: 'Fundamentos del aprendizaje',
      route: '/grades-primaria', 
    },
    {
      id: 'secundaria',
      name: 'secundaria',
      enabled: false,
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      description: 'Próximamente disponible',
      route: '/grades-secundaria', 
    },
  ];

  const handleLevelClick = (levelId) => {
    const selected = levels.find((l) => l.id === levelId);
    if (selected?.enabled && selected?.route) {
      navigate(selected.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Estrellas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Star className="w-4 h-4 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Encabezado */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              ¡Hola Estudiante!
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
          <p className="text-purple-200 text-xl font-light">Selecciona tu nivel de estudio</p>
        </div>

        {/* Niveles */}
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
                onClick={() => handleLevelClick(level.id)}
              >
                <div
                  className={`relative bg-gradient-to-br ${level.color} p-8 rounded-3xl shadow-2xl overflow-hidden ${
                    !level.enabled ? 'grayscale cursor-not-allowed' : 'hover:shadow-3xl'
                  }`}
                >
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
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estilos personalizados */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }

        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default StudentLevelSelection;