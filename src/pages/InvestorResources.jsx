import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, DollarSign, Users, Globe, Zap, Award, Building2, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import TrendingSectors from '@/components/investors/TrendingSectors';
import DiscoverStartups from '@/components/investors/DiscoverStartups';
import EcosystemMap from '@/components/investors/EcosystemMap';
import InvestorMatchPanel from '@/components/investors/InvestorMatchPanel';
import HubDetailsPanel from '@/components/investors/HubDetailsPanel';

function DiscoverConnectGrid() {
  const [mapZoom, setMapZoom] = useState(null);
  const [selectedHub, setSelectedHub] = useState(null);

  const handleHubClick = (hub) => {
    setSelectedHub(hub);
    setMapZoom({ lat: hub.lat, lon: hub.lon });
  };

  const handleStartupClick = (startup) => {
    // This is handled by clicking the marker on the map
    // The map will focus on the startup's location
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiscoverStartups onHubSelect={setMapZoom} selectedHub={selectedHub} />
        <EcosystemMap zoomToCity={mapZoom} onHubClick={handleHubClick} />
      </div>
      {selectedHub && <HubDetailsPanel hub={selectedHub} onClose={() => setSelectedHub(null)} onStartupClick={handleStartupClick} />}
    </>
  );
}

const vcData = [
  { year: '2019', amount: 0.8 },
  { year: '2020', amount: 1.1 },
  { year: '2021', amount: 2.9 },
  { year: '2022', amount: 2.4 },
  { year: '2023', amount: 1.7 },
  { year: '2024', amount: 1.96 },
];

const sectorData = [
  { sector: 'AI / ML', startups: 420, growth: 38 },
  { sector: 'Life Sciences', startups: 310, growth: 22 },
  { sector: 'Fintech', startups: 280, growth: 29 },
  { sector: 'B2B SaaS', startups: 680, growth: 31 },
  { sector: 'Aerospace & Defense', startups: 190, growth: 18 },
  { sector: 'Energy', startups: 160, growth: 42 },
];

const ecosystemPie = [
  { name: 'B2B SaaS', value: 29, color: '#16a34a' },
  { name: 'AI / ML', value: 18, color: '#2563eb' },
  { name: 'Life Sciences', value: 13, color: '#dc2626' },
  { name: 'Fintech', value: 12, color: '#7c3aed' },
  { name: 'Aerospace', value: 8, color: '#ea580c' },
  { name: 'Other', value: 20, color: '#94a3b8' },
];

