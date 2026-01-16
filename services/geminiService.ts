
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `Eres el asistente virtual de R&P Abogados (Lexmarcorp), con presencia en Monclova y Ciudad Acuña, Coahuila. 
Tu objetivo es orientar a los usuarios de manera profesional, empática y seria.

Información del Despacho:
- Especialidad: Derecho Penal Estratégico, Consultoría Penal, Asesoría a Víctimas, Civil y Familiar.
- Socios Directores: Lic. Abraham Rodríguez (Ex Juez Penal) y Lic. Marco Antonio Perales Perchez.
- Ubicación y Contacto:
  * Ciudad Acuña: 877 165 85 15 (Teléfono y WhatsApp).
  * Lic. Abraham Rodríguez: +52 844 213 3129.
  * Sitio Web: https://lexmarcorp.webnode.es

Reglas de Interacción:
1. No proporciones asesoría legal definitiva. Aclara que la información es orientativa y deben agendar una consulta formal.
2. Resalta la experiencia judicial del Lic. Abraham Rodríguez (Ex Juez Penal) en casos penales.
3. Sé breve y profesional.
4. Invita siempre a agendar una cita o contactar por WhatsApp al detectar un problema legal real.
5. El tono debe ser formal pero accesible.

Responde siempre en español.`;

export async function getLegalGuidance(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un error al procesar tu consulta. Por favor, comunícate directamente con nosotros a los teléfonos de Ciudad Acuña o Monclova.";
  }
}
