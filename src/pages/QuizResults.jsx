import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle, BookOpen, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const recommendedStepsByProfile = {
  'Idea / Pre-Seed': [
    { number: '01', title: 'Develop Your Idea', description: 'Validate your concept with real customers. Use the Utah SBDC\'s free business planning resources and the University of Utah\'s I-Corps program.', resources: ['Utah SBDC Free Consulting', 'NSF I-Corps', 'Business Plan Builder'] },
    { number: '02', title: 'Register Your Business', description: 'Choose your business structure (LLC, Corp, Sole Prop) and register with the Utah Division of Corporations.', resources: ['Utah Division of Corporations', 'IRS EIN Registration', 'Utah Business One Stop'] },
    { number: '03', title: 'Secure Initial Funding', description: 'From bootstrapping to pre-seed grants, explore Utah\'s funding options for early-stage founders.', resources: ['SBIR Phase 0 Grants', 'Utah Microloan Programs', 'Angel Investor Networks'] },
    { number: '04', title: 'Build Your Team', description: 'Hire Utah\'s top talent from BYU, U of U, and Utah State. Access workforce development programs.', resources: ['Silicon Slopes Job Board', 'Utah Department of Workforce Services', 'University Recruiting'] },
  ],
  'Seed': [
    { number: '01', title: 'Refine Product-Market Fit', description: 'Validate your business model with paying customers. Leverage Utah SBDC mentoring and university resources.', resources: ['Utah SBDC Consulting', 'Startup Metrics Workshop', 'Customer Discovery Programs'] },
    { number: '02', title: 'Build Your Team', description: 'Scale hiring to 2-10 employees. Access Utah\'s talent network and workforce development programs.', resources: ['Silicon Slopes Job Board', 'Utah Tech Talent Network', 'BYU & U of U Career Services'] },
    { number: '03', title: 'Raise Seed Funding', description: 'Explore angel investors, micro-VCs, and seed grants. Utah Angels Network and SBIR Phase I programs are key.', resources: ['Utah Angels Network', 'SBIR Phase I Grants', 'Kickstart Fund', 'Seed VC Networks'] },
    { number: '04', title: 'Establish Your Space', description: 'Find affordable coworking or office space. Utah has excellent options across the Wasatch Front.', resources: ['Silicon Slopes Coworking', 'BioInnovations Gateway', 'University Research Park', 'Local Startup Hubs'] },
  ],
  'Series A': [
    { number: '01', title: 'Scale Operations', description: 'Expand your team to 11-50 employees. Build departments for product, sales, and operations.', resources: ['Utah Talent Networks', 'Executive Recruiting Firms', 'BYU / U of U Partnerships'] },
    { number: '02', title: 'Prepare for Series A Funding', description: 'Refine your pitch deck, financial projections, and investor strategy. Connect with Utah VCs.', resources: ['Utah VC Networks', 'Investor Pitch Coaching', 'Financial Planning Services'] },
    { number: '03', title: 'Expand to Market', description: 'Develop go-to-market strategy. Connect with sales mentors and growth advisors.', resources: ['Sales & Growth Mentorship', 'Market Research Resources', 'Marketing Agencies in Utah'] },
    { number: '04', title: 'Go to Market', description: 'Execute sales and marketing strategy. Access Utah\'s growth-stage support networks.', resources: ['Startup State Resource Navigator', 'Utah Angels Network', 'GOED Growth Programs'] },
  ],
  'Series B+': [
    { number: '01', title: 'Strategic Growth', description: 'Scale operations significantly. Focus on unit economics and international expansion opportunities.', resources: ['Growth Stage VC Networks', 'CFO / COO Services', 'Strategic Consultants'] },
    { number: '02', title: 'Expand Geographically', description: 'Enter new markets. Leverage GOED international trade programs for global expansion.', resources: ['GOED International Trade Program', 'Export Resources', 'International Partner Networks'] },
    { number: '03', title: 'Build Investor Relations', description: 'Maintain investor communication and prepare for future funding rounds.', resources: ['Investor Relations Consultants', 'Series B+ VC Networks', 'CFO Advisory Services'] },
    { number: '04', title: 'Plan for Exit or IPO', description: 'Consider long-term strategic options including acquisition or public markets.', resources: ['M&A Advisors', 'Investment Banking Services', 'Legal / Compliance Partners'] },
  ],
  'Bootstrapped': [
    { number: '01', title: 'Sustainable Growth', description: 'Focus on profitability and cash flow. Leverage free Utah SBDC consulting and mentorship.', resources: ['Utah SBDC Consulting', 'Business Development Resources', 'Cash Flow Planning Tools'] },
    { number: '02', title: 'Access No-Equity Funding', description: 'Explore grants, microloans, and revenue-based financing to fuel growth without giving up equity.', resources: ['Utah Microloan Programs', 'Grants & Non-Dilutive Funding', 'Revenue-Based Financing'] },
    { number: '03', title: 'Build Your Team Efficiently', description: 'Hire strategically and use Utah\'s talent resources to scale your team cost-effectively.', resources: ['Utah Talent Networks', 'Contract / Part-time Resources', 'Internship Programs'] },
    { number: '04', title: 'Network & Scale', description: 'Connect with other bootstrapped founders and Utah\'s entrepreneurial community for growth opportunities.', resources: ['Startup State Networking Events', 'Entrepreneur Meetups', 'Silicon Slopes Community'] },
  ],
};