const stats = [
  { value: '$1.96B', label: 'VC Deal Activity (2024)', icon: DollarSign, color: 'text-green-600 bg-green-50' },
  { value: '$10B+', label: 'Assets Under Management by Utah VCs', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
  { value: '3,500+', label: 'Active Startups', icon: Building2, color: 'text-purple-600 bg-purple-50' },
  { value: '#1', label: 'Economic Outlook (19 Consecutive Years)', icon: Award, color: 'text-orange-600 bg-orange-50' },
  { value: '$315B+', label: 'State GDP (2025)', icon: Globe, color: 'text-teal-600 bg-teal-50' },
  { value: '4.5%', label: 'Real GDP Growth Rate — #1 Nationally', icon: Zap, color: 'text-red-600 bg-red-50' },
];

const whyUtah = [
  {
    title: 'Talent Pipeline',
    description: '3 R1 research universities — University of Utah, Utah State, and BYU — producing top engineering, life sciences, and computer science graduates.',
    icon: Users,
  },
  {
    title: 'Innovation Infrastructure',
    description: 'Top 5 patent ranking among peer institutions (U of U). $603.7M in SBIR/STTR funding won by Utah companies since 2008.',
    icon: Zap,
  },
  {
    title: 'Business Climate',
    description: '#1 economic outlook for 19 consecutive years. Low regulatory burden, competitive tax environment, and a state government that actively supports innovation.',
    icon: TrendingUp,
  },
  {
    title: 'Geographic Advantage',
    description: 'Mountain West hub with direct access to West Coast capital markets, a central US timezone, and growing international trade corridors.',
    icon: Globe,
  },
  {
    title: 'Strong VC Ecosystem',
    description: 'Kickstart Fund, Pelion, Signal Peak, Album VC, Sorenson Capital, and Mercato Partners — all Utah-based, all actively deploying capital.',
    icon: DollarSign,
  },
  {
    title: 'Sector Depth',
    description: 'World-class clusters in AI/ML, Life Sciences, Aerospace & Defense, and Fintech — supported by federal contracts, university research, and industry associations.',
    icon: Award,
  },
];

const notableExits = [
  { name: 'Qualtrics', outcome: 'IPO / SAP acquisition — $8B', sector: 'B2B SaaS' },
  { name: 'Domo', outcome: 'NASDAQ IPO', sector: 'B2B SaaS' },
  { name: 'Entrust Datacard', outcome: 'Acquired — $1.2B', sector: 'Security' },
  { name: 'Ancestry.com', outcome: 'Acquired — $1.6B', sector: 'Consumer' },
  { name: 'Ivanti', outcome: 'PE backed — $3B valuation', sector: 'B2B Software' },
  { name: 'MX Technologies', outcome: 'Series C — $300M+', sector: 'Fintech' },
];

export default function InvestorResources() {
  const [showMatchPanel, setShowMatchPanel] = useState(false);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-16 text-white">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-green-dark to-foreground" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-4 hover:bg-white/20 transition-colors">
            <TrendingUp size={13} className="text-primary/80" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Capital Deployment Hub</span>
          </div>

          <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl lg:text-7xl mb-4 leading-tight">
            Invest in <span className="bg-gradient-to-r from-primary via-green-light to-primary bg-clip-text text-transparent">Utah</span>
          </h1>

          <p className="text-white/80 text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed mb-8">
            The fastest-growing innovation economy in America. Ranked #1 economic outlook for 19 consecutive years. $1.96B+ in VC deployed annually.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/map">
              <Button className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-7 py-2.5 text-sm shadow-lg hover:shadow-xl transition-all">
                View Startup Map <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="https://nucleusinstitute.org" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 font-semibold px-7 py-2.5 text-sm backdrop-blur-sm gap-2">
                2026 Innovation Report <ExternalLink size={14} />
              </Button>
            </a>
            <Button 
              onClick={() => setShowMatchPanel(true)}
              className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-7 py-2.5 text-sm shadow-lg hover:shadow-xl transition-all"
            >
              Get Matched to a Startup <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Section 1: Key Stats - Lead with credibility */}
        <section>
          <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-2">By the Numbers</h2>
          <p className="text-muted-foreground mb-8">Source: 2026 State of Innovation Report — Nucleus Institute</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="font-manrope font-extrabold text-2xl text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-snug">{s.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Section 2: Interactive Discovery - Immediate action */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div>
              <h2 className="font-manrope font-bold text-2xl text-foreground">Discover & Connect</h2>
              <p className="text-sm text-muted-foreground">Explore startup hubs and find matching opportunities</p>
            </div>
          </div>
          <DiscoverConnectGrid />
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Section 3: Trending Sectors - Show what's hot */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div>
              <h2 className="font-manrope font-bold text-2xl text-foreground">Market Insights</h2>
              <p className="text-sm text-muted-foreground">Real-time trends across Utah's innovation sectors</p>
            </div>
          </div>
          <TrendingSectors />
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Section 4: Why Invest in Utah */}
        <section>
          <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-2">Why Invest in Utah</h2>
          <p className="text-muted-foreground mb-8">The fundamentals that make Utah a sustained, high-conviction investment destination.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUtah.map(w => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-manrope font-bold text-base text-foreground mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Section 5: Notable Exits & Milestones - Social proof */}
        <section>
          <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-2">Notable Exits & Milestones</h2>
          <p className="text-muted-foreground mb-8">Proof that Utah-built companies reach the top.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notableExits.map(e => (
              <div key={e.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="font-manrope font-bold text-lg text-foreground mb-1">{e.name}</div>
                <div className="text-xs font-semibold text-primary bg-green-50 px-2 py-0.5 rounded-full inline-block mb-2">{e.sector}</div>
                <p className="text-sm text-muted-foreground">{e.outcome}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {showMatchPanel && <InvestorMatchPanel onClose={() => setShowMatchPanel(false)} />}
    </div>
  );
}