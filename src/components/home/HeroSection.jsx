import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from './ParticleBackground';

const stats = [
  { value: '3,500+', label: 'Startups' },
  { value: '$4.2B+', label: 'VC Invested' },
  { value: '#1', label: 'Best State to Start a Business' },
  { value: '45+', label: 'Active Accelerators' },
];

export default function HeroSection({ role }) {
  const getPersonalizedCTA = () => {
    switch (role) {
      case 'investor': return { text: 'Explore Utah Startups', href: '/map', sub: 'Discover investment opportunities across 4 high-growth sectors' };
      case 'founder': return { text: 'Access Your Resources', href: '/resources', sub: 'Personalized tools for every stage of your journey' };
      case 'admin': return { text: 'Open Admin Dashboard', href: '/admin', sub: 'Manage listings, flags, and platform content' };
      default: return { text: 'Start Your Journey', href: '/start', sub: 'Find the right resources for where you are today' };
    }
  };
  const cta = getPersonalizedCTA();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-green-pale to-white">
      <ParticleBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-primary/20 rounded-full px-4 py-1.5 mb-6 shadow-sm animate-fade-in">
          <MapPin size={13} className="text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Startup Capital of the World</span>
        </div>

        {/* Heading */}
        <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-tight mb-6 animate-fade-up">
          Utah's{' '}
          <span className="text-primary relative">
            Thriving
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
              <path d="M0 6 Q75 0 150 4 Q225 8 300 2" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
            </svg>
          </span>{' '}
          Ecosystem
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-inter font-light leading-relaxed animate-fade-up">
          Be a part of Utah's startup scene. Start, grow, and build your business with the resources, connections, and capital you need — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-up">
          <Link to={cta.href}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-green-dark font-manrope font-bold px-8 py-3 text-base gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              {cta.text} <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/advisor">
            <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-green-pale font-manrope font-semibold px-8 py-3 text-base gap-2 rounded-xl">
              <Sparkles size={16} /> AI Advisor
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground animate-fade-in">{cta.sub}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-up">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="font-manrope font-extrabold text-3xl text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary/50 rounded-full animate-pulse-gentle" />
        </div>
      </div>
    </section>
  );
}