import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, BookOpen, User, GraduationCap, Loader } from 'lucide-react';
import { marked } from 'marked';
import axios from 'axios'; // Asegúrate de tener axios instalado

// URL de tu webhook de n8n
const BOT_API_URL = 'https://leonelbm123.app.n8n.cloud/webhook/88c9920c-a0ba-4d6f-bd01-1d05822de639/chat';
const SESSION_ID = '4ba5b130fc0644ad98ec905cb1c672d3'; // sessionId fijo

const TemaView = () => {
    const navigate = useNavigate();
    const { id_tema } = useParams();

    const [chatContext, setChatContext] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Función para llamar a la API del bot
    const callChatbotAPI = async (message) => {
        try {
            // Aquí estaba mal armado el axios.post (no es fetch), lo corregí:
            const response = await axios.post(BOT_API_URL, {
                sessionId: SESSION_ID,
                action: 'sendMessage',
                chatInput: message
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            // Ajusta la respuesta si cambia la estructura
            return response.data.output || response.data.text || "No he podido procesar esa respuesta.";

        } catch (error) {
            console.error("Error al contactar al bot:", error);
            return "Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta de nuevo más tarde.";
        }
    };

    useEffect(() => {
        const storedContext = JSON.parse(sessionStorage.getItem('chatContext'));

        if (storedContext && storedContext.tema.id_tema.toString() === id_tema) {
            setChatContext(storedContext);

            const sendInitialPrompt = async () => {
                setIsTyping(true);

                const { studentName, courseName, subjectName, tema } = storedContext;
                const initialPrompt = `Hola, me llamo ${studentName}, estoy en el curso ${courseName}, aprendo la materia ${subjectName} y quiero aprender sobre el tema ${tema.titulo}`;

                const botResponse = await callChatbotAPI(initialPrompt);

                const initialMessage = {
                    id: 1,
                    author: 'ai',
                    text: botResponse
                };
                setMessages([initialMessage]);
                setIsTyping(false);
            };

            sendInitialPrompt();

        } else {
            console.error("No se encontraron datos de contexto. Redirigiendo...");
            navigate('/dashboard/student');
        }
    }, [id_tema, navigate]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isTyping) return;

        const userMessageText = userInput;
        const userMessage = { id: Date.now(), author: 'user', text: userMessageText };

        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsTyping(true);

        const botResponse = await callChatbotAPI(userMessageText);

        const aiMessage = { id: Date.now() + 1, author: 'ai', text: botResponse };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
    };

    if (!chatContext || (messages.length === 0 && isTyping)) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center">
                <div className="relative mb-6">
                    <Loader className="w-12 h-12 text-white animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-2 border-blue-400/30 rounded-full animate-ping"></div>
                </div>
                <p className="text-white text-lg">Iniciando asistente...</p>
            </div>
        );
    }

    const { studentName, courseName, subjectName, tema } = chatContext;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans text-white flex flex-col">
            <header className="bg-slate-800/50 backdrop-blur-sm p-4 flex items-center gap-4 sticky top-0 z-20 border-b border-white/10">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div className='flex-grow min-w-0'>
                    <h1 className="font-bold text-lg truncate" title={tema.titulo}>{tema.titulo}</h1>
                    <div className="flex items-center gap-4 text-xs text-white/60 overflow-x-auto custom-scrollbar-hidden">
                        <span className='flex items-center gap-1.5 flex-shrink-0'><User className='w-3 h-3' /> {studentName}</span>
                        <span className='flex items-center gap-1.5 flex-shrink-0'><GraduationCap className='w-3 h-3' /> {courseName}</span>
                        <span className='flex items-center gap-1.5 flex-shrink-0'><Sparkles className='w-3 h-3' /> {subjectName}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map(message => (
                        <div key={message.id} className={`flex gap-3 ${message.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.author === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center self-end">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-xl p-4 rounded-2xl break-words ${message.author === 'user'
                                    ? 'bg-blue-600 rounded-br-none'
                                    : 'bg-slate-700/80 rounded-bl-none'
                                    }`}
                            >
                                <div
                                    className="prose prose-invert prose-p:my-2 prose-headings:my-3"
                                    dangerouslySetInnerHTML={{ __html: marked(message.text) }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center self-end">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="max-w-xl p-4 rounded-2xl bg-slate-700/80 rounded-bl-none flex items-center gap-2">
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

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