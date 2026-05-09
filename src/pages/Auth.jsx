import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const personas = [
  {
    id: 'founder',
    title: 'I\'m a Founder',
    description: 'Building a startup in Utah and looking for resources, funding, and connections.',
    icon: '🚀',
  },
  {
    id: 'investor',
    title: 'I\'m an Investor',
    description: 'Discovering and supporting the next generation of Utah startups.',
    icon: '💰',
  },
  {
    id: 'supporter',
    title: 'I\'m a Supporter',
    description: 'Mentoring, advising, or helping Utah\'s entrepreneurial ecosystem grow.',
    icon: '🤝',
  },
];

export default function Auth() {
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handleSignIn = () => {
    base44.auth.redirectToLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-pale to-white">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-primary/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <MapPin size={13} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Welcome to Utah's Startup Ecosystem</span>
            </div>

            <img
              src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/44ea76f88_StartupState_Logo_Web_Color_Horiz.webp"
              alt="Startup State"
              className="h-12 w-auto mx-auto mb-8"
            />

            <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-3 leading-tight">
              Build Your Future in Utah
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Connect with resources, funding, and a thriving community of innovators and entrepreneurs.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl border border-border shadow-lg p-8 sm:p-10 mb-8">
            {!selectedPersona ? (
              <>
                <h2 className="font-manrope font-bold text-2xl text-foreground mb-8 text-center">Who are you?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona)}
                      className="p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-green-pale transition-all text-left group"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{persona.icon}</div>
                      <h3 className="font-manrope font-bold text-base text-foreground mb-2">{persona.title}</h3>
                      <p className="text-sm text-muted-foreground">{persona.description}</p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">
                  {personas.find(p => p.id === selectedPersona)?.icon}
                </div>
                <h2 className="font-manrope font-bold text-2xl text-foreground mb-2">
                  {personas.find(p => p.id === selectedPersona)?.title}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {personas.find(p => p.id === selectedPersona)?.description}
                </p>
                <button
                  onClick={() => setSelectedPersona(null)}
                  className="text-sm text-primary hover:underline mb-6"
                >
                  Change selection
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-primary text-primary-foreground hover:bg-green-dark font-manrope font-bold px-8 py-3 text-base gap-2 rounded-xl"
                onClick={handleSignIn}
              >
                <Sparkles size={18} /> Create Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-primary/30 text-primary hover:bg-green-pale font-manrope font-semibold px-8 py-3 text-base"
                onClick={handleSignIn}
              >
                Sign In <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '3,500+', label: 'Startups' },
              { value: '$4.2B+', label: 'VC Invested' },
              { value: '#1', label: 'Best State' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 p-4">
                <div className="font-manrope font-extrabold text-xl text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}