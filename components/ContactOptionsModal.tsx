
import React from 'react';
import { X, Bot, Mail, Phone, MessageCircle } from 'lucide-react';
import { useAssistant } from '../contexts/AssistantContext';

interface ContactOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactOptionsModal: React.FC<ContactOptionsModalProps> = ({ isOpen, onClose }) => {
  const { setIsOpen: setIsChatOpen } = useAssistant();

  if (!isOpen) return null;

  const handleOpenChat = () => {
    onClose(); // Close the modal
    setIsChatOpen(true); // Open the chatbot
  };

  const handleScrollToContactForm = () => {
    onClose(); // Close the modal
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // Small delay to ensure modal closes first
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/528771658515', '_blank');
    onClose(); // Close the modal
  };

  const callAcuña = () => {
    window.open('tel:+528771658515', '_self'); // Use _self to stay in the app or directly call
    onClose(); // Close the modal
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[101]"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full relative transform animate-in zoom-in-90 duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-red-700 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6 text-center">
          ¿Cómo prefieres contactarnos?
        </h3>
        <p className="text-slate-600 mb-8 text-center leading-relaxed">
          Elige la opción que mejor se adapte a tu necesidad para iniciar tu consulta legal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handleOpenChat}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20"
          >
            <Bot className="h-5 w-5" /> Hablar con LEXY
          </button>
          <button 
            onClick={handleScrollToContactForm}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
          >
            <Mail className="h-5 w-5" /> Enviar mensaje
          </button>
          <button 
            onClick={callAcuña}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <Phone className="h-5 w-5" /> Llamar a Acuña
          </button>
          <button 
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-900/20"
          >
            <MessageCircle className="h-5 w-5" /> Enviar WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactOptionsModal;