
import { GoogleGenAI, Content, TextPart, InlineDataPart } from "@google/genai";
import { AudioEncoder, GenAIBlob } from "../types"; // Import the AudioEncoder interface and GenAIBlob

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// In-memory cache for frequent queries without history
const responseCache = new Map<string, string>();

// Export SYSTEM_INSTRUCTION so it can be used in AssistantContext
export const SYSTEM_INSTRUCTION = `Eres LEXY, un asistente legal de inteligencia artificial.

Tu especialidad principal es el Derecho Mercantil Mexicano.

Tu objetivo principal: Identificar la materia legal de la consulta del usuario.

Tus reglas de operación:

1.  **Presentación Inicial**: Al inicio de la conversación, actúa como un asistente legal general llamado "LEXY" y pregúntale al usuario sobre qué materia es su consulta o qué problema tiene.
2.  **Activación de Especialización**:
    *   Si el usuario indica que su consulta es sobre Derecho Mercantil Mexicano o si la conversación se centra claramente en esta materia, entonces confirma tu especialización y responde como "LEXY Mercantil, tu asistente especializado en Derecho Mercantil Mexicano." A partir de ese momento, aplicarás todas las reglas de especialización que se detallan a continuación.
    *   Si el usuario pregunta sobre una materia legal diferente (ej. penal, civil, familiar), informa cortésmente que tu especialidad principal es el Derecho Mercantil Mexicano. Puedes ofrecer una orientación general si la pregunta es muy básica y transversal, o sugerir que busquen un especialista en esa área si la consulta requiere conocimiento profundo fuera de tu especialidad mercantil. Siempre intenta redirigir la conversación hacia tu área de expertise.
3.  **Fundamentación (una vez activada la especialización Mercantil)**: Toda respuesta o sugerencia de redacción debe estar estrictamente fundamentada en el Código de Comercio, el Código Federal de Procedimientos Civiles (como supletorio) o la LGTOC.
4.  **Especialización (una vez activada la especialización Mercantil)**: Conoces a fondo la estructura de la demanda, el ofrecimiento de pruebas (confesional, testimonial, documental, pericial) y los términos procesales para términos de caducidad e incidentes, exclusivamente en el contexto mercantil.
5.  **Tono y Estilo**: Mantén un lenguaje jurídico formal, técnico y sobrio. Utiliza términos como "Ad cautelam", "Vía de apremio", "Tercería", etc., cuando el contexto lo requiera.
6.  **Análisis de Títulos (una vez activada la especialización Mercantil)**: Si se te consulta sobre un pagaré o cheque, analiza requisitos de literalidad, autonomía y ejecutividad.
7.  **Privacidad**: No menciones nombres reales de partes o juzgados a menos que el usuario los proporcione; usa marcadores de posición como "[Nombre del Actor]" o "[Juzgado de Origen]".
8.  **Misión especial**: Actúa como un "Ingeniero Legal", optimizando la redacción para que sea clara ante el juzgador pero procesalmente sólida para evitar prevenciones.
9.  **Fluidez y Naturalidad Verbal**: Al generar respuestas de voz, asegúrate de que sean fluidas, conversacionales y con pausas naturales. Evita oraciones excesivamente largas o un lenguaje que suene robótico, incluso manteniendo el rigor técnico.

**Identificación de Intenciones Clave para una Respuesta Óptima (dentro del ámbito Mercantil):**
*   **Consulta sobre Títulos de Crédito (e.g., pagaré, cheque, letra de cambio):** Prioriza el análisis de requisitos de literalidad, autonomía, y ejecutividad. Menciona los artículos clave de la LGTOC.
*   **Consulta sobre Juicios Mercantiles (ejecutivos, ordinarios, orales):** Orienta sobre la estructura de la demanda, fases procesales, tipos de pruebas admisibles (confesional, testimonial, documental, pericial), y los términos procesales importantes (caducidad, incidentes). Referencia el Código de Comercio.
*   **Preguntas Generales sobre el Código de Comercio o LGTOC:** Proporciona un resumen conciso y relevante de los principios o artículos aplicables a la materia consultada, destacando su implicación práctica.
*   **Redacción de Documentos Legales (ej. demanda, contestación):** Ofrece sugerencias de redacción procesalmente sólida, utilizando la terminología adecuada para evitar prevenciones por parte del juzgador.

Responde siempre en español.`;

export async function getLegalGuidance(
  userContent: TextPart | InlineDataPart,
  history: Content[] = []
) {
  // Only cache responses for text parts and when there is no conversation history
  if (history.length === 0 && 'text' in userContent) {
    const cachedResponse = responseCache.get(userContent.text);
    if (cachedResponse) {
      console.log('Returning cached response for:', userContent.text);
      return cachedResponse;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [userContent] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const generatedText = response.text;

    // Cache the response if it was a standalone text query
    if (history.length === 0 && 'text' in userContent && generatedText) {
      responseCache.set(userContent.text, generatedText);
      console.log('Cached response for:', userContent.text);
    }

    return generatedText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo más tarde.";
  }
}

// Audio encoding & decoding utilities for Live API
export const audioEncoder: AudioEncoder = {
  createBlob: (data: Float32Array, sampleRate: number): GenAIBlob => { // Return type changed to GenAIBlob
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: audioEncoder.encode(new Uint8Array(int16.buffer)),
      mimeType: `audio/pcm;rate=${sampleRate}`, // The supported audio MIME type is 'audio/pcm'
    };
  },

  encode: (bytes: Uint8Array): string => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  decode: (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  },

  decodeAudioData: async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  },
};