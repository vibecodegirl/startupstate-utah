import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const UTAH_CONTEXT = `You are the Utah Startup State AI Business Resource Advisor — an expert mentor for entrepreneurs in Utah. You have deep knowledge of:

PROGRAMS & RESOURCES:
- startup.utah.gov — the Startup State Initiative portal (Governor's Office of Economic Opportunity / GOEO)
- Utah SBDC (Small Business Development Centers) — free consulting statewide
- Utah Women's Business Center
- Boots to Business — veteran entrepreneur program
- SBIR/STTR grants — federal R&D funding for startups
- NSF I-Corps — for commercializing university research
- Silicon Slopes — Utah's tech community hub
- Kickstart Fund, Album VC, Signal Peak Ventures, Pelion Venture Partners — Utah VCs
- Utah Angels, Cottonwood Heights Angel Fund — angel networks
- BioUtah — Life Sciences association
- 47G — Utah Aerospace & Defense association
- University of Utah Technology Commercialization Office
- Utah Governor's Office of Economic Opportunity (GOED) programs
- Utah SBDC Export Assistance program

KEY FACTS:
- Utah ranked #1 best state to start a business (WalletHub 2023)
- Silicon Slopes is one of the fastest-growing tech hubs in the US
- Utah County (Provo area) has one of the highest concentrations of startups per capita
- Strong sectors: AI/ML, Fintech, Life Sciences, Aerospace & Defense, SaaS

CLEVER FRAMEWORK: Always evaluate responses through: Clarity, Leadership, Evaluation, Value, Expansion, Resilience.

If you don't know a specific answer, say: "I've flagged this question for our team to ensure you get the most accurate resource." Never hallucinate specific funding amounts or guarantee outcomes.

Be warm, actionable, and specific. Ask follow-up questions to personalize advice.`;

export default function AdvisorChat({ initialContext }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const welcome = initialContext
      ? `Hello! I can see you're ${initialContext.split("I'm ")[1]?.split(".")[0] || 'starting your journey'}. Let me get you the most relevant Utah resources right away.\n\nCould you tell me a bit more about your biggest challenge right now?`
      : "Welcome to the Utah Startup State AI Advisor! I'm here to connect you with the right resources for your entrepreneurial journey.\n\nWhat brings you here today? Are you:\n• Starting a new business?\n• Looking for funding?\n• Trying to scale or grow?\n• Exploring Utah's startup ecosystem?";
    
    setMessages([{ role: 'assistant', content: welcome }]);
    
    if (initialContext) {
      setTimeout(() => handleSend(null, initialContext), 800);
    }
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e, overrideInput) => {
    if (e) e.preventDefault();
    const text = overrideInput || input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`).join('\n');
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${UTAH_CONTEXT}\n\nConversation so far:\n${history}\n\nUser: ${text}\n\nProvide a helpful, personalized response as the Utah Startup State Advisor. Be concise but thorough. Format with bullet points when listing resources.`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: "Starting fresh! What can I help you with on your entrepreneurial journey in Utah?" }]);
    setInput('');
  };

  const quickPrompts = [
    "What funding is available for my stage?",
    "How do I register my business in Utah?",
    "Find me Utah investors in my sector",
    "What accelerators are in Utah?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-manrope font-bold text-sm text-foreground">AI Resource Advisor</h3>
            <p className="text-xs text-primary font-medium">Powered by Utah Startup State</p>
          </div>
        </div>
        <button onClick={reset} className="text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User size={14} className="text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-border bg-white flex gap-2 flex-wrap">
          {quickPrompts.map(q => (
            <button
              key={q}
              onClick={() => handleSend(null, q)}
              className="text-xs bg-green-pale text-primary border border-primary/20 rounded-full px-3 py-1 hover:bg-primary hover:text-white transition-colors font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-border bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about resources, funding, or your startup journey…"
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-muted/30"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-primary text-white hover:bg-green-dark rounded-xl px-4"
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by startup.utah.gov
        </p>
      </form>
    </div>
  );
}