
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useAssistant } from '../contexts/AssistantContext';
import ChatInterface from './ChatInterface';

const Assistant: React.FC = () => {
  const { isOpen, setIsOpen } = useAssistant();

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Botón Flotante (FAB) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-700 hover:bg-red-800 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-90 flex items-center justify-center relative group"
        >
          <MessageSquare className="h-8 w-8" />
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            ¿Necesitas orientación legal?
          </span>
        </button>
      )}

      {/* Ventana de Chat Flotante */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-300">
          <ChatInterface 
            showHeader={true} 
            onClose={() => setIsOpen(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default Assistant;
