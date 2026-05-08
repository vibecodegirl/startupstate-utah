import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, ExternalLink, BookOpen, DollarSign, Users, Briefcase, Globe, GraduationCap, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UTAH_RESOURCES = [
  {
    title: 'Utah SBDC — Small Business Development Centers',
    category: 'Mentorship',
    description: 'Free one-on-one business consulting, training, and resources for Utah entrepreneurs at every stage.',
    url: 'https://utahsbdc.org',
    provider: 'Utah SBDC',
    audience: ['All Stages'],
    sectors: ['All Sectors'],
    tags: ['free', 'consulting', 'statewide'],
  },
  {
    title: 'Startup State Initiative — startup.utah.gov',
    category: 'Government',
    description: 'The official Utah Startup State portal. New business steps, resources, funding, and events from GOEO.',
    url: 'https://startup.utah.gov',
    provider: 'Governor\'s Office of Economic Opportunity',
    audience: ['All Stages'],
    sectors: ['All Sectors'],
    tags: ['official', 'government', 'resources'],
  },
  {
    title: 'Utah Women\'s Business Center',
    category: 'Mentorship',
    description: 'Business training, mentoring, and access to capital for women entrepreneurs across Utah.',
    url: 'https://www.uwbc.org',
    provider: 'UWBC',
    audience: ['All Stages'],
    sectors: ['All Sectors'],
    tags: ['women', 'mentorship', 'funding'],
  },
  {
    title: 'SBIR/STTR Federal Grants',
    category: 'Funding',
    description: 'Federal R&D funding programs for technology startups. Ideal for deep tech and university spin-outs.',
    url: 'https://www.sbir.gov',
    provider: 'U.S. SBA',
    audience: ['Pre-Seed', 'Seed'],
    sectors: ['AI', 'Life Sciences', 'Aerospace & Defense'],
    tags: ['federal', 'grants', 'R&D'],
  },
  {
    title: 'NSF I-Corps — Innovation Corps',
    category: 'Education',
    description: 'National Science Foundation program to help researchers and PhD candidates commercialize their innovations.',
    url: 'https://www.nsf.gov/news/special_reports/i-corps/',
    provider: 'NSF',
    audience: ['Pre-Seed'],
    sectors: ['AI', 'Life Sciences'],
    tags: ['university', 'research', 'commercialization'],
  },
  {
    title: 'Silicon Slopes — Utah Tech Community',
    category: 'Networking',
    description: 'Utah\'s premier technology community hub with events, jobs, and investor connections.',
    url: 'https://siliconslopes.com',
    provider: 'Silicon Slopes',
    audience: ['All Stages'],
    sectors: ['AI', 'Fintech', 'B2B Software'],
    tags: ['community', 'networking', 'tech'],
  },
  {
    title: 'Kickstart Fund',
    category: 'Funding',
    description: 'Utah-based seed-stage venture fund investing in SaaS, marketplace, and consumer internet startups.',
    url: 'https://kickstartfund.com',
    provider: 'Kickstart Fund',
    audience: ['Seed', 'Series A'],
    sectors: ['AI', 'Fintech', 'B2B Software'],
    tags: ['VC', 'seed', 'venture'],
  },
  {
    title: 'Boots to Business — Veteran Entrepreneurship',
    category: 'Education',
    description: 'SBA program providing veteran entrepreneurs with business education and resource connections.',
    url: 'https://www.sba.gov/business-guide/grow-your-business/veteran-owned-businesses',
    provider: 'SBA',
    audience: ['Pre-Seed', 'Seed'],
    sectors: ['All Sectors'],
    tags: ['veterans', 'military', 'training'],
  },
  {
    title: 'BioUtah — Life Sciences Association',
    category: 'Networking',
    description: 'Utah\'s life sciences industry association connecting biotech, medical device, and pharma companies.',
    url: 'https://bioutah.org',
    provider: 'BioUtah',
    audience: ['All Stages'],
    sectors: ['Life Sciences'],
    tags: ['life sciences', 'biotech', 'networking'],
  },
  {
    title: '47G — Utah Aerospace & Defense',
    category: 'Networking',
    description: 'Utah Aerospace and Defense Association connecting defense contractors, suppliers, and startups.',
    url: 'https://www.47g.org',
    provider: '47G',
    audience: ['All Stages'],
    sectors: ['Aerospace & Defense'],
    tags: ['defense', 'aerospace', 'association'],
  },
  {
    title: 'U of U Technology Commercialization Office',
    category: 'Education',
    description: 'Helps University of Utah researchers commercialize innovations through licensing, startups, and industry partnerships.',
    url: 'https://tco.utah.edu',
    provider: 'University of Utah',
    audience: ['Pre-Seed'],
    sectors: ['AI', 'Life Sciences'],
    tags: ['university', 'IP', 'commercialization'],
  },
  {
    title: 'GOED International Trade Program',
    category: 'International',
    description: 'Utah Governor\'s Office of Economic Opportunity export and international trade assistance for growth-stage companies.',
    url: 'https://business.utah.gov/international-trade/',
    provider: 'GOED',
    audience: ['Series A', 'Series B'],
    sectors: ['All Sectors'],
    tags: ['international', 'export', 'growth'],
  },
];

