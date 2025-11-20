import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// IMPORTANT: In a real production app, API calls should often be proxied through a backend
// to protect the API key. For this demo, we use the process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the DITO Home AI Assistant. You help customers with the DITO Home WoWFi Pro product.
Key Product Info:
- Name: DITO Home WoWFi Pro
- Price: ₱1,990
- Type: 5G Home WiFi (Prepaid)
- Speed: Up to 500+ Mbps (depending on area)
- Features: Plug & Play, connects 32 devices, includes 50GB bonus data.
- Support: 24/7 customer support via the app.

Tone: Friendly, helpful, concise, and professional. Use emojis occasionally.
If asked about competitors, politely focus on DITO's benefits (speed, affordability).
If asked about coverage, suggest checking the DITO website coverage map.
`;

export const generateChatResponse = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    // Map our simple history format to the SDK's format if needed, 
    // but for a simple chat turn, we can just use the chat session.
    
    const model = 'gemini-2.5-flash'; 
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 300, 
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the network right now. Please try again later.";
  }
};