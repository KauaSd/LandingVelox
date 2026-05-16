import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { askCoPilot } from '../services/geminiService';
import { Send, Sparkles, User, Terminal, Loader2, Compass, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  isTyping?: boolean;
  richCard?: ReactNode;
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15); // ms per char
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

interface AiCopilotProps {
  currentFlightContext?: string;
}

export default function AiCopilot({ currentFlightContext }: AiCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'copilot',
      text: "### **AERO_CORE FLIGHT PILOT CO-PILOT ASSISTANT** \nSystem Status: **ONLINE**\n\nWelcome back. I am your fully synthesized co-pilot dispatch helper. Query me regarding **flight parameters**, **terminal maps**, **luggage rules**, or **North Atlantic weather patterns**.",
      timestamp: '15:09 Z'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when content changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Z'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputValue('');
    setIsLoading(true);

    try {
      const gptResponse = await askCoPilot(textToSend, currentFlightContext);
      let richCard: ReactNode = undefined;
      
      // Simulated Rich Card generation based on intent analysis
      if (textToSend.toLowerCase().includes('buscar') || textToSend.toLowerCase().includes('flight')) {
        richCard = (
          <div className="mt-3 p-3 bg-primary-container/10 border border-primary-container/30 rounded-xl font-mono text-[10px]">
             <div className="font-bold text-primary-container mb-2 flex items-center gap-1"><Calendar className="w-4 h-4"/> Suggested Itineraries</div>
             <div className="p-2 border border-outline-variant/30 rounded bg-surface mb-2 hover:border-primary-container cursor-pointer transition-all">VX 402 - JFK to LHR - $450</div>
             <div className="p-2 border border-outline-variant/30 rounded bg-surface hover:border-primary-container cursor-pointer transition-all">DL 119 - JFK to CDG - $510</div>
          </div>
        );
      }

      const pilotMsg: ChatMessage = {
        id: `pilot-${Date.now()}`,
        sender: 'copilot',
        text: gptResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Z',
        isTyping: true,
        richCard
      };
      setMessages((prev) => [...prev, pilotMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'copilot',
        text: '⚠️ System Error: Connection to oceanic flight grid disrupted. Please retry query shortly.',
        timestamp: 'ERR',
        isTyping: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Premade fast assistant chip templates
  const CHIPS = [
    { label: '✈️ Buscar voo', query: 'Quero buscar os melhores voos saindo de JFK para LHR' },
    { label: '💰 Ver promoções', query: 'Quais as melhores promoções de passagem hoje?' },
    { label: '🎧 Suporte', query: 'Preciso de ajuda do suporte técnico' },
    { label: '🧳 Minha reserva', query: 'Gostaria de ver as opções e limites de bagagem' }
  ];

  return (
    <section className="glass-card rounded-[24px] p-6 flex flex-col h-[520px] bg-surface-container-low/40 relative">
      {/* Visual cyber glow indicator */}
      <div className="absolute top-0 right-1/4 w-32 h-16 bg-primary-container/5 blur-3xl pointer-events-none rounded-full"></div>

      {/* Header bar */}
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-container/20 border border-primary-container/40">
            <Sparkles className="w-4 h-4 text-primary-container" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary tracking-wide flex items-center gap-1">
              Copilot AI Dispatch <span className="text-[10px] text-primary-container font-mono bg-primary-container/10 px-1.5 py-0.5 rounded uppercase font-normal">Active</span>
            </h3>
            <p className="text-[10px] text-on-surface-variant font-mono">Gemini-2.5-Flash Intelligence Engine</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-md border border-outline-variant/30 text-[10px] text-on-surface-variant font-mono">
          <Terminal className="w-3.5 h-3.5 text-primary-container" />
          <span>PORT: 8080</span>
        </div>
      </div>

      {/* Messages Scroll viewport */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 select-text">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Standard Profile Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
              msg.sender === 'user' 
                ? 'bg-secondary-container/40 border-secondary' 
                : 'bg-primary-container/10 border-primary-container'
            }`}>
              {msg.sender === 'user' ? (
                <User className="w-4 h-4 text-primary" />
              ) : (
                <Terminal className="w-4 h-4 text-primary-container" />
              )}
            </div>

            {/* Conversational bubble */}
            <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div className={`rounded-2xl p-3.5 text-xs font-serif leading-relaxed font-body whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-primary-container text-surface-container-lowest font-semibold font-sans rounded-tr-none'
                  : 'bg-surface-container-high/70 border border-outline-variant/20 rounded-tl-none text-on-surface'
              }`}>
                {msg.sender === 'copilot' && msg.id !== 'init' && msg.isTyping !== false ? (
                  <TypewriterText text={msg.text} onComplete={() => {
                     setMessages(prev => prev.map(m => m.id === msg.id ? {...m, isTyping: false} : m));
                  }}/>
                ) : (
                  msg.text
                )}
                {msg.richCard && msg.isTyping === false && (
                  <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                    {msg.richCard}
                  </motion.div>
                )}
              </div>
              <span className="text-[9px] text-on-surface-variant/70 font-mono tracking-tighter block mt-0.5">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-on-surface-variant text-xs font-mono">
            <div className="w-8 h-8 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary-container animate-spin" />
            </div>
            <div className="bg-surface-container-high/70 border border-outline-variant/20 rounded-2xl rounded-tl-none p-3 select-none flex items-center gap-1.5">
              <span>Co-Pilot crunching meteorological vectors</span>
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Choice template tags */}
      <div className="flex gap-2 overflow-x-auto pb-3 select-none flex-shrink-0 scrollbar-none">
        {CHIPS.map((chip, index) => (
          <button
            key={index}
            disabled={isLoading}
            onClick={() => handleSendMessage(chip.query)}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/30 hover:border-primary-container/40 text-[10px] text-on-surface-variant hover:text-primary transition-all font-sans flex items-center gap-1 active:scale-95 disabled:opacity-50"
          >
            <Compass className="w-3 h-3 text-primary-container" />
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Input keyboard region */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 bg-surface rounded-xl border border-outline-variant/40 px-3 py-2 flex items-center gap-2 focus-within:border-primary-container/50 focus-within:ring-1 focus-within:ring-primary-container/20 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            placeholder="Query flight specs, terminal routing lines..."
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-on-surface placeholder:text-on-surface-variant/40 flex-1 font-body-md"
          />
          <button
            disabled={!inputValue.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="p-1.5 rounded-lg bg-primary-container/20 border border-primary-container/30 text-primary-container hover:bg-primary-container hover:text-surface-container-lowest transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
