
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getLegalGuidance } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isIntent?: boolean;
}

interface AssistantContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, isIntent?: boolean) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  clearHistory: () => void;
  lastIntent: string | null;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

const STORAGE_KEY = 'rp_abogados_chat_history';
const INTENT_KEY = 'rp_abogados_last_intent';

const INITIAL_MESSAGE: Message = { 
  role: 'assistant', 
  content: '¡Hola! Soy el asistente virtual de R&P Abogados. ¿En qué situación legal te encuentras hoy? (Recuerda que esta orientación es informativa y no sustituye una consulta formal).' 
};

export const AssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [lastIntent, setLastIntent] = useState<string | null>(() => {
    return localStorage.getItem(INTENT_KEY);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (lastIntent) {
      localStorage.setItem(INTENT_KEY, lastIntent);
    } else {
      localStorage.removeItem(INTENT_KEY);
    }
  }, [lastIntent]);

  const sendMessage = async (content: string, isIntent: boolean = false) => {
    if (!content.trim() || isLoading) return;

    const userMessage = content.trim();
    
    // Validar si el mensaje contiene un número de teléfono de 10 dígitos
    const phoneMatch = userMessage.match(/\b\d{10}\b/);
    const hasPhone = !!phoneMatch;
    
    const detectedIntent = isIntent || hasPhone || /consulta|agendar|cita|reunión/i.test(userMessage);
    
    if (detectedIntent) {
      setLastIntent(hasPhone ? 'contact_info_provided' : 'appointment_request');
    }

    const newUserMessage: Message = { 
      role: 'user', 
      content: userMessage, 
      isIntent: detectedIntent 
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }]
      }));

      const response = await getLegalGuidance(userMessage, history);
      const assistantMessage: Message = { role: 'assistant', content: response };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "Lo siento, hubo un error técnico. Por favor, intenta de nuevo." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    const resetMessage: Message = { 
      role: 'assistant', 
      content: 'Historial reiniciado. ¿Cómo podemos ayudarte hoy?' 
    };
    setMessages([resetMessage]);
    setLastIntent(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INTENT_KEY);
  };

  return (
    <AssistantContext.Provider value={{ messages, isLoading, sendMessage, isOpen, setIsOpen, clearHistory, lastIntent }}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
