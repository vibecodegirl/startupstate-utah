import { TrendingUp, Award, Users, Globe, Building, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WhyCarousel from '@/components/why-utah/WhyCarousel';

const stats = [
  { value: '#1', label: 'Best State to Start a Business', source: 'WalletHub 2023' },
  { value: '3,500+', label: 'Active Startups', source: 'Silicon Slopes' },
  { value: '$4.2B+', label: 'Annual VC Investment', source: 'NVCA' },
  { value: '45+', label: 'Active Accelerators & Incubators', source: 'GOEO' },
  { value: '15%', label: 'Annual Tech Job Growth', source: 'BLS' },
  { value: 'Top 5', label: 'Most Educated Workforce', source: 'US Census' },
];

const whyItems = [
  {
    icon: TrendingUp,
    title: 'Fastest-Growing Tech Hub',
    description: 'Silicon Slopes rivals Silicon Valley for startup density. Utah has produced more billion-dollar companies per capita than any other state.',
  },
  {
    icon: Award,
    title: 'Government-Backed Support',
    description: 'Under Governor Spencer Cox, Utah declared itself the "Startup Capital of the World" — and backs it with GOEO programs, grants, and resources.',
  },
  {
    icon: Users,
    title: 'World-Class Talent',
    description: 'Utah\'s young, educated workforce — boosted by BYU, the University of Utah, and Utah State — feeds a constant pipeline of technical talent.',
  },
  {
    icon: Globe,
    title: 'International Reach',
    description: 'Utah\'s multilingual workforce, trade programs, and global connectivity make it uniquely positioned for international business expansion.',
  },
  {
    icon: Building,
    title: 'Low Cost of Living & Operations',
    description: 'Compared to California or New York, Utah offers dramatically lower operational costs while maintaining access to top talent and capital.',
  },
  {
    icon: Zap,
    title: 'Four High-Growth Sectors',
    description: 'AI, Aerospace & Defense, Life Sciences, and Fintech are all thriving in Utah — creating cross-sector synergies unlike anywhere else.',
  },
];

const sectors = [
  { name: 'Artificial Intelligence', color: 'bg-blue-500', companies: '400+', growth: '+34% YoY', icon: '🤖' },
  { name: 'Aerospace & Defense', color: 'bg-orange-500', companies: '280+', growth: '+18% YoY', icon: '🚀' },
  { name: 'Life Sciences', color: 'bg-red-500', companies: '350+', growth: '+22% YoY', icon: '🧬' },
  { name: 'Fintech', color: 'bg-purple-500', companies: '220+', growth: '+29% YoY', icon: '💳' },
];

export default function WhyUtah() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-green-dark via-primary to-green-mid text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://startup.utah.gov/wp-content/uploads/asset-1@3x.webp" alt="SLC" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
            <Award size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Startup Capital of the World</span>
          </div>
          <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl mb-6 leading-tight">
            Why Utah?
          </h1>
          <p className="text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            In January 2023, WalletHub named Utah the #1 best state to start a business. Here's why the world's most ambitious founders are choosing Utah.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center shadow-lg">
              <div className="font-manrope font-extrabold text-2xl text-primary mb-1">{s.value}</div>
              <div className="text-xs text-foreground font-semibold leading-snug mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why items Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-manrope font-extrabold text-4xl text-foreground mb-3">Utah's Competitive Advantage</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Six reasons why Utah is the smartest place to build your startup.</p>
        </div>
        <WhyCarousel items={whyItems} />
      </section>

      {/* Sectors */}
      <section className="bg-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-extrabold text-4xl text-white mb-3">Four Thriving Sectors</h2>
            <p className="text-white/60 text-lg">Utah's innovation economy is powered by four high-growth industries.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sectors.map(s => (
              <div key={s.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-manrope font-bold text-lg text-white mb-2">{s.name}</h3>
                <div className="text-2xl font-extrabold text-primary font-manrope">{s.companies}</div>
                <div className="text-xs text-white/50 mb-1">companies in Utah</div>
                <div className="text-xs font-semibold text-green-400">{s.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-pale">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <img
            src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/44ea76f88_StartupState_Logo_Web_Color_Horiz.webp"
            alt="Startup State"
            className="h-10 w-auto mx-auto mb-6"
          />
          <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-4">
            Ready to be part of Utah's story?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/add-startup">
              <Button className="bg-primary text-white hover:bg-green-dark font-manrope font-bold px-8">Add Your Startup</Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-white font-manrope font-bold px-8">Explore Resources</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}