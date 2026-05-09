import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from './ParticleBackground';
import HeroCarousel from './HeroCarousel';

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-32">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Carousel */}
        <HeroCarousel />

        {/* Heading */}
        <div className="text-center mt-16 mb-12">
          <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-tight mb-6">
            Utah's{' '}
            <span className="text-primary relative">
              Thriving
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M0 6 Q75 0 150 4 Q225 8 300 2" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
              </svg>
            </span>{' '}
            Ecosystem
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-inter font-light leading-relaxed">
            Be a part of Utah's startup scene. Start, grow, and build your business with the resources, connections, and capital you need — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link to={cta.href}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-green-dark font-manrope font-bold px-8 py-3 text-base gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                {cta.text} <ArrowRight size={18} />
              </Button>
            </Link>
            <button onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="inline-flex items-center gap-2 border border-primary/30 text-primary hover:bg-green-pale font-manrope font-semibold px-8 py-3 text-base rounded-xl transition-colors">
              <Sparkles size={16} /> AI Advisor
            </button>
          </div>
          <p className="text-sm text-muted-foreground">{cta.sub}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="font-manrope font-extrabold text-3xl text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}