import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { getLegalGuidance, ai, audioEncoder, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { ChatMessage, LiveTranscriptionDrafts } from '../types';
import { Content, TextPart, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';

interface AssistantContextType extends LiveTranscriptionDrafts { // Extend with new draft states
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (input: string, isIntent?: boolean) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  clearHistory: () => void;
  lastIntent: string | null;
  startLiveSession: () => Promise<void>;
  stopLiveSession: () => void;
  isLiveSessionActive: boolean;
  isLiveSessionLoading: boolean;
  isLiveSessionPlaying: boolean;
  liveSessionError: string | null;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

const STORAGE_KEY = 'rp_abogados_chat_history';
const INTENT_KEY = 'rp_abogados_last_intent';

const INITIAL_MESSAGE: ChatMessage = { 
  role: 'assistant', 
  content: '¡Hola! Soy LEXY, tu asistente legal virtual. ¿Qué problema tienes? ¿O sobre qué materia es tu consulta?' 
};

export const AssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const loadedMessages: ChatMessage[] = saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
    return loadedMessages;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastIntent, setLastIntent] = useState<string | null>(() => {
    return localStorage.getItem(INTENT_KEY);
  });

  // Live Session states
  const liveSessionRef = useRef<any | null>(null); // GoogleGenAI.LiveSession
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);
  const [isLiveSessionLoading, setIsLiveSessionLoading] = useState(false);
  const [isLiveSessionPlaying, setIsLiveSessionPlaying] = useState(false);
  const [liveSessionError, setLiveSessionError] = useState<string | null>(null);

  // Audio capture for input (now managed in context)
  const inputMediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const inputScriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  // Audio playback for Live API responses
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Real-time transcription drafts
  const [liveInputContentDraft, setLiveInputContentDraft] = useState('');
  const [liveOutputContentDraft, setLiveOutputContentDraft] = useState('');

  useEffect(() => {
    const serializableMessages = messages.map(msg => {
      // Exclude isLiveAudio for serialization as it's a transient state for streaming
      const { isLiveAudio, ...rest } = msg; 
      return rest;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableMessages));
  }, [messages]);

  useEffect(() => {
    if (lastIntent) {
      localStorage.setItem(INTENT_KEY, lastIntent);
    } else {
      localStorage.removeItem(INTENT_KEY);
    }
  }, [lastIntent]);

  // Clean up live session on unmount
  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const startLiveSession = async () => {
    if (isLiveSessionActive || isLiveSessionLoading) return;

    setIsLiveSessionLoading(true);
    setLiveSessionError(null);
    setLiveInputContentDraft('');
    setLiveOutputContentDraft('');

    try {
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new AudioContext({sampleRate: 24000});
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputMediaStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: (session) => { // session object is provided here
            console.debug('Live session opened');
            setIsLiveSessionActive(true);
            setIsLiveSessionLoading(false);
            
            setMessages((prev) => [...prev, { role: 'user', content: '🎤 Grabando voz...', isLiveAudio: true }]);
            
            // Set up input audio processing *after* session is open
            inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            inputScriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            inputScriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob: GenAIBlob = audioEncoder.createBlob(inputData, inputAudioContextRef.current!.sampleRate);
              // CRITICAL: Call sendRealtimeInput directly on the resolved session object
              session.sendRealtimeInput({ media: pcmBlob });
            };

            source.connect(inputScriptProcessorRef.current);
            inputScriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            console.debug('Live message:', message);

            if (message.serverContent?.outputTranscription) {
              setLiveOutputContentDraft((prev) => prev + message.serverContent!.outputTranscription!.text);
            } else if (message.serverContent?.inputTranscription) {
              setLiveInputContentDraft((prev) => prev + message.serverContent!.inputTranscription!.text);
            }

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && outputAudioContextRef.current) {
              setIsLiveSessionPlaying(true);
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContextRef.current.currentTime,
              );
              const audioBuffer = await audioEncoder.decodeAudioData(
                audioEncoder.decode(base64EncodedAudioString),
                outputAudioContextRef.current,
                24000,
                1,
              );
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                  setIsLiveSessionPlaying(false);
                }
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.turnComplete) {
              console.debug('Turn complete');
              // Commit drafts to messages history
              setMessages((prev) => {
                const newMessages = [...prev];
                // Update the last user message with its full transcription
                // FIX: Replaced findLastIndex with a manual reverse loop for broader compatibility
                let lastUserMsgIndex = -1;
                for (let i = newMessages.length - 1; i >= 0; i--) {
                  if (newMessages[i].role === 'user' && newMessages[i].isLiveAudio) {
                    lastUserMsgIndex = i;
                    break;
                  }
                }

                if (lastUserMsgIndex !== -1 && liveInputContentDraft) {
                  newMessages[lastUserMsgIndex] = { ...newMessages[lastUserMsgIndex], content: liveInputContentDraft, isLiveAudio: false };
                }

                // Add assistant response if it exists
                if (liveOutputContentDraft) {
                  newMessages.push({ role: 'assistant', content: liveOutputContentDraft });
                }
                return newMessages;
              });
              setLiveInputContentDraft('');
              setLiveOutputContentDraft('');
              setIsLiveSessionPlaying(false);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              console.debug('Live session interrupted');
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
              setIsLiveSessionPlaying(false);
              setLiveOutputContentDraft('');
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Live session error:', e);
            setLiveSessionError('Error en la sesión de voz. Por favor, intenta de nuevo.');
            stopLiveSession();
          },
          onclose: (e: CloseEvent) => {
            console.debug('Live session closed:', e);
            // This is called when the session is gracefully closed or due to an error.
            // stopLiveSession will be called externally as well if needed.
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

      liveSessionRef.current = await sessionPromise;

    } catch (error) {
      console.error('Failed to start live session:', error);
      setLiveSessionError('No se pudo iniciar la conversación de voz. Asegúrate de los permisos del micrófono.');
      stopLiveSession();
    }
  };

  const stopLiveSession = () => {
    if (liveSessionRef.current) {
      console.debug('Closing live session...');
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    // Stop input microphone stream
    if (inputMediaStreamRef.current) {
      inputMediaStreamRef.current.getTracks().forEach(track => track.stop());
      inputMediaStreamRef.current = null;
    }
    if (inputScriptProcessorRef.current) {
      inputScriptProcessorRef.current.disconnect();
      inputScriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    // Stop any playing output audio
    for (const source of sourcesRef.current.values()) {
      source.stop();
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    setIsLiveSessionActive(false);
    setIsLiveSessionLoading(false);
    setIsLiveSessionPlaying(false);
    
    // Finalize user's last live audio message before clearing drafts
    setMessages((prev) => {
      const newMessages = [...prev];
      // FIX: Replaced findLastIndex with a manual reverse loop for broader compatibility
      let lastUserMsgIndex = -1;
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (newMessages[i].role === 'user' && newMessages[i].isLiveAudio) {
          lastUserMsgIndex = i;
          break;
        }
      }

      if (lastUserMsgIndex !== -1) {
        const finalContent = liveInputContentDraft || 'Mensaje de voz'; // Use draft or default
        newMessages[lastUserMsgIndex] = { ...newMessages[lastUserMsgIndex], content: finalContent, isLiveAudio: false };
      } else if (liveInputContentDraft) { // If there was a draft but no placeholder, add it
         newMessages.push({ role: 'user', content: liveInputContentDraft, isLiveAudio: false });
      }
      return newMessages;
    });

    setLiveInputContentDraft(''); // Clear after finalizing message
    setLiveOutputContentDraft(''); // Clear any pending output transcription

    setMessages((prev) => [...prev, { role: 'assistant', content: 'Conversación por voz finalizada.' }]);
  };


  const sendMessage = async (input: string, isIntent: boolean = false) => {
    if (isLiveSessionActive || isLiveSessionLoading || isLoading) {
      // If a live session is active or connecting, prevent sending text messages.
      return;
    }

    if (!input.trim()) return;

    const userMessageText = input.trim();
      
    const phoneMatch = userMessageText.match(/\b\d{10}\b/);
    const hasPhone = !!phoneMatch;
    
    const detectedIntent = isIntent || hasPhone || /consulta|agendar|cita|reunión/i.test(userMessageText);
    
    if (detectedIntent) {
      setLastIntent(hasPhone ? 'contact_info_provided' : 'appointment_request');
    }

    const newUserMessage: ChatMessage = { 
      role: 'user', 
      content: userMessageText, 
      isIntent: detectedIntent 
    };
    const userContentPart: TextPart = { text: userMessageText };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const historyForGemini: Content[] = messages.map(m => ({
        role: m.role, 
        parts: [{ text: m.content }] 
      }));

      const response = await getLegalGuidance(userContentPart, historyForGemini);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: "Lo siento, hubo un error técnico. Por favor, intenta de nuevo." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    stopLiveSession();
    const resetMessage: ChatMessage = { 
      role: 'assistant', 
      content: 'Historial reiniciado. ¿Cómo podemos ayudarte hoy?' 
    };
    setMessages([resetMessage]);
    setLastIntent(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INTENT_KEY);
  };

  return (
    <AssistantContext.Provider 
      value={{ 
        messages, 
        isLoading, 
        sendMessage, 
        isOpen, 
        setIsOpen, 
        clearHistory, 
        lastIntent,
        startLiveSession,
        stopLiveSession,
        isLiveSessionActive,
        isLiveSessionLoading,
        isLiveSessionPlaying,
        liveSessionError,
        liveInputContentDraft,
        liveOutputContentDraft,
      }}
    >
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