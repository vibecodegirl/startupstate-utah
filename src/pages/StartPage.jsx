import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileText, DollarSign, Users, Building, Globe, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: '01',
    title: 'Develop Your Idea',
    description: 'Validate your concept with real customers. Use the Utah SBDC\'s free business planning resources and the University of Utah\'s I-Corps program.',
    icon: Lightbulb,
    resources: ['Utah SBDC Free Consulting', 'NSF I-Corps', 'Business Plan Builder — startup.utah.gov'],
    link: 'https://startup.utah.gov/business-plan/',
  },
  {
    number: '02',
    title: 'Register Your Business',
    description: 'Choose your business structure (LLC, Corp, Sole Prop) and register with the Utah Division of Corporations.',
    icon: FileText,
    resources: ['Utah Division of Corporations', 'IRS EIN Registration', 'Utah Business One Stop'],
    link: 'https://corporations.utah.gov',
  },
  {
    number: '03',
    title: 'Secure Initial Funding',
    description: 'From bootstrapping to pre-seed grants, explore Utah\'s funding options for early-stage founders.',
    icon: DollarSign,
    resources: ['SBIR Phase 0 Grants', 'Utah Microloan Programs', 'Angel Investor Networks'],
    link: '/funding',
  },
  {
    number: '04',
    title: 'Build Your Team',
    description: 'Hire Utah\'s top talent from BYU, U of U, and Utah State. Access workforce development programs.',
    icon: Users,
    resources: ['Silicon Slopes Job Board', 'Utah Department of Workforce Services', 'University Recruiting'],
    link: 'https://siliconslopes.com/jobs',
  },
  {
    number: '05',
    title: 'Find Your Space',
    description: 'Utah has world-class coworking, accelerators, and affordable office space across the Wasatch Front.',
    icon: Building,
    resources: ['Silicon Slopes Coworking', 'BioInnovations Gateway (Life Sciences)', 'University Research Park'],
    link: '/resources',
  },
  {
    number: '06',
    title: 'Go to Market',
    description: 'Access sales resources, mentorship networks, and growth-stage support to scale your business.',
    icon: Globe,
    resources: ['Startup State Resource Navigator', 'Utah Angels Network', 'GOED Export Programs'],
    link: '/resources',
  },
];

export default function StartPage() {
  return (
    <div className="min-h-screen pt-24 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <CheckCircle size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Step-by-Step Guide</span>
          </div>
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
            Starting a Business in Utah
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Your comprehensive roadmap — from idea to launch — with Utah-specific resources at every step.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative flex gap-6">
                  {/* Number */}
                  <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-primary text-white font-manrope font-black text-xl items-center justify-center z-10 shadow-lg shadow-primary/20">
                    {step.number}
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl border border-border p-6 shadow-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="md:hidden w-8 h-8 rounded-lg bg-primary text-white font-manrope font-black text-sm flex items-center justify-center shrink-0">
                        {step.number}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-primary" />
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

                    <a href={step.link.startsWith('http') ? step.link : step.link} target={step.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-green-pale font-semibold">
                        Learn More <ArrowRight size={14} />
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI CTA */}
        <div className="mt-16 bg-primary rounded-3xl p-8 text-center mb-12">
          <h2 className="font-manrope font-extrabold text-2xl text-white mb-2">Have questions about your specific situation?</h2>
          <p className="text-white/80 mb-6">Our AI Advisor can give you personalized guidance based on your stage, sector, and location.</p>
          <Link to="/advisor">
            <Button className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8">
              Talk to AI Advisor <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}