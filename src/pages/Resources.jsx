import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, ExternalLink, BookOpen, DollarSign, Users, Briefcase, Globe, GraduationCap, Building, Grid3X3, List, Table2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourcesQuiz from '@/components/quiz/ResourcesQuiz';

const UTAH_RESOURCES = [
  {
    title: '2026 State of Innovation Report — Utah',
    category: 'Government',
    description: 'Utah\'s annual innovation report by the Nucleus Institute. Highlights Utah\'s #1 economic outlook (19 consecutive years), $315B+ GDP, $1.96B in VC deal activity, patent rankings, SBIR/STTR data, and sector-by-sector innovation initiatives.',
    url: 'https://static1.squarespace.com/static/681936f274ae5b3fa16b8c1d/t/69f24e12f852ba0db0f17e4a/1777487378569/2026StateofInnovationRrpot_WebsiteVers.pdf',
    provider: 'Nucleus Institute',
    audience: ['All Stages'],
    sectors: ['All Sectors'],
    tags: ['2026', 'report', 'data', 'innovation', 'official'],
  },
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
  'Funding': { badge: 'bg-purple-50 text-purple-600', icon: 'bg-purple-50 text-purple-500', dot: 'bg-purple-400' },
  'Mentorship': { badge: 'bg-blue-50 text-blue-600', icon: 'bg-blue-50 text-blue-500', dot: 'bg-blue-400' },
  'Government': { badge: 'bg-emerald-50 text-emerald-600', icon: 'bg-emerald-50 text-emerald-500', dot: 'bg-emerald-400' },
  'Education': { badge: 'bg-orange-50 text-orange-600', icon: 'bg-orange-50 text-orange-500', dot: 'bg-orange-400' },
  'Networking': { badge: 'bg-pink-50 text-pink-600', icon: 'bg-pink-50 text-pink-500', dot: 'bg-pink-400' },
  'International': { badge: 'bg-cyan-50 text-cyan-600', icon: 'bg-cyan-50 text-cyan-500', dot: 'bg-cyan-400' },
  'Accelerator': { badge: 'bg-yellow-50 text-yellow-600', icon: 'bg-yellow-50 text-yellow-500', dot: 'bg-yellow-400' },
};

const categories = ['All', 'Funding', 'Mentorship', 'Government', 'Education', 'Networking', 'International'];
const audienceFilters = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];

