
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2, Info, Calendar, Bell, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAssistant } from '../contexts/AssistantContext';

interface ChatInterfaceProps {
  className?: string;
  showHeader?: boolean;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = "", showHeader = false, onClose }) => {
  const { messages, isLoading, sendMessage, clearHistory } = useAssistant();
  const [input, setInput] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Validación de teléfono en el input del chat
  useEffect(() => {
    const phoneMatch = input.match(/\d+/g)?.join('') || '';
    if (phoneMatch.length > 0 && phoneMatch.length < 10) {
      setPhoneError('Ingrese 10 dígitos para su contacto');
    } else if (phoneMatch.length > 10) {
      setPhoneError('Número demasiado largo');
    } else {
      setPhoneError(null);
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading || phoneError) return;
    
    const schedulingPhrases = [
      'agendar una consulta', 
      'solicitar cita', 
      'pedir reunión', 
      'agendar cita', 
      'solicitar consulta',
      'quiero una cita',
      'necesito una cita'
    ];
    
    const hasIntent = schedulingPhrases.some(phrase => 
      input.toLowerCase().includes(phrase.toLowerCase())
    );

    sendMessage(input, hasIntent);
    setInput('');
  };

  const handleQuickAction = (text: string, isIntent: boolean = false) => {
    if (isLoading) return;
    sendMessage(text, isIntent);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/528771658515', '_blank');
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {showHeader && (
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Asistente R&P</h4>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">En línea</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={openWhatsApp}
              className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors text-white shadow-lg"
              title="Contactar por WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            {onClose && (
              <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg transition-colors text-white">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {showHeader && (
        <div className="bg-slate-50 border-b border-slate-100 p-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2 shadow-inner">
          <button 
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
          >
            <Trash2 className="h-3 w-3" />
            Limpiar
          </button>
          <button 
            onClick={() => handleQuickAction('¿Cuáles son sus áreas de práctica?')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
          >
            <Info className="h-3 w-3 text-red-600" />
            Servicios
          </button>
          <button 
            onClick={() => handleQuickAction('Me gustaría agendar una consulta.', true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-[10px] font-bold text-red-700 hover:bg-red-100 transition-all shadow-sm"
          >
            <Calendar className="h-3 w-3" />
            Cita
          </button>
          <button 
            onClick={openWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-[10px] font-bold text-green-700 hover:bg-green-100 transition-all shadow-sm"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </button>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-lg h-fit relative ${msg.role === 'user' ? 'bg-slate-200' : 'bg-red-50'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4 text-slate-600" /> : <Bot className="h-4 w-4 text-red-700" />}
              </div>
              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-2xl text-sm leading-relaxed relative ${
                  msg.role === 'user' 
                    ? 'bg-red-700 text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                }`}>
                  {msg.content}
                  {msg.isIntent && msg.role === 'user' && (
                    <div className="absolute -top-2 -left-2 bg-amber-400 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 border border-white">
                      <Bell className="h-2 w-2" /> CITA
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <div className="p-2 rounded-lg bg-red-50">
                <Bot className="h-4 w-4 text-red-700" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-red-700" />
                <span className="text-xs text-slate-400 font-medium">Analizando caso...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {phoneError && (
          <div className="mb-2 flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase animate-bounce">
            <AlertCircle className="h-3 w-3" />
            {phoneError}
          </div>
        )}
        <div className={`flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1 border transition-colors ${phoneError ? 'border-red-500' : 'border-slate-200 focus-within:border-red-600'}`}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu consulta o teléfono..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-slate-700"
          />
          {input.match(/\d{10}/) && !phoneError && (
             <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !!phoneError}
            className={`p-2 rounded-lg transition-all ${
              input.trim() && !isLoading && !phoneError ? 'bg-red-700 text-white shadow-md' : 'text-slate-300'
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-[9px] text-slate-400">
            Orientación virtual 24/7.
          </p>
          <button onClick={openWhatsApp} className="text-[10px] text-green-600 font-bold flex items-center gap-1 hover:underline">
            <MessageCircle className="h-3 w-3" /> Ir a WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple X icon for close button
const X = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default ChatInterface;