const categoryIcons = {
  'Funding': DollarSign,
  'Mentorship': Users,
  'Government': Building,
  'Education': GraduationCap,
  'Networking': Users,
  'International': Globe,
  'Accelerator': Briefcase,
};

const categoryColors = {
  'Funding': 'bg-purple-100 text-purple-700',
  'Mentorship': 'bg-blue-100 text-blue-700',
  'Government': 'bg-green-100 text-green-700',
  'Education': 'bg-orange-100 text-orange-700',
  'Networking': 'bg-pink-100 text-pink-700',
  'International': 'bg-cyan-100 text-cyan-700',
  'Accelerator': 'bg-yellow-100 text-yellow-700',
};

const categories = ['All', 'Funding', 'Mentorship', 'Government', 'Education', 'Networking', 'International'];
const audienceFilters = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];

export default function Resources() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [audience, setAudience] = useState('All Stages');
  const [dbResources, setDbResources] = useState([]);

  useEffect(() => {
    base44.entities.Resource.list('-created_date', 100).then(setDbResources).catch(() => {});
  }, []);

  const allResources = [...UTAH_RESOURCES, ...dbResources];

  const filtered = allResources.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || r.category === category;
    const matchAud = audience === 'All Stages' || r.audience?.includes(audience) || r.audience?.includes('All Stages');
    return matchSearch && matchCat && matchAud;
  });

  return (
    <div className="min-h-screen bg-muted/20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-3">
            Resource Navigator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every Utah startup resource, program, and opportunity — curated, verified, and searchable.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 mb-8 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <select value={audience} onChange={e => setAudience(e.target.value)}
            className="text-sm border border-border rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
            {audienceFilters.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                category === c ? 'bg-primary text-white shadow-sm' : 'bg-white border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-5">{filtered.length} resource{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filtered.map((r, i) => {
            const Icon = categoryIcons[r.category] || BookOpen;
            return (
              <div key={r.id || i} className="bg-white rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${categoryColors[r.category] || 'bg-muted text-muted-foreground'}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[r.category] || 'bg-muted text-muted-foreground'}`}>
                    {r.category}
                  </span>
                </div>
                <h3 className="font-manrope font-bold text-base text-foreground mb-1">{r.title}</h3>
                <p className="text-xs text-primary font-medium mb-2">{r.provider}</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{r.description}</p>

                {r.tags && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {r.tags.map(t => (
                      <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}

                <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                  <Button variant="outline" size="sm" className="w-full gap-2 border-primary/30 text-primary hover:bg-green-pale font-semibold">
                    Visit Resource <ExternalLink size={13} />
                  </Button>
                </a>
              </div>
            );
          })}
        </div>

        {/* AI Advisor CTA */}
        <div className="bg-primary rounded-3xl p-8 text-center mb-12">
          <h2 className="font-manrope font-extrabold text-2xl text-white mb-2">Not sure where to start?</h2>
          <p className="text-white/80 mb-6">Let our AI Advisor find the right resources for your specific situation.</p>
          <Link to="/advisor">
            <Button className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8">
              Talk to AI Advisor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}