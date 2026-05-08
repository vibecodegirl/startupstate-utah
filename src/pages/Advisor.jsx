import { useEffect, useState } from 'react';
import AdvisorChat from '@/components/advisor/AdvisorChat';
import PersonaSelector from '@/components/home/PersonaSelector';
import { Sparkles, Info } from 'lucide-react';

export default function Advisor() {
  const [initialContext, setInitialContext] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ctx = params.get('context');
    const persona = params.get('persona');
    if (ctx) setInitialContext(decodeURIComponent(ctx));
    if (persona) setSelectedPersona(persona);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-pale to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">AI-Powered</span>
          </div>
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-3">
            Business Resource Advisor
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your personal mentor for Utah's startup ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-border shadow-xl overflow-hidden" style={{ height: '620px', display: 'flex', flexDirection: 'column' }}>
              <AdvisorChat key={initialContext} initialContext={initialContext} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* About */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-primary" />
                <h3 className="font-manrope font-bold text-sm">About This Advisor</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trained on Utah's full ecosystem of resources: GOEO programs, SBDCs, VCs, accelerators, grants, and more — delivering accurate, personalized recommendations.
              </p>
            </div>

            {/* Try personas */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="font-manrope font-bold text-sm mb-3">Try a Persona</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Select a real-world scenario to see how the advisor personalizes guidance.
              </p>
              <a href="/advisor" className="text-xs text-primary font-semibold hover:underline">
                ← Start fresh conversation
              </a>
            </div>

            {/* Disclaimer */}
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Transparency Note:</strong> If the advisor can't verify information, it will flag the question for the Utah Startup State team. No hallucinated data — ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}