import { CheckCircle2, Zap, Users, FileText, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const quickWins = [
  {
    icon: FileText,
    title: 'Draft Your Business Plan',
    description: 'Use Utah SBDC\'s free templates to create a one-page business plan. Takes 30 minutes.',
    action: 'Start Now',
    link: 'https://utahsbdc.org',
    time: '30 min',
    impact: 'Foundation for fundraising & hiring',
  },
  {
    icon: DollarSign,
    title: 'Register for a $50K Grant',
    description: 'Utah\'s SBIR Phase 0 program grants up to $50K with zero equity dilution. Application: 1 hour.',
    action: 'Apply',
    link: 'https://www.sbir.gov',
    time: '1 hour',
    impact: 'Immediate capital for R&D',
  },
  {
    icon: Users,
    title: 'Join a Utah Founder Network',
    description: 'Silicon Slopes, Utah Angels, and local founder groups meet weekly. Your first connection could be your co-founder.',
    action: 'Find Events',
    link: '/events',
    time: '2 hours',
    impact: 'Network effect & mentorship',
  },
  {
    icon: Briefcase,
    title: 'Get Free Business Consulting',
    description: 'Utah SBDC offers unlimited 1-on-1 consulting at no cost. Schedule your first session this week.',
    action: 'Book Now',
    link: 'https://utahsbdc.org/consulting',
    time: '1 hour',
    impact: 'Expert guidance on any topic',
  },
  {
    icon: CheckCircle2,
    title: 'Incorporate Your Business',
    description: 'File your LLC with Utah Division of Corporations online in 15 minutes. Cost: $52.',
    action: 'File',
    link: 'https://corporations.utah.gov',
    time: '15 min',
    impact: 'Legal protection & credibility',
  },
  {
    icon: Zap,
    title: 'Validate Your Idea with Customers',
    description: 'Talk to 10 potential customers this week. Use Utah SBDC\'s interview template to get feedback.',
    action: 'Get Template',
    link: 'https://utahsbdc.org',
    time: 'Variable',
    impact: 'De-risk your business model',
  },
];

export default function QuickWins() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Quick Wins</span>
          </div>
          <h2 className="font-manrope font-extrabold text-4xl text-foreground mb-3">Momentum Starts Now</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Pick one and do it today. Real founders don't wait for perfect conditions — they act.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickWins.map((win, idx) => {
            const Icon = win.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-green-pale/30 border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>

                <h3 className="font-manrope font-bold text-base text-foreground mb-2">{win.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{win.description}</p>

                <div className="bg-white/60 border border-primary/10 rounded-lg p-3 mb-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">Time:</span>
                    <span className="font-bold text-foreground">{win.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{win.impact}</div>
                </div>

                {win.link.startsWith('http') ? (
                  <a href={win.link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full bg-primary text-white hover:bg-green-dark font-semibold gap-2">
                      {win.action} <Zap size={12} />
                    </Button>
                  </a>
                ) : (
                  <Link to={win.link}>
                    <Button size="sm" className="w-full bg-primary text-white hover:bg-green-dark font-semibold gap-2">
                      {win.action} <Zap size={12} />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary via-green-mid to-primary rounded-3xl p-10 text-center">
          <h3 className="font-manrope font-extrabold text-2xl text-white mb-3">Not sure which to start with?</h3>
          <p className="text-white/80 mb-6">Our AI Advisor can help you prioritize based on your specific stage and goals.</p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))}
            className="px-8 py-2.5 rounded-lg font-manrope font-bold text-base bg-white text-primary hover:bg-green-pale transition-colors"
          >
            Talk to AI Advisor
          </button>
        </div>
      </div>
    </section>
  );
}