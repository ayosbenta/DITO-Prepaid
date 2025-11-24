
import { GoogleGenAI } from "@google/genai";
import { BotBrainEntry } from "../types";

const BASE_SYSTEM_INSTRUCTION = `
You are the DITO Home AI Assistant. You help customers with the DITO Home WoWFi Pro product.
Key Product Info:
- Name: DITO Home WoWFi Pro
- Price: ₱1,990
- Type: 4G/5G Home WiFi (Prepaid)
- Speed: Up to 500+ Mbps (depending on area)
- Features: Plug & Play, connects 32 devices, includes 50GB bonus data.
- Support: 24/7 customer support via the app.

Tone: Friendly, helpful, concise, and professional. Use emojis occasionally.
If asked about competitors, politely focus on DITO's benefits (speed, affordability).
If asked about coverage, suggest checking the DITO website coverage map.

Use the following knowledge base to answer specific questions. If the user's query doesn't match, use the general product info.
`;

export const generateChatResponse = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string,
  botBrain: BotBrainEntry[]
): Promise<string> => {
  try {
    // Dynamically construct the system instruction from the bot brain
    const knowledgeBase = botBrain.map(entry => `- Topic: "${entry.topic}"\n  - Response: "${entry.response}"`).join('\n');
    const fullSystemInstruction = `${BASE_SYSTEM_INSTRUCTION}\n--- KNOWLEDGE BASE ---\n${knowledgeBase}`;

    // Initialize Gemini API with key from environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = 'gemini-2.5-flash'; 
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.7,
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