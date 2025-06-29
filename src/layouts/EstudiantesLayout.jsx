import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, fetchSubjectsForCourse, fetchSyllabusForSubject, fetchCurrentUserData } from './api'; // Asegúrate de que la ruta sea correcta
import {
    BookOpen, GraduationCap, Calculator, FileText, Music, Microscope, Target, Sparkles, Home,
    ChevronRight, ChevronDown, Play, Circle, Loader, MessageSquare
} from 'lucide-react';
import { Bot } from 'lucide-react';


// Función para obtener un icono basado en el nombre de la materia
const getIconForSubject = (subjectName) => {
    const name = subjectName.toLowerCase();
    if (name.includes('matemática')) return Calculator;
    if (name.includes('lenguaje') || name.includes('comunicación')) return FileText;
    if (name.includes('ciencia')) return Microscope;
    if (name.includes('música')) return Music;
    return BookOpen; // Ícono por defecto
};


// Función para crear elementos flotantes de fondo
const createFloatingElement = (index, ElementComponent, colors) => (
    <ElementComponent
        key={index}
        className={`absolute rounded-full ${colors[index % colors.length]} animate-gentle-float`}
        style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            width: `${10 + Math.random() * 30}px`,
            height: `${10 + Math.random() * 30}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
        }}
    />
);

const StudentDashboard = () => {
    const navigate = useNavigate();

    const [mounted, setMounted] = useState(false);
    const [studentInfo, setStudentInfo] = useState(null);
    const [courses, setCourses] = useState([]);
    const [currentSubjects, setCurrentSubjects] = useState([]);
    const [syllabus, setSyllabus] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);

    // --- Estados para el Chatbot ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatMessagesEndRef = useRef(null); // Ref para scroll automático


    useEffect(() => {
        setMounted(true);
        const loadInitialData = async () => {
            setIsLoading(true);
            const [coursesData, userData] = await Promise.all([
                fetchCourses(),
                fetchCurrentUserData()
            ]);

            setCourses(coursesData);
            setStudentInfo(userData);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (chatMessagesEndRef.current) {
            chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    const handleCourseClick = async (courseId) => {
        if (selectedCourseId === courseId) {
            setSelectedCourseId(null);
            setCurrentSubjects([]);
            setSelectedSubject(null);
            return;
        }

        setSelectedCourseId(courseId);
        setSelectedSubject(null);
        setIsLoadingSubjects(true);
        setCurrentSubjects([]);

        const subjectsData = await fetchSubjectsForCourse(courseId);
        setCurrentSubjects(subjectsData);
        setIsLoadingSubjects(false);
    };

    const handleSubjectClick = async (subject) => {
        if (!selectedCourseId) return; // Asegura que haya un curso seleccionado

        setIsLoadingSyllabus(true);
        setSelectedSubject(subject);
        setSyllabus([]);

        const syllabusData = await fetchSyllabusForSubject(subject.id_materia, selectedCourseId);
        setSyllabus(syllabusData);
        setIsLoadingSyllabus(false);
    };

    // --- Funciones del Chatbot ---
    const handleSendChatMessage = async (e) => {
        e.preventDefault();
        if (chatInput.trim() === '') return;

        const newUserMessage = { sender: 'user', text: chatInput };
        setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            // Construir el contexto para el chatbot
            let context = "";
            if (selectedCourseId) {
                const currentCourse = courses.find(c => c.id_curso === selectedCourseId);
                if (currentCourse) {
                    context += `El estudiante está en el curso: ${currentCourse.nombre}. `;
                }
            }
            if (selectedSubject) {
                context += `Actualmente viendo la materia: ${selectedSubject.nombre} - ${selectedSubject.descripcion}. `;
            }
            if (syllabus.length > 0) {
                context += `Los temas de la materia son: ${syllabus.map(t => `${t.nro_tema}. ${t.titulo}`).join(', ')}. `;
            }

            // Realizar la llamada al backend para obtener la respuesta del chatbot
            // ASUME UN ENDPOINT DE BACKEND EN '/api/chat'
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: chatInput,
                    context: context // Envía el contexto
                }),
            });

            if (!response.ok) {
                throw new Error('Error al conectar con el chatbot');
            }

            const data = await response.json();
            const botMessage = { sender: 'bot', text: data.reply || "Lo siento, no pude procesar tu solicitud en este momento." };
            setChatMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
            console.error('Error al enviar mensaje al chatbot:', error);
            setChatMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: "Hubo un error al comunicarse con el asistente. Intenta de nuevo más tarde." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // --- Componente CourseCard (Estilizado con v2) ---
    const CourseCard = ({ course, index }) => {
        const isSelected = selectedCourseId === course.id_curso;
        const cardColors = [
            'from-blue-500 to-indigo-600',
            'from-purple-500 to-pink-600',
            'from-green-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-cyan-500 to-blue-600',
        ];
        const subjectColors = [
            'bg-red-400/80', 'bg-blue-400/80', 'bg-green-400/80',
            'bg-yellow-400/80', 'bg-purple-400/80'
        ];

        return (
            <div className={`bg-gradient-to-r ${cardColors[index % cardColors.length]} rounded-xl shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-xl ${isSelected ? 'ring-2 ring-white/50 scale-102' : ''} relative overflow-hidden`}>
                {/* Efecto sutil de brillo */}
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] animate-subtle-shine"></div>

                <div className="p-5 cursor-pointer flex justify-between items-center relative z-10" onClick={() => handleCourseClick(course.id_curso)}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{course.nombre}</h3>
                            <p className="text-white/80 text-sm">{course.descripcion}</p>
                        </div>
                    </div>
                    <div className="bg-white/20 rounded-full p-2 transition-transform duration-200">
                        {isSelected ?
                            <ChevronDown className="w-5 h-5 text-white" /> :
                            <ChevronRight className="w-5 h-5 text-white" />
                        }
                    </div>
                </div>

                {isSelected && (
                    <div className="px-5 pb-5 animate-expand">
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 mt-2">
                            <h4 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Materias
                            </h4>
                            {isLoadingSubjects ? (
                                <div className="flex justify-center items-center py-6">
                                    <div className="relative">
                                        <Loader className="w-6 h-6 text-white animate-spin" />
                                        <div className="absolute inset-0 w-6 h-6 border-2 border-white/30 rounded-full animate-ping"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {currentSubjects.length > 0 ? currentSubjects.map((subject, subIndex) => {
                                        const SubjectIcon = getIconForSubject(subject.nombre);
                                        return (
                                            <div
                                                key={subject.id_materia}
                                                onClick={() => handleSubjectClick(subject)}
                                                className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer transition-all duration-200 hover:scale-102 group"
                                            >
                                                <div className={`w-8 h-8 ${subjectColors[subIndex % subjectColors.length]} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                    <SubjectIcon className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-white font-medium">{subject.nombre}</span>
                                                    <p className="text-white/70 text-sm">{subject.descripcion}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                            </div>
                                        )
                                    }) :
                                        <div className="text-center py-6">
                                            <BookOpen className="w-8 h-8 text-white/50 mx-auto mb-2" />
                                            <p className="text-white/70">No hay materias disponibles</p>
                                        </div>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // --- Componente SubjectDetailsPanel (Estilizado con v2) ---
    const SubjectDetailsPanel = () => {
        if (!selectedSubject) {
            return (
                <div className="bg-gradient-to-br from-slate-600/40 to-slate-800/40 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col justify-center items-center text-center border border-white/20">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 animate-gentle-pulse">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Explora las Materias</h3>
                    <p className="text-white/70 text-lg">Selecciona una materia para ver su contenido</p>
                </div>
            );
        }

        const IconComponent = getIconForSubject(selectedSubject.nombre);

        return (
            <div className="bg-gradient-to-br from-slate-600/40 to-slate-800/40 backdrop-blur-sm rounded-xl p-6 h-full animate-slide-in border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{selectedSubject.nombre}</h3>
                        <p className="text-white/70">{selectedSubject.descripcion}</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Temas del Curso
                    </h4>

                    {isLoadingSyllabus ? (
                        <div className="flex flex-col items-center justify-center h-40">
                            <div className="relative mb-4">
                                <Loader className="w-8 h-8 text-white animate-spin" />
                                <div className="absolute inset-0 w-8 h-8 border-2 border-blue-400/30 rounded-full animate-ping"></div>
                            </div>
                            <p className="text-white/70">Cargando contenido...</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {syllabus.length > 0 ? syllabus.map((tema, index) => {
                                const icons = ['🎯', '📚', '🔍', '🏆', '💡', '⭐'];
                                const bgColors = [
                                    'bg-gradient-to-r from-blue-500/80 to-cyan-500/80',
                                    'bg-gradient-to-r from-purple-500/80 to-pink-500/80',
                                    'bg-gradient-to-r from-green-500/80 to-emerald-500/80',
                                    'bg-gradient-to-r from-orange-500/80 to-red-500/80'
                                ];

                                return (
                                  
                                    <div
                                      key={tema.id_tema}
                                      onClick={() => {
                          

                                          // 1. Encontrar el nombre del curso actual.
                                          const selectedCourse = courses.find(c => c.id_curso === selectedCourseId);

                                          // 2. Crear el objeto de contexto con toda la información.
                                          const chatContext = {
                                              studentName: studentInfo?.nombre || 'Estudiante',
                                              courseName: selectedCourse?.nombre || 'Curso Desconocido',
                                              subjectName: selectedSubject?.nombre || 'Materia Desconocida',
                                              tema: tema // Aquí incluimos el objeto completo del tema
                                          };

                                          // 3. Guardar el objeto de contexto completo en sessionStorage.
                                          sessionStorage.setItem('chatContext', JSON.stringify(chatContext));
                                          
                                          // 4. Navegar a la vista del tema.
                                          
                                          navigate(`/dashboard/student/tema/${tema.id_tema}`);
                                          
                                        
                                      }}
                                      className={`flex items-center gap-4 p-4 ${bgColors[index % bgColors.length]} rounded-lg shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-200 group cursor-pointer`}
                                  >
                                     
                                        <div className="flex-1">
                                            <span className="text-white font-semibold">
                                                Tema {tema.nro_tema}: {tema.titulo}
                                            </span>
                                        </div>
                                        <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 hover:scale-110">
                                            <Play className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            }) :
                                <div className="text-center py-8">
                                    <Circle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                                    <p className="text-white/70">No hay temas disponibles</p>
                                </div>}
                        </div>
                    )}
                    <Outlet />
                </div>
                
            </div>
            
        );
    };

    // Colores para los elementos flotantes de fondo
    const floatingElementColors = [
        'bg-blue-500/10', 'bg-purple-500/10', 'bg-pink-500/10', 'bg-green-500/10', 'bg-yellow-500/10'
    ];


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden font-sans">
            {/* Fondo animado más sutil */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Elementos flotantes sutiles */}
                {[...Array(12)].map((_, i) => createFloatingElement(i, 'div', floatingElementColors))}

                {/* Formas geométricas suaves */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-gentle-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl animate-gentle-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className={`relative z-10 min-h-screen p-6 transition-all duration-1000 ${mounted ? 'opacity-100 transform-none' : 'opacity-0 transform scale-95'}`}>
                <div className="max-w-7xl mx-auto">
                    <header className="text-center mb-12 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                            ¡Hola, {studentInfo ? studentInfo.nombre : 'Estudiante'}!
                        </h1>
                        <p className="text-blue-200 text-xl">Tu centro de aprendizaje personalizado</p>
                        <div className="flex justify-center gap-2 mt-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-gentle-bounce" style={{ animationDelay: `${i * 0.3}s` }}></div>
                            ))}
                        </div>
                    </header>

                    <main className="grid lg:grid-cols-2 gap-8 items-start">
                        {isLoading ? (
                            <div className="lg:col-span-2 flex flex-col justify-center items-center h-64">
                                <div className="relative mb-6">
                                    <Loader className="w-12 h-12 text-white animate-spin" />
                                    <div className="absolute inset-0 w-12 h-12 border-2 border-blue-400/30 rounded-full animate-ping"></div>
                                </div>
                                <p className="text-white text-lg">Cargando tu dashboard...</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-5">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <GraduationCap className="text-blue-400" />
                                        Cursos de Primaria
                                    </h2>
                                    {courses.map((course, index) => (
                                        <div key={course.id_curso} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                            <CourseCard course={course} index={index} />
                                        </div>
                                    ))}
                                </div>

                                <div className="lg:sticky top-6">
                                    <SubjectDetailsPanel />
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Botón flotante para el Chatbot */}
            <button onClick={() => setIsChatOpen(!isChatOpen)} 
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
                aria-label="Abrir Chatbot">
                <Bot className="w-6 h-6" />
            </button>

            {/* Ventana del Chatbot */}
            {isChatOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-[450px] bg-slate-800/95 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col z-50 border border-blue-500/30 animate-slide-in-right">
                    <div className="flex justify-between items-center p-4 bg-blue-600 rounded-t-xl">
                        <h3 className="text-lg font-bold text-white">Asistente Académico</h3>
                        <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-blue-200">
                            &times;
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                        {chatMessages.length === 0 && (
                            <div className="text-center text-white/70 mt-10">
                                <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                                <p>¡Hola! Pregúntame sobre tus cursos y materias.</p>
                            </div>
                        )}
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] p-3 rounded-lg text-white ${
                                    msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[70%] p-3 rounded-lg bg-gray-700">
                                    <Loader className="w-5 h-5 text-white animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={chatMessagesEndRef} /> {/* Elemento para scroll */}
                    </div>
                    <form onSubmit={handleSendChatMessage} className="p-4 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            className="flex-1 p-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isChatLoading}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                            disabled={isChatLoading}
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}


            {/* Estilos personalizados para animaciones y scrollbar */}
            <style jsx>{`
                @keyframes gentle-float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(2deg); }
                }
                @keyframes gentle-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.02); opacity: 1; }
                }
                @keyframes gentle-bounce {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes subtle-shine {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
                @keyframes expand {
                    from { opacity: 0; transform: scaleY(0); transform-origin: top; }
                    to { opacity: 1; transform: scaleY(1); transform-origin: top; }
                }
                @keyframes slide-in {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ping { /* Necesario para el efecto de ping en loaders */
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
                @keyframes spin { /* Necesario para el efecto de giro en loaders */
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-gentle-float { animation: gentle-float 5s ease-in-out infinite; }
                .animate-gentle-pulse { animation: gentle-pulse 3s ease-in-out infinite; }
                .animate-gentle-bounce { animation: gentle-bounce 2s ease-in-out infinite; }
                .animate-subtle-shine { animation: subtle-shine 3s infinite; }
                .animate-expand { animation: expand 0.3s ease-out; }
                .animate-slide-in { animation: slide-in 0.4s ease-out; }
                .animate-slide-in-up { animation: slide-in-up 0.5s ease-out both; }
                .animate-fade-in { animation: fade-in 0.8s ease-out; }
                .animate-spin { animation: spin 1s linear infinite; }
                .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }

                .hover\\:scale-102:hover { transform: scale(1.02); }

                /* Estilos para el scrollbar personalizado */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
            `}</style>
        </div>
    );
};

export default StudentDashboard;