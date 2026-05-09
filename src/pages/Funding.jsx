import { DollarSign, TrendingUp, Users, Globe, ExternalLink, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const fundingCategories = [
  {
    icon: Award,
    title: 'Grants & Non-Dilutive',
    color: 'bg-green-100 text-green-700',
    description: 'Free money — no equity required. Best for early-stage and R&D-heavy startups.',
    sources: [
      { name: 'SBIR/STTR Phase I & II', amount: 'Up to $2M', url: 'https://www.sbir.gov', desc: 'Federal R&D grants for small businesses. Strong for tech, life sciences, and aerospace.' },
      { name: 'Utah SBDC Micro-Grants', amount: 'Up to $10K', url: 'https://utahsbdc.org', desc: 'State-backed micro-grants for early-stage Utah businesses.' },
      { name: 'NSF SBIR', amount: 'Up to $2M', url: 'https://seedfund.nsf.gov', desc: 'National Science Foundation innovation grants for tech startups.' },
      { name: 'Utah Rural Business Development Grant', amount: 'Varies', url: 'https://ruraldevelopment.usda.gov', desc: 'USDA grant for rural Utah businesses (e.g., Washington County).' },
    ],
  },
  {
    icon: Users,
    title: 'Angels & Early-Stage VC',
    color: 'bg-blue-100 text-blue-700',
    description: 'Seed and pre-seed capital from Utah\'s active angel and micro-VC community.',
    sources: [
      { name: 'Kickstart Fund', amount: '$250K–$1M', url: 'https://kickstartfund.com', desc: 'Utah\'s most active seed fund — B2B SaaS, marketplaces, consumer.' },
      { name: 'Utah Angels', amount: '$25K–$250K', url: 'https://utahangels.com', desc: 'Utah\'s premier angel investor network. Monthly pitches in SLC.' },
      { name: 'Cottonwood Heights Angel Fund', amount: '$50K–$500K', url: '#', desc: 'Angel group focused on Utah County and Silicon Slopes startups.' },
      { name: 'Pelion Venture Partners', amount: '$1M–$5M', url: 'https://pelion.vc', desc: 'Provo-based early-stage VC focused on SaaS and tech.' },
    ],
  },
  {
    icon: TrendingUp,
    title: 'Growth Stage VC',
    color: 'bg-purple-100 text-purple-700',
    description: 'Series A and beyond — Utah\'s maturing VC ecosystem for scaling companies.',
    sources: [
      { name: 'Signal Peak Ventures', amount: 'Series A+', url: 'https://signalpeakventures.com', desc: 'Salt Lake City VC focused on B2B software and tech.' },
      { name: 'Album VC', amount: '$2M–$15M', url: 'https://www.album.vc', desc: 'Growth-stage fund for SaaS and consumer tech companies.' },
      { name: 'Sorenson Capital', amount: 'Series B+', url: 'https://www.sorensoncapital.com', desc: 'Utah-based growth equity for established tech companies.' },
      { name: 'Mercato Partners', amount: 'Growth Stage', url: 'https://mercatopartners.com', desc: 'Utah-based private equity and growth capital.' },
    ],
  },
  {
    icon: Globe,
    title: 'Government & International',
    color: 'bg-orange-100 text-orange-700',
    description: 'State, federal, and international funding programs for Utah businesses.',
    sources: [
      { name: 'GOED Economic Development Incentives', amount: 'Varies', url: 'https://business.utah.gov/incentives/', desc: 'Utah state tax credits and incentives for growing businesses.' },
      { name: 'SBA 7(a) Loans', amount: 'Up to $5M', url: 'https://www.sba.gov/funding-programs/loans', desc: 'Federal small business loans with favorable terms.' },
      { name: 'US Export-Import Bank', amount: 'Varies', url: 'https://www.exim.gov', desc: 'Trade financing for Utah companies expanding internationally.' },
      { name: 'Utah World Trade Center', amount: 'Support', url: 'https://www.utahwtc.com', desc: 'International trade assistance and global market entry support.' },
    ],
  },
];

const pitchComps = [
  { name: 'Utah Pitch Competition', organizer: 'Utah SBDC', prize: '$25K+', url: 'https://startup.utah.gov/events/list/?tribe_eventcategory%5B0%5D=343' },
  { name: 'Silicon Slopes Pitch', organizer: 'Silicon Slopes', prize: 'Varies', url: 'https://siliconslopes.com/events' },
  { name: 'BioUtah Pitch Showcase', organizer: 'BioUtah', prize: 'Mentorship + Funding', url: 'https://bioutah.org' },
  { name: 'Utah Valley University Pitch', organizer: 'UVU', prize: 'Up to $15K', url: 'https://www.uvu.edu' },
];

export default function Funding() {
  return (
    <div className="min-h-screen pt-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-3">
            Funding Opportunities
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            From first-check grants to Series B — Utah's full funding landscape, mapped for every stage.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-10 mb-16">
          {fundingCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.title}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h2 className="font-manrope font-bold text-2xl text-foreground">{cat.title}</h2>
                    <p className="text-muted-foreground text-sm">{cat.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.sources.map(s => (
                    <div key={s.name} className="bg-white rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-manrope font-bold text-base text-foreground flex-1">{s.name}</h3>
                        <span className="text-xs font-bold text-primary bg-green-pale px-2 py-0.5 rounded-full ml-2 shrink-0">{s.amount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{s.desc}</p>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-green-pale font-semibold w-full">
                          Learn More <ExternalLink size={12} />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pitch Competitions */}
        <div className="mb-12">
          <h2 className="font-manrope font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
            <Award size={22} className="text-primary" /> Pitch Competitions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pitchComps.map(p => (
              <div key={p.name} className="bg-white rounded-2xl border border-border p-5 text-center hover:border-primary/30 hover:shadow-md transition-all">
                <div className="text-2xl font-manrope font-black text-primary mb-1">{p.prize}</div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{p.organizer}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-green-pale text-xs font-semibold">
                    Apply <ExternalLink size={11} className="ml-1" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* AI CTA */}
        <div className="bg-primary rounded-3xl p-8 text-center mb-12">
          <DollarSign size={32} className="text-white/60 mx-auto mb-3" />
          <h2 className="font-manrope font-extrabold text-2xl text-white mb-2">Not sure which funding is right for you?</h2>
          <p className="text-white/80 mb-6">Our AI Advisor can match you with the best funding based on your stage, sector, and location.</p>
          <Button onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8">
            Get Personalized Funding Advice
          </Button>
        </div>
      </div>
    </div>
  );
}