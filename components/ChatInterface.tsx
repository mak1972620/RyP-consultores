
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, Loader2, Trash2, Info, Calendar, Bell, MessageCircle, AlertCircle, CheckCircle2, Mic, X, RotateCw } from 'lucide-react';
import { useAssistant } from '../contexts/AssistantContext';

interface ChatInterfaceProps {
  className?: string;
  showHeader?: boolean;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = "", showHeader = false, onClose }) => {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearHistory, 
    startLiveSession, 
    stopLiveSession, 
    isLiveSessionActive,
    isLiveSessionLoading,
    isLiveSessionPlaying,
    liveSessionError,
    liveInputContentDraft, // New: real-time input transcription
    liveOutputContentDraft, // New: real-time output transcription
  } = useAssistant();
  const [input, setInput] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Recording time for display, managed locally as context doesn't track it
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<number | null>(null);

  // Scroll to bottom on new messages or recording state change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isLiveSessionActive, isLiveSessionLoading, isLiveSessionPlaying, liveInputContentDraft, liveOutputContentDraft]);

  // Validation for phone number in chat input
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

  // Handle recording timer
  useEffect(() => {
    if (isLiveSessionActive && !recordingIntervalRef.current) {
      setRecordingTime(0); // Reset on new session start
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (!isLiveSessionActive && recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
      setRecordingTime(0);
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isLiveSessionActive]);


  const startRecordingHandler = useCallback(async () => {
    if (isLiveSessionActive || isLiveSessionLoading) return;
    await startLiveSession();
  }, [isLiveSessionActive, isLiveSessionLoading, startLiveSession]);

  const stopRecordingHandler = useCallback(() => {
    if (!isLiveSessionActive) return;
    stopLiveSession();
  }, [isLiveSessionActive, stopLiveSession]);

  const handleSend = () => {
    if (isLiveSessionActive || isLiveSessionLoading) {
      stopRecordingHandler(); // If active, send button acts as stop
      return;
    }
    if (!input.trim() || isLoading || !!phoneError) return;
    
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
    if (isLoading || isLiveSessionActive || isLiveSessionLoading) return;
    sendMessage(text, isIntent);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/528771658515', '_blank');
  };

  const isAnyLoading = isLoading || isLiveSessionLoading || isLiveSessionPlaying;

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {showHeader && (
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Asistente LEXY</h4> {/* Changed from "Asistente LEXY" */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isLiveSessionActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  {isLiveSessionActive ? 'En línea' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={openWhatsApp}
              className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors text-white shadow-lg"
              title="Contactar por WhatsApp"
              disabled={isAnyLoading}
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            {onClose && (
              <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg transition-colors text-white" disabled={isAnyLoading}>
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
            disabled={isAnyLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:text-red-600 hover:border-red-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3 w-3" />
            Limpiar
          </button>
          <button 
            onClick={() => handleQuickAction('¿Cuáles son sus áreas de práctica?')}
            disabled={isAnyLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Info className="h-3 w-3 text-red-600" />
            Servicios
          </button>
          <button 
            onClick={() => handleQuickAction('Me gustaría agendar una consulta.', true)}
            disabled={isAnyLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-[10px] font-bold text-red-700 hover:bg-red-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar className="h-3 w-3" />
            Cita
          </button>
          <button 
            onClick={openWhatsApp}
            disabled={isAnyLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-[10px] font-bold text-green-700 hover:bg-green-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Display real-time input transcription draft */}
        {isLiveSessionActive && liveInputContentDraft && (
          <div className="flex justify-end">
            <div className="flex gap-2 max-w-[85%] flex-row-reverse">
              <div className="p-2 rounded-lg h-fit relative bg-slate-200">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="p-3 rounded-2xl text-sm leading-relaxed relative bg-red-700 text-white rounded-tr-none shadow-md">
                {liveInputContentDraft}
              </div>
            </div>
          </div>
        )}

        {/* Display real-time output transcription draft */}
        {isLiveSessionActive && liveOutputContentDraft && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%] flex-row">
              <div className="p-2 rounded-lg h-fit relative bg-red-50">
                <Bot className="h-4 w-4 text-red-700" />
              </div>
              <div className="p-3 rounded-2xl text-sm leading-relaxed relative bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm">
                {liveOutputContentDraft}
              </div>
            </div>
          </div>
        )}

        {isLiveSessionLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <div className="p-2 rounded-lg bg-red-50">
                <Bot className="h-4 w-4 text-red-700" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-red-700" />
                <span className="text-xs text-slate-400 font-medium">Conectando conversación por voz...</span>
              </div>
            </div>
          </div>
        )}
        {(isLoading || isLiveSessionPlaying) && !isLiveSessionLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <div className="p-2 rounded-lg bg-red-50">
                <Bot className="h-4 w-4 text-red-700" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-red-700" />
                <span className="text-xs text-slate-400 font-medium">
                  {isLiveSessionPlaying ? 'Respondiendo con voz...' : 'Analizando caso...'}
                </span>
              </div>
            </div>
          </div>
        )}
        {liveSessionError && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-700" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-red-100 shadow-sm text-red-700 text-sm">
                {liveSessionError}
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
            disabled={isAnyLoading || isLiveSessionActive} // Disable input while live session is active or loading
          />
          {input.match(/\d{10}/) && !phoneError && (
             <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}

          {(isLiveSessionActive || isLiveSessionLoading) && (
            <div className={`flex items-center gap-2 text-sm text-red-500`}>
              <RotateCw className={`h-4 w-4 ${isLiveSessionActive ? 'animate-spin' : ''}`} />
              <span>{Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
          
          {isLiveSessionActive ? (
            <button 
              onClick={stopRecordingHandler}
              disabled={isLiveSessionLoading}
              className={`p-2 rounded-lg transition-all ${isLiveSessionLoading ? 'bg-slate-400 text-white' : 'bg-red-700 text-white shadow-md'}`}
              title="Detener grabación"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={startRecordingHandler}
              disabled={isAnyLoading}
              className={`p-2 rounded-lg transition-all ${isAnyLoading ? 'text-slate-300' : 'text-slate-500 hover:text-red-700'}`}
              title="Iniciar conversación por voz"
            >
              <Mic className="h-4 w-4" />
            </button>
          )}

          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !isLiveSessionActive) || isAnyLoading || !!phoneError}
            className={`p-2 rounded-lg transition-all ${
              ((!input.trim() && !isLiveSessionActive) || isAnyLoading || !!phoneError)
                ? 'text-slate-300'
                : 'bg-red-700 text-white shadow-md'
            }`}
            title="Enviar mensaje"
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

export default ChatInterface;