export default function Resources() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [audience, setAudience] = useState('All Stages');
  const [view, setView] = useState('grid');
  const [showQuiz, setShowQuiz] = useState(searchParams.get('quiz') === '1');
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [dbResources, setDbResources] = useState([]);

  useEffect(() => {
    base44.entities.Resource.list('-created_date', 100).then(setDbResources).catch(() => {});
  }, []);

  const allResources = [...UTAH_RESOURCES, ...dbResources];

  const applyQuizFilters = (resources) => {
    if (!quizAnswers) return resources;
    return resources.filter(r => {
      const categoryMap = {
        'Finding capital': ['Funding'],
        'Building a team': ['Workforce Development', 'Networking'],
        'Mentorship & guidance': ['Mentorship', 'Education'],
        'Networking & partnerships': ['Networking', 'Entrepreneurship Communities'],
        'Legal & compliance': ['Legal', 'Government'],
      };
      const relevantCategories = categoryMap[quizAnswers.challenge] || [];
      const matchChallenge = relevantCategories.length === 0 || relevantCategories.includes(r.category);
      return matchChallenge;
    });
  };

  const filtered = applyQuizFilters(allResources).filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || r.category === category;
    const matchAud = audience === 'All Stages' || r.audience?.includes(audience) || r.audience?.includes('All Stages');
    return matchSearch && matchCat && matchAud;
  });

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-manrope font-extrabold text-5xl text-foreground mb-0">
            Resource Navigator
          </h1>
        </div>

        {/* Quiz */}
        {showQuiz ? (
          <div className="mb-10">
            <ResourcesQuiz
              onComplete={(answers) => { setQuizAnswers(answers); setShowQuiz(false); }}
              onSkip={() => setShowQuiz(false)}
            />
          </div>
        ) : quizAnswers ? (
          <div className="bg-green-pale border border-primary/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="text-sm">
              <p className="font-semibold text-green-dark">Resources filtered by your answers</p>
              <p className="text-xs text-muted-foreground">Showing resources relevant to your {quizAnswers.stage} stage {quizAnswers.sector} company</p>
            </div>
            <button onClick={() => setQuizAnswers(null)} className="p-1.5 hover:bg-white/50 rounded-lg transition-colors">
              <X size={16} className="text-primary" />
            </button>
          </div>
        ) : (
          <div className="text-center mb-6">
            <button onClick={() => setShowQuiz(true)} className="text-sm text-primary font-semibold hover:underline">
              Take a quick 3-question quiz to personalize your results →
            </button>
          </div>
        )}

        {/* Search + Audience + View row */}
        <div className="flex gap-3 mb-6 items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white placeholder-gray-400"
            />
          </div>
          <select
            value={audience}
            onChange={e => setAudience(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 min-w-32"
          >
            {audienceFilters.map(a => <option key={a}>{a}</option>)}
          </select>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            {[
              { id: 'grid', icon: Grid3X3, label: 'Grid' },
              { id: 'list', icon: List, label: 'List' },
              { id: 'table', icon: Table2, label: 'Table' }
            ].map(v => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  title={v.label}
                  className={`p-2 transition-colors ${view === v.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                category === c
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 mb-6">{filtered.length} resource{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Grid View */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {filtered.map((r, i) => {
              const Icon = categoryIcons[r.category] || BookOpen;
              const colors = categoryColors[r.category] || { badge: 'bg-gray-50 text-gray-500', icon: 'bg-gray-50 text-gray-400', dot: 'bg-gray-300' };
              return (
                <div
                  key={r.id || i}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.icon}`}>
                      <Icon size={15} />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                      {r.category}
                    </span>
                  </div>
                  <h3 className="font-manrope font-bold text-sm text-gray-900 mb-1 leading-snug">{r.title}</h3>
                  <p className="text-xs text-primary font-medium mb-2">{r.provider}</p>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-3 line-clamp-3">{r.description}</p>
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {r.tags.map(t => (
                        <span key={t} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary transition-colors group">
                      Visit Resource
                      <ExternalLink size={11} className="group-hover:text-primary" />
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="space-y-3 mb-16">
            {filtered.map((r, i) => {
              const Icon = categoryIcons[r.category] || BookOpen;
              const colors = categoryColors[r.category] || { badge: 'bg-gray-50 text-gray-500', icon: 'bg-gray-50 text-gray-400' };
              return (
                <div
                  key={r.id || i}
                  className="bg-white rounded-lg border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200 flex items-start gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.icon}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-manrope font-bold text-sm text-gray-900">{r.title}</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${colors.badge}`}>
                        {r.category}
                      </span>
                    </div>
                    <p className="text-xs text-primary font-medium mb-1">{r.provider}</p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{r.description}</p>
                    <div className="flex items-center justify-between">
                      {r.tags && r.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {r.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                              {t}
                            </span>
                          ))}
                          {r.tags.length > 2 && <span className="text-xs text-gray-400">+{r.tags.length - 2}</span>}
                        </div>
                      )}
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        <button className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary transition-colors">
                          Visit
                          <ExternalLink size={10} />
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {view === 'table' && (
          <div className="overflow-x-auto mb-16">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Resource</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Provider</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                    <td className="px-4 py-3 text-gray-600">{r.category}</td>
                    <td className="px-4 py-3 text-gray-600">{r.provider}</td>
                    <td className="px-4 py-3 text-gray-500 line-clamp-2">{r.description}</td>
                    <td className="px-4 py-3 text-center">
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        <button className="text-primary hover:text-primary/80 transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AI Advisor CTA */}
        <div className="bg-primary rounded-2xl p-10 text-center mb-16">
          <h2 className="font-manrope font-bold text-xl text-white mb-2">Not sure where to start?</h2>
          <p className="text-white/75 text-sm mb-6">Let our AI Advisor find the right resources for your specific situation.</p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))}
            className="bg-white text-primary font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-green-pale transition-colors"
          >
            Talk to AI Advisor
          </button>
        </div>
      </div>
    </div>
  );
}