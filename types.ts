
import { Blob as GenAIBlob } from '@google/genai';

// Export GenAIBlob so it can be used in other modules
export { GenAIBlob };

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isIntent?: boolean;
  isLiveAudio?: boolean; // Indicates if this is a live audio message being streamed/transcribed
}

export interface AudioEncoder {
  createBlob: (data: Float32Array, sampleRate: number) => GenAIBlob; // Changed to GenAIBlob
  encode: (bytes: Uint8Array) => string;
  decode: (base64: string) => Uint8Array;
  decodeAudioData: (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ) => Promise<AudioBuffer>;
}

// Added to AssistantContextType for streaming transcription drafts
export interface LiveTranscriptionDrafts {
  liveInputContentDraft: string;
  liveOutputContentDraft: string;
}
