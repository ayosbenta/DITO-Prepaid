

import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { StoreContext } from '../contexts/StoreContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hi! 👋 I\'m your DITO AI Assistant. Ask me anything about our 4G/5G Home WiFi!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { botBrain, botKeywords, botPresets } = useContext(StoreContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handlePresetClick = (question: string, response: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: question };
    const modelMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: response };
    setMessages(prev => [...prev, userMessage, modelMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const lowerInput = input.toLowerCase().trim();
    setInput('');
    setIsLoading(true);

    // First, check for a keyword match for an instant response
    let keywordResponse: string | null = null;
    for (const trigger of botKeywords) {
      const keywords = trigger.keywords.toLowerCase().split(',').map(k => k.trim());
      if (keywords.some(k => lowerInput.includes(k))) {
        keywordResponse = trigger.response;
        break;
      }
    }

    if (keywordResponse) {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', text: keywordResponse }
      ]);
      setIsLoading(false);
      return;
    }

    // If no keyword match, proceed with Gemini AI using the bot brain
    try {
      // Format history for the API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await generateChatResponse(history, userMessage.text, botBrain);
      
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', text: responseText }
      ]);
    } catch (error) {
      console.error("Chat error", error);
       setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', text: "Sorry, I'm having a bit of trouble connecting right now." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in-up">
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">DITO AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-800 p-1 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                  <Loader2 className="animate-spin text-primary" size={18} />
                </div>
              </div>
            )}
            
            {/* Preset Buttons - shows only at the start of a conversation */}
            {messages.length === 1 && botPresets.length > 0 && (
                <div className="pt-2 animate-fade-in">
                <p className="text-xs font-bold text-gray-400 uppercase text-center mb-3">Quick Questions</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {botPresets.slice(0, 3).map(preset => ( // Show max 3 for clean UI
                    <button 
                        key={preset.id}
                        onClick={() => handlePresetClick(preset.question, preset.response)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                        {preset.question}
                    </button>
                    ))}
                </div>
                </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-primary text-white rounded-full hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-primary text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-300 group"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} className="animate-pulse" />}
      </button>
    </div>
  );
};

export default AIChatBot;