export default function QuizResults() {
  const [searchParams] = useSearchParams();
  const stage = searchParams.get('stage');
  const sector = searchParams.get('sector');
  const challenge = searchParams.get('challenge');
  const location = searchParams.get('location');
  const community = searchParams.get('community');
  const [showAllResources, setShowAllResources] = useState(false);

  const { data: allResources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list('-created_date', 100),
  });

  const recommendedSteps = useMemo(() => {
    return recommendedStepsByProfile[stage] || [];
  }, [stage]);

  const filteredResources = useMemo(() => {
    return allResources.filter(r => {
      const stageMatch = !stage || r.audience?.includes(stage) || r.audience?.includes('All Stages');
      const sectorMatch = !sector || r.sectors?.includes(sector) || r.sectors?.includes('All Sectors');
      const challengeMatch = !challenge || r.tags?.some(tag => challenge.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(challenge.toLowerCase()));
      return stageMatch && sectorMatch && challengeMatch;
    });
  }, [allResources, stage, sector, challenge]);

  return (
    <div className="min-h-screen pt-24 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <CheckCircle size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Your Personalized Roadmap</span>
          </div>
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
            {stage && sector ? `${stage} ${sector} Founder` : 'Your Startup Journey'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            {challenge && (
              <>Based on your focus on <strong>{challenge}</strong>, here are the recommended next steps tailored to your stage and sector.</>
            )}
          </p>

          {/* Profile tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {stage && <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">{stage}</span>}
            {sector && <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">{sector}</span>}
            {location && <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">{location}</span>}
            {community && community !== 'None of the above' && <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">{community}</span>}
          </div>
        </div>

        {/* Recommended Steps */}
        <div className="relative mb-16">
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

          <div className="space-y-6">
            {recommendedSteps.map((step) => (
              <div key={step.number} className="relative flex gap-6">
                <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-primary text-white font-manrope font-black text-xl items-center justify-center z-10 shadow-lg shadow-primary/20">
                  {step.number}
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-border p-6 shadow-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="md:hidden w-8 h-8 rounded-lg bg-primary text-white font-manrope font-black text-sm flex items-center justify-center shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h2 className="font-manrope font-bold text-xl text-foreground">{step.title}</h2>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Key Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {step.resources.map(r => (
                        <span key={r} className="text-xs bg-green-pale text-green-dark px-3 py-1 rounded-full font-medium border border-primary/20">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Resources */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-manrope font-bold text-2xl text-foreground">Recommended Resources</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllResources(!showAllResources)}
              className="border-primary/30 text-primary hover:bg-green-pale"
            >
              {showAllResources ? 'Show Recommended' : 'View All Resources'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllResources ? allResources : filteredResources).map((r, i) => (
              <a key={r.id || i} href={r.url} target="_blank" rel="noopener noreferrer">
                <div className="bg-white rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {r.category}
                    </span>
                  </div>
                  <h3 className="font-manrope font-bold text-sm text-foreground mb-1 leading-snug">{r.title}</h3>
                  <p className="text-xs text-primary font-medium mb-2">{r.provider}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3 line-clamp-2">{r.description}</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Visit <ExternalLink size={11} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-center mb-12">
          <h2 className="font-manrope font-bold text-xl text-white mb-2">Need personalized guidance?</h2>
          <p className="text-white/80 mb-6">Talk to our AI Advisor for specific questions about your situation.</p>
          <Button onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8">
            Talk to AI Advisor <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}