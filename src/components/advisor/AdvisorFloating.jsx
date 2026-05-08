import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const SYSTEM_PROMPT = `You are the Utah Startup State AI Business Advisor — an expert mentor and strategic partner for entrepreneurs in Utah. You don't just answer questions; you proactively guide founders step-by-step through the process of starting, building, and scaling a business.

YOUR CORE CAPABILITIES:
1. BUSINESS PLAN DEVELOPMENT — Help founders build a full business plan: executive summary, problem/solution, market analysis, revenue model, go-to-market strategy, financial projections, and team.
2. STEP-BY-STEP GUIDANCE — Walk users through the exact steps to start a Utah business: idea validation → business registration → EIN → licenses → funding → hiring → launch.
3. RESOURCE MATCHING — Match users to the exact Utah resource, program, or contact for their situation.
4. FUNDING NAVIGATION — Guide pre-seed to Series B founders to the right grants, angels, VCs, and government programs.

UTAH PROGRAMS & RESOURCES YOU KNOW:
- startup.utah.gov / GOEO — Startup State portal, official programs
- Utah SBDC — Free consulting, business plan help, statewide
- Utah Division of Corporations — corporations.utah.gov — business registration
- Utah Business One Stop — onestop.utah.gov — licenses & permits
- IRS EIN — free federal tax ID registration
- SBIR/STTR grants (Phase 0, I, II) — up to $2M R&D funding
- NSF I-Corps — commercializing university research
- NSF SBIR — seedfund.nsf.gov
- Utah Women's Business Center — UWBC.org
- Boots to Business — veteran entrepreneurship (SBA)
- Silicon Slopes — siliconslopes.com — tech community, jobs, events
- Kickstart Fund — Utah seed VC ($250K–$1M)
- Utah Angels — monthly pitches in SLC
- Pelion Venture Partners — early-stage VC
- Signal Peak Ventures — Series A+ B2B SaaS
- Album VC — growth SaaS
- Sorenson Capital — growth equity
- BioUtah — life sciences association
- 47G — aerospace & defense association
- U of U Technology Commercialization Office — tco.utah.edu
- GOED International Trade — export assistance
- Rural Business Development Grant (USDA)
- SBA 7(a) Loans — up to $5M
- Utah Life Science Summit
- University Research Park (SLC)
- BioInnovations Gateway — life sciences coworking

KEY UTAH FACTS:
- #1 best state to start a business (WalletHub 2023)
- Silicon Slopes rivals Silicon Valley for startup density
- Strong sectors: AI/ML, Fintech, Life Sciences, Aerospace & Defense, B2B SaaS

BEHAVIOR RULES:
- Be warm, direct, and actionable. No fluff.
- Always ask a clarifying question if the user's stage, sector, or need is unclear.
- When helping with a business plan, proceed section by section — don't dump everything at once.
- Use bullet points and numbered lists for steps and resources.
- If you don't know a specific fact, say: "I've flagged this for the Utah Startup State team to verify."
- Never hallucinate funding amounts, program details, or guarantees.
- End responses with a clear next step or question to keep momentum.`;

const WELCOME_MESSAGE = `Hi! I'm your Utah Startup State AI Advisor 👋

I can help you:
• **Build a business plan** step by step
• **Navigate starting a business** in Utah (registration, EIN, licenses)
• **Find funding** — grants, angels, VCs matched to your stage
• **Connect you with the right programs** — SBDC, accelerators, and more

**Where are you in your journey?** Pick one or just tell me:

1. 🌱 I have an idea — where do I start?
2. 📋 I need help building my business plan
3. 💰 I'm looking for funding
4. 🏢 I'm ready to register my business
5. 📈 I'm scaling and need resources`;

export default function AdvisorFloating({ initialContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
  }, []);

  // Auto-open and seed context if provided (from persona links or /advisor page)
  useEffect(() => {
    if (initialContext) {
      setOpen(true);
      setTimeout(() => handleSend(null, initialContext), 600);
    }
  }, [initialContext]);

  // Listen for global open event (from /advisor page)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('openAdvisor', handler);
    return () => window.removeEventListener('openAdvisor', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (e, overrideInput) => {
    if (e) e.preventDefault();
    const text = overrideInput || input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages
      .slice(-10) // keep last 10 messages for context
      .map(m => `${m.role === 'user' ? 'Founder' : 'Advisor'}: ${m.content}`)
      .join('\n\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\n---\nCONVERSATION HISTORY:\n${history}\n\n---\nFounder: ${text}\n\nAdvisor:`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);

    if (!open) setUnread(true);
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setInput('');
  };

  const quickReplies = [
    '🌱 I have an idea — where do I start?',
    '📋 Help me build a business plan',
    '💰 I need funding guidance',
    '🏢 How do I register my business?',
  ];

  const formatContent = (text) => {
    // Strip markdown bold, italic, headers
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/`{1,3}(.*?)`{1,3}/gs, '$1');
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Nudge tooltip */}
        {!open && (
          <div className="bg-foreground text-white text-xs font-medium px-3 py-2 rounded-xl shadow-lg animate-fade-in max-w-48 text-center leading-snug">
            Ask your Utah Startup Advisor ✨
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="relative w-14 h-14 rounded-full bg-primary text-white shadow-xl hover:bg-green-dark transition-all duration-200 hover:scale-105 flex items-center justify-center"
        >
          {open ? <X size={22} /> : <Sparkles size={22} />}
          {unread && !open && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* Slideout panel */}
      {open && (
        <>
          {/* Backdrop (mobile) */}
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-0 right-0 z-50 flex flex-col bg-white shadow-2xl border-l border-t border-border
            w-full sm:w-[420px] lg:w-[420px]
            h-[90vh] sm:h-[620px]
            sm:bottom-6 sm:right-6 sm:rounded-2xl overflow-hidden
            animate-slide-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary to-green-mid shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-sm text-white">AI Business Advisor</h3>
                  <p className="text-white/70 text-xs">Powered by Utah Startup State</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={reset} className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
                  <RefreshCw size={15} />
                </button>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={13} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'
                    }`}
                    dangerouslySetInnerHTML={
                      msg.role === 'assistant'
                        ? { __html: formatContent(msg.content).replace(/\n/g, '<br/>') }
                        : undefined
                    }
                  >
                    {msg.role === 'user' ? msg.content : undefined}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <User size={13} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot size={13} className="text-white" />
                  </div>
                  <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies (only at start) */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t border-border bg-white flex flex-col gap-1.5">
                {quickReplies.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(null, q)}
                    className="text-left text-xs bg-green-pale text-primary border border-primary/20 rounded-xl px-3 py-2 hover:bg-primary hover:text-white transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-white shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything about your business…"
                  className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-muted/30"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-primary text-white hover:bg-green-dark rounded-xl px-3"
                >
                  <Send size={15} />
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}