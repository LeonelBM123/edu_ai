import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Send, Bot, User } from 'lucide-react';

const Tema = () => {
  const { titulo } = useParams(); // 👈 Usamos correctamente el parámetro de la URL
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newChat = [...chat, { sender: 'user', text: input }];
    setChat(newChat);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8081/chatbot', {
        mensaje: input,
        titulo: decodeURIComponent(titulo), // por si tiene espacios o caracteres especiales
      });

      setChat([...newChat, { sender: 'bot', text: data.respuesta }]);
    } catch (error) {
      setChat([...newChat, { sender: 'bot', text: 'Hubo un error al obtener respuesta del bot.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-center">💬 Chat con tu IA - Tema: <span className="italic">{titulo}</span></h1>

      <div className="flex-1 overflow-y-auto bg-white/10 rounded-xl p-4 space-y-4 mb-4 backdrop-blur-sm border border-white/20 custom-scrollbar">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' ? (
              <div className="bg-blue-500/30 p-3 rounded-lg max-w-xs flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-200" />
                <span>{msg.text}</span>
              </div>
            ) : (
              <div className="bg-green-500/30 p-3 rounded-lg max-w-xs flex items-center gap-2">
                <span>{msg.text}</span>
                <User className="w-4 h-4 text-green-200" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-center text-white/70 animate-pulse">La IA está pensando...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Tema;
