import { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import JourneyCards from '@/components/home/JourneyCards';
import PersonaSelector from '@/components/home/PersonaSelector';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';


const statsAnimationStyle = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const stats = [
  { value: '#1', label: 'Best State to Start a Business', source: 'WalletHub 2023' },
  { value: '3,500+', label: 'Active Startups', source: 'Silicon Slopes' },
  { value: '$4.2B+', label: 'Annual VC Investment', source: 'NVCA' },
  { value: '45+', label: 'Active Accelerators & Incubators', source: 'GOEO' },
  { value: '15%', label: 'Annual Tech Job Growth', source: 'BLS' },
  { value: 'Top 5', label: 'Most Educated Workforce', source: 'US Census' },
];

export default function Home() {


  return (
    <div className="min-h-screen">
      <style>{statsAnimationStyle}</style>
      <HeroSection />

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:scale-105 group cursor-default" style={{
              animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
            }}>
              <div className="font-manrope font-extrabold text-2xl bg-gradient-to-r from-primary to-green-mid bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">{s.value}</div>
              <div className="text-xs text-foreground font-semibold leading-snug mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.source}</div>
            </div>
          ))}
        </div>
      </section>
      <JourneyCards />





      <PersonaSelector />

      {/* CTA Strip */}
      <section className="relative bg-gradient-to-r from-primary via-green-mid to-primary py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Ready to put your startup on the map?
          </h2>
          <p className="text-white/85 text-lg mb-10">
            Join thousands of Utah founders already building the future here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/add-startup">
              <Button size="lg" className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8 gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <MapPin size={18} /> Add Your Startup
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="border-white/60 text-white hover:bg-white/15 font-manrope font-semibold px-8 gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <Sparkles size={16} /> Talk to AI Advisor
            </Button>
          </div>
        </div>
      </section>

      {/* GOEO Attribution */}
      <section className="py-10 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <img
            src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/25e11e655_GOEO_BLACK_Standard_Web.webp"
            alt="Governor's Office of Economic Opportunity"
            className="h-10 w-auto opacity-80"
          />
          <div className="hidden sm:block w-px h-10 bg-border" />
          <p className="text-sm text-muted-foreground max-w-sm">
            The Startup State Initiative is a program of Utah's Governor's Office of Economic Opportunity, celebrating and empowering entrepreneurs statewide.
          </p>
        </div>
      </section>
    </div>
  );
}