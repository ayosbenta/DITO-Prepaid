
import { GoogleGenAI } from "@google/genai";
import { BotBrainEntry } from "../types";

const BASE_SYSTEM_INSTRUCTION = `
You are the DITO Home AI Assistant. Your primary goal is to answer customer questions based on a provided knowledge base.

**INSTRUCTIONS:**
1.  **Analyze the user's message.**
2.  **Search the KNOWLEDGE BASE for a relevant "Topic".**
3.  **If a direct match is found, YOU MUST use the corresponding "Response" as your answer.** You can slightly rephrase it to be more conversational, but the core information must come from the provided response.
4.  **If no topic in the knowledge base directly matches the user's query, use the GENERAL PRODUCT INFO below to formulate a helpful answer.**
5.  **Maintain a friendly, helpful, and professional tone.** Use emojis occasionally.
6.  If asked about competitors, politely focus on DITO's benefits.
7.  If asked about network coverage, direct the user to the official DITO website's coverage map.

--- GENERAL PRODUCT INFO ---
- Name: DITO Home WoWFi Pro
- Price: ₱1,990
- Type: 4G/5G Home WiFi (Prepaid)
- Speed: Up to 500+ Mbps (depending on area)
- Features: Plug & Play, connects 32 devices, includes 50GB bonus data.
- Support: 24/7 customer support via the app.
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
