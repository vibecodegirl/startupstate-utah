import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle, BookOpen, ExternalLink, X, ChevronLeft, Rocket, Users, TrendingUp, Zap, Globe, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stageTagConfig = {
  'Idea / Pre-Seed': { label: 'Building Foundation', icon: '🏗️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Seed': { label: 'Early Growth', icon: '🌱', color: 'bg-green-50 text-green-700 border-green-200' },
  'Series A': { label: 'Scaling Up', icon: '📈', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Series B': { label: 'Venture-Ready', icon: '🚀', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  'Series B+': { label: 'Growth Stage', icon: '🎯', color: 'bg-red-50 text-red-700 border-red-200' },
  'Bootstrapped': { label: 'Self-Funded', icon: '💪', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
};

const recommendedStepsByProfile = {
  'Idea / Pre-Seed': [
    { number: '01', title: 'Develop Your Idea', description: 'Validate your concept with real customers. Use the Utah SBDC\'s free business planning resources and the University of Utah\'s I-Corps program.', resources: ['Utah SBDC Free Consulting', 'NSF I-Corps', 'Business Plan Builder'], icon: Rocket },
    { number: '02', title: 'Register Your Business', description: 'Choose your business structure (LLC, Corp, Sole Prop) and register with the Utah Division of Corporations.', resources: ['Utah Division of Corporations', 'IRS EIN Registration', 'Utah Business One Stop'], icon: Building },
    { number: '03', title: 'Secure Initial Funding', description: 'From bootstrapping to pre-seed grants, explore Utah\'s funding options for early-stage founders.', resources: ['SBIR Phase 0 Grants', 'Utah Microloan Programs', 'Angel Investor Networks'], icon: TrendingUp },
    { number: '04', title: 'Build Your Team', description: 'Hire Utah\'s top talent from BYU, U of U, and Utah State. Access workforce development programs.', resources: ['Silicon Slopes Job Board', 'Utah Department of Workforce Services', 'University Recruiting'], icon: Users },
  ],
  'Seed': [
    { number: '01', title: 'Refine Product-Market Fit', description: 'Validate your business model with paying customers. Leverage Utah SBDC mentoring and university resources.', resources: ['Utah SBDC Consulting', 'Startup Metrics Workshop', 'Customer Discovery Programs'], icon: Zap },
    { number: '02', title: 'Build Your Team', description: 'Scale hiring to 2-10 employees. Access Utah\'s talent network and workforce development programs.', resources: ['Silicon Slopes Job Board', 'Utah Tech Talent Network', 'BYU & U of U Career Services'], icon: Users },
    { number: '03', title: 'Raise Seed Funding', description: 'Explore angel investors, micro-VCs, and seed grants. Utah Angels Network and SBIR Phase I programs are key.', resources: ['Utah Angels Network', 'SBIR Phase I Grants', 'Kickstart Fund', 'Seed VC Networks'], icon: TrendingUp },
    { number: '04', title: 'Establish Your Space', description: 'Find affordable coworking or office space. Utah has excellent options across the Wasatch Front.', resources: ['Silicon Slopes Coworking', 'BioInnovations Gateway', 'University Research Park', 'Local Startup Hubs'], icon: Building },
  ],
  'Series A': [
    { number: '01', title: 'Prepare your pitch deck', description: 'Polish your deck with metrics that matter: ARR, growth rate, CAC/LTV, and market size.', resources: ['Investor Pitch Coaching', 'Financial Planning Services', 'Pitch Deck Templates'], icon: Rocket },
    { number: '02', title: 'Connect with Utah angel groups', description: 'Utah Angels, Kickstart Fund, and the Silicon Slopes investor network are active in SaaS deals.', resources: ['Utah Angels Network', 'Kickstart Fund', 'Silicon Slopes Investor Network'], icon: Users },
    { number: '03', title: 'Enter pitch competitions', description: 'Utah\'s pitch events (Silicon Slopes, UVEF) get you in front of investors and sharpen your story.', resources: ['Silicon Slopes Pitch Events', 'UVEF Competitions', 'Demo Days'], icon: Zap },
    { number: '04', title: 'Go to Market', description: 'Execute sales and marketing strategy. Access Utah\'s growth-stage support networks.', resources: ['Sales & Growth Mentorship', 'Market Research Resources', 'GOED Growth Programs'], icon: Globe },
  ],
  'Series B': [
    { number: '01', title: 'Scale Operations', description: 'Expand your team to 50+ employees. Build departments for product, sales, and operations.', resources: ['Utah Talent Networks', 'Executive Recruiting Firms', 'BYU / U of U Partnerships'], icon: Users },
    { number: '02', title: 'Connect with Series B VCs', description: 'Utah has active Series B investors. Build relationships with local and regional VC firms.', resources: ['Utah VC Networks', 'Series B VC Firms', 'Investor Relations Consultants'], icon: TrendingUp },
    { number: '03', title: 'Expand Geographically', description: 'Enter new markets. Leverage GOED international trade programs for global expansion.', resources: ['GOED International Trade Program', 'Export Resources', 'International Partner Networks'], icon: Globe },
    { number: '04', title: 'Build Investor Relations', description: 'Maintain investor communication and prepare for future funding rounds.', resources: ['Investor Relations Consultants', 'Series B+ VC Networks', 'CFO Advisory Services'], icon: Building },
  ],
  'Series B+': [
    { number: '01', title: 'Strategic Growth', description: 'Scale operations significantly. Focus on unit economics and international expansion opportunities.', resources: ['Growth Stage VC Networks', 'CFO / COO Services', 'Strategic Consultants'], icon: Rocket },
    { number: '02', title: 'Expand Geographically', description: 'Enter new markets. Leverage GOED international trade programs for global expansion.', resources: ['GOED International Trade Program', 'Export Resources', 'International Partner Networks'], icon: Globe },
    { number: '03', title: 'Build Investor Relations', description: 'Maintain investor communication and prepare for future funding rounds.', resources: ['Investor Relations Consultants', 'Series B+ VC Networks', 'CFO Advisory Services'], icon: Users },
    { number: '04', title: 'Plan for Exit or IPO', description: 'Consider long-term strategic options including acquisition or public markets.', resources: ['M&A Advisors', 'Investment Banking Services', 'Legal / Compliance Partners'], icon: TrendingUp },
  ],
  'Bootstrapped': [
    { number: '01', title: 'Sustainable Growth', description: 'Focus on profitability and cash flow. Leverage free Utah SBDC consulting and mentorship.', resources: ['Utah SBDC Consulting', 'Business Development Resources', 'Cash Flow Planning Tools'], icon: Zap },
    { number: '02', title: 'Access No-Equity Funding', description: 'Explore grants, microloans, and revenue-based financing to fuel growth without giving up equity.', resources: ['Utah Microloan Programs', 'Grants & Non-Dilutive Funding', 'Revenue-Based Financing'], icon: TrendingUp },
    { number: '03', title: 'Build Your Team Efficiently', description: 'Hire strategically and use Utah\'s talent resources to scale your team cost-effectively.', resources: ['Utah Talent Networks', 'Contract / Part-time Resources', 'Internship Programs'], icon: Users },
    { number: '04', title: 'Network & Scale', description: 'Connect with other bootstrapped founders and Utah\'s entrepreneurial community for growth opportunities.', resources: ['Startup State Networking Events', 'Entrepreneur Meetups', 'Silicon Slopes Community'], icon: Globe },
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

  const stageConfig = stageTagConfig[stage] || { label: 'Your Path', icon: '🎯', color: 'bg-primary/10 text-primary border-primary/20' };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to all pathways
        </Link>

        {/* Personalized Header */}
        <div className="bg-gradient-to-r from-green-pale to-white rounded-3xl border border-primary/20 p-8 mb-12">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border ${stageConfig.color}`}>
            <span>{stageConfig.icon}</span> {stageConfig.label}
          </div>
          
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">🚀</div>
            <div className="flex-1">
              <h1 className="font-manrope font-extrabold text-3xl sm:text-4xl text-foreground mb-2">
                I have traction — ready to raise
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                {sector} founder, based in {location}. {stage} stage. {challenge && <>Focused on {challenge.toLowerCase()}.</>}
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Steps */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 mb-4">
            <CheckCircle size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Your Roadmap</span>
          </div>
          
          <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-2">Recommended steps for you</h2>
          <p className="text-muted-foreground text-base mb-8">Follow these steps to move forward — tailored to your stage and situation.</p>

          <div className="relative">
            <div className="absolute left-[18px] top-20 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

            <div className="space-y-6">
              {recommendedSteps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.number} className="relative flex gap-6">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white font-manrope font-black text-sm flex items-center justify-center z-10 shadow-lg shadow-primary/20 flex-shrink-0">
                        {step.number}
                      </div>
                      {idx < recommendedSteps.length - 1 && <div className="hidden md:block w-1 h-12 bg-primary/30 mt-2" />}
                    </div>

                    <div className="flex-1 bg-white rounded-xl border border-border p-6 shadow-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300 mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-pale flex items-center justify-center shrink-0">
                          <StepIcon size={18} className="text-primary" />
                        </div>
                        <h3 className="font-manrope font-bold text-lg text-foreground">{step.title}</h3>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary via-green-mid to-primary rounded-3xl p-10 text-center mb-16">
          <h2 className="font-manrope font-extrabold text-2xl text-white mb-3">Need more guidance?</h2>
          <p className="text-white/85 text-base mb-6 max-w-xl mx-auto">Talk to our AI Advisor for personalized help on fundraising, hiring, and connecting with Utah resources.</p>
          <Button onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8 py-2 text-base">
            Talk to AI Advisor <Zap size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}