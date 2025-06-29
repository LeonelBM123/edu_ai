import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, BookOpen } from 'lucide-react';
import { marked } from 'marked'; // Para renderizar el texto de la IA como Markdown

// --- SIMULADOR DE IA ---
// Esta función genera la explicación inicial del tema.
const generateInitialExplanation = (tema) => {
    // En una aplicación real, podrías tener resúmenes y ejemplos predefinidos en tu base de datos.
    const resumen = tema.resumen || `Aquí va un resumen detallado sobre **${tema.titulo}**. El objetivo es entender los conceptos fundamentales de una manera clara y sencilla.`;
    const ejemplo = tema.ejemplo || `Para que quede más claro, imagina el siguiente escenario: [Aquí iría un ejemplo práctico relacionado con ${tema.titulo}].`;

    return `¡Hola! 👋 Vamos a explorar juntos el **Tema ${tema.nro_tema}: ${tema.titulo}**.
\n\n### Resumen del Tema
${resumen}
\n\n### Ejemplo Práctico
${ejemplo}
\n\n---
\nAhora es tu turno. Si algo no quedó claro, tienes alguna duda o simplemente quieres otro ejemplo, ¡escribe tu pregunta aquí abajo! También puedes pedirme que te plantee algunos ejercicios para practicar. 😊`;
};

// Esta función simula las respuestas de la IA a las preguntas del estudiante.
const generateAiResponse = (userMessage, tema) => {
    const message = userMessage.toLowerCase();

    if (message.includes('ejercicio') || message.includes('practicar') || message.includes('problema')) {
        const ejercicio = tema.ejercicio_propuesto || `Define en tus propias palabras qué es el concepto más importante de "${tema.titulo}".`;
        return `¡Excelente idea! La práctica hace al maestro. Aquí tienes un ejercicio:
\n\n**Desafío:**
> ${ejercicio}
\n\n_Tómate tu tiempo para resolverlo. Cuando estés listo, puedes compartir tu respuesta o preguntarme si tienes dificultades._`;
    }
    if (message.includes('pregunta') || message.includes('duda') || message.includes('entiendo')) {
        const reexplicacion = tema.reexplicacion || `Lo más importante a recordar sobre **${tema.titulo}** es [aquí iría una re-explicación simplificada del concepto clave].`;
        return `¡Claro que sí! Es normal tener dudas.
\n${reexplicacion}
\n\n¿Esta explicación te ayuda un poco más o te gustaría que lo intente con otro ejemplo?`;
    }
    if (message.includes('gracias') || message.includes('agradezco')) {
        return '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte? ¿Quizás un ejercicio para afianzar lo aprendido?';
    }
    if (message.includes('hola') || message.includes('saludos')) {
        return '¡Hola de nuevo! ¿Listo para seguir aprendiendo?';
    }

    // Respuesta por defecto
    return `Es un punto interesante. Respecto a lo que mencionas, en el contexto de **${tema.titulo}**, es crucial considerar que... [Aquí iría una respuesta genérica elaborada].
\n\n¿Hay algo más específico sobre esto que te gustaría saber?`;
};


const TemaView = () => {
    const navigate = useNavigate();
    const { id_tema } = useParams();
    const [tema, setTema] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        // Obtenemos el tema desde sessionStorage, como lo guardaste en el dashboard.
        const storedTema = JSON.parse(sessionStorage.getItem('temaSeleccionado'));
        
        // Verificamos que el tema guardado coincida con el de la URL para evitar inconsistencias.
        if (storedTema && storedTema.id_tema.toString() === id_tema) {
            setTema(storedTema);
            const initialMessage = {
                id: 1,
                author: 'ai',
                text: generateInitialExplanation(storedTema)
            };
            setMessages([initialMessage]);
        } else {
            // Si no hay datos (ej. el usuario recarga la página o entra por URL directa),
            // lo ideal sería hacer un fetch a la API para obtener los datos del tema.
            // Por ahora, lo regresamos al dashboard.
            console.error("No se encontraron datos del tema. Redirigiendo...");
            navigate('/dashboard-estudiante'); // Asegúrate que esta ruta sea la correcta.
        }
    }, [id_tema, navigate]);

    useEffect(() => {
        // Efecto para hacer scroll automático al final del chat cuando llega un mensaje nuevo.
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!userInput.trim() || isTyping) return;

        const userMessage = { id: Date.now(), author: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsTyping(true);

        // Simular el tiempo de respuesta de la IA
        setTimeout(() => {
            const aiResponseText = generateAiResponse(userInput, tema);
            const aiMessage = { id: Date.now() + 1, author: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500 + Math.random() * 800);
    };

    if (!tema) {
        // Pantalla de carga mientras se validan los datos.
        return <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center">Cargando tema...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans text-white flex flex-col">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-sm p-4 flex items-center gap-4 sticky top-0 z-20 border-b border-white/10">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6"/>
                </div>
                <div>
                    <h1 className="font-bold text-lg">{tema.titulo}</h1>
                    <p className="text-sm text-white/70">Tema {tema.nro_tema}</p>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map(message => (
                        <div key={message.id} className={`flex gap-3 ${message.author === 'user' ? 'justify-end' : ''}`}>
                            {message.author === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-xl p-4 rounded-2xl ${message.author === 'user'
                                    ? 'bg-blue-600 rounded-br-none'
                                    : 'bg-slate-700/80 rounded-bl-none'
                                }`}
                            >
                                {/* Usamos `marked` para interpretar el texto como Markdown (negritas, listas, etc.) */}
                                <div
                                    className="prose prose-invert prose-p:my-2 prose-headings:my-3"
                                    dangerouslySetInnerHTML={{ __html: marked(message.text) }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                         <div className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                                 <Sparkles className="w-4 h-4 text-white" />
                             </div>
                             <div className="max-w-xl p-4 rounded-2xl bg-slate-700/80 rounded-bl-none flex items-center gap-2">
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                             </div>
                         </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

            {/* Input Form */}
            <footer className="sticky bottom-0 p-4 bg-slate-900/50 backdrop-blur-sm border-t border-white/10 z-10">
                <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        className="flex-1 w-full bg-slate-700/80 border-none rounded-full px-5 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 transition-all"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!userInput.trim() || isTyping}
                        className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default TemaView;