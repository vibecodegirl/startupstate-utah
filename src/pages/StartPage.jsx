import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileText, DollarSign, Users, Building, Globe, Lightbulb, X, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourcesQuiz from '@/components/quiz/ResourcesQuiz';
import QuickWins from '@/components/founders/QuickWins';
import QuickWinActionPanel from '@/components/founders/QuickWinActionPanel';
import FounderStories from '@/components/founders/FounderStories';

const steps = [
  {
    number: '01',
    title: 'Develop Your Idea',
    description: 'Validate your concept with real customers. Use the Utah SBDC\'s free business planning resources and the University of Utah\'s I-Corps program.',
    icon: Lightbulb,
    resources: ['Utah SBDC Free Consulting', 'NSF I-Corps', 'Business Plan Builder — startup.utah.gov'],
    link: 'https://startup.utah.gov/business-plan/',
    isExternal: true,
    relevant_stages: ['Pre-Seed', 'Seed'],
    relevant_sectors: ['All'],
    addresses_challenges: ['Mentorship & guidance', 'Building a team'],
  },
  {
    number: '02',
    title: 'Register Your Business',
    description: 'Choose your business structure (LLC, Corp, Sole Prop) and register with the Utah Division of Corporations.',
    icon: FileText,
    resources: ['Utah Division of Corporations', 'IRS EIN Registration', 'Utah Business One Stop'],
    link: 'https://corporations.utah.gov',
    isExternal: true,
    relevant_stages: ['Pre-Seed', 'Seed'],
    relevant_sectors: ['All'],
    addresses_challenges: ['All'],
  },
  {
    number: '03',
    title: 'Secure Initial Funding',
    description: 'From bootstrapping to pre-seed grants, explore Utah\'s funding options for early-stage founders.',
    icon: DollarSign,
    resources: ['SBIR Phase 0 Grants', 'Utah Microloan Programs', 'Angel Investor Networks'],
    link: '/funding',
    isExternal: false,
    panelTitle: 'Funding Opportunities',
    relevant_stages: ['Pre-Seed', 'Seed', 'Series A'],
    relevant_sectors: ['All'],
    addresses_challenges: ['Finding capital'],
  },
  {
    number: '04',
    title: 'Build Your Team',
    description: 'Hire Utah\'s top talent from BYU, U of U, and Utah State. Access workforce development programs.',
    icon: Users,
    resources: ['Silicon Slopes Job Board', 'Utah Department of Workforce Services', 'University Recruiting'],
    link: 'https://siliconslopes.com/jobs',
    isExternal: true,
    relevant_stages: ['Seed', 'Series A', 'Series B'],
    relevant_sectors: ['All'],
    addresses_challenges: ['Building a team'],
  },
  {
    number: '05',
    title: 'Find Your Space',
    description: 'Utah has world-class coworking, accelerators, and affordable office space across the Wasatch Front.',
    icon: Building,
    resources: ['Silicon Slopes Coworking', 'BioInnovations Gateway (Life Sciences)', 'University Research Park'],
    link: '/resources',
    isExternal: false,
    panelTitle: 'Resource Navigator',
    relevant_stages: ['Pre-Seed', 'Seed', 'Series A'],
    relevant_sectors: ['All'],
    addresses_challenges: ['All'],
  },
  {
    number: '06',
    title: 'Go to Market',
    description: 'Access sales resources, mentorship networks, and growth-stage support to scale your business.',
    icon: Globe,
    resources: ['Startup State Resource Navigator', 'Utah Angels Network', 'GOED Export Programs'],
    link: '/resources',
    isExternal: false,
    panelTitle: 'Resource Navigator',
    relevant_stages: ['Series A', 'Series B', 'Series C', 'Series D+'],
    relevant_sectors: ['All'],
    addresses_challenges: ['Networking & partnerships'],
  },
];

export default function StartPage() {
  const [panel, setPanel] = useState(null); // { title, link }
  const [quizAnswers, setQuizAnswers] = useState(null); // { stage, sector, challenge }
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedWin, setSelectedWin] = useState(null);

  // Filter steps based on quiz answers
  const personalizedSteps = useMemo(() => {
    if (!quizAnswers) return steps;

    return steps.filter(step => {
      const stageMatch = step.relevant_stages.includes(quizAnswers.stage);
      const sectorMatch = step.relevant_sectors.includes('All') || step.relevant_sectors.includes(quizAnswers.sector);
      const challengeMatch = step.addresses_challenges.includes('All') || step.addresses_challenges.includes(quizAnswers.challenge);
      return stageMatch && sectorMatch && challengeMatch;
    }).sort((a, b) => {
      // Prioritize steps that directly address the user's challenge
      const aAddresses = a.addresses_challenges.includes(quizAnswers.challenge);
      const bAddresses = b.addresses_challenges.includes(quizAnswers.challenge);
      if (aAddresses && !bAddresses) return -1;
      if (!aAddresses && bAddresses) return 1;
      return parseInt(a.number) - parseInt(b.number);
    });
  }, [quizAnswers]);

  const handleQuizComplete = (answers) => {
    // Store for auto-populate on profile creation
    sessionStorage.setItem('pendingQuizAnswers', JSON.stringify(answers));
    // Redirect to personalized results page
    const params = new URLSearchParams({
      stage: answers.stage || '',
      sector: answers.sector || '',
      challenge: answers.challenge || '',
      location: answers.location || '',
      community: answers.community || ''
    });
    window.location.href = `/quiz-results?${params.toString()}`;
  };

  const handleLearnMore = (step) => {
    if (step.isExternal) {
      window.open(step.link, '_blank', 'noopener noreferrer');
    } else {
      setPanel({ title: step.panelTitle, link: step.link });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Header with Background */}
      <div className="relative py-20 bg-gradient-to-br from-primary via-green-mid to-green-dark overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm border border-white/30">
            <Lightbulb size={14} className="text-white" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white">Launch Your Journey</span>
          </div>
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Starting a Business in Utah
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Get personalized resources matched to your stage, sector, and goals.
          </p>
          {!showQuiz && (
            <Button 
              onClick={() => setShowQuiz(true)} 
              className="bg-white text-primary hover:bg-green-pale font-semibold gap-2 shadow-lg"
            >
              <Zap size={16} />
              Get Personalized Pathway
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">

        {/* Stage Selection Cards - Show if no quiz answers */}
        {!quizAnswers && !showQuiz && (
          <section className="py-12 mb-8">
            <div className="text-center mb-8">
              <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-2">Choose Your Starting Point</h2>
              <p className="text-muted-foreground">Select your funding stage to see tailored pathways</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Idea / Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series B+', 'Bootstrapped'].map(stage => (
                <button
                  key={stage}
                  onClick={() => handleQuizComplete({ stage, sector: 'All', challenge: 'All', location: '', community: '' })}
                  className="bg-white border-2 border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300 text-left group"
                >
                  <div className="font-manrope font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{stage}</div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {stage === 'Idea / Pre-Seed' && 'Building your foundation'}
                    {stage === 'Seed' && 'Securing initial funding'}
                    {stage === 'Series A' && 'Scaling operations'}
                    {stage === 'Series B' && 'Expanding market reach'}
                    {stage === 'Series B+' && 'Growth acceleration'}
                    {stage === 'Bootstrapped' && 'Self-funded growth'}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View pathway <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Quiz Section - Conditional */}
        {showQuiz && (
          <div className="mb-16">
            <ResourcesQuiz
              onComplete={handleQuizComplete}
              onSkip={() => {
                setShowQuiz(false);
                setQuizAnswers('skipped');
              }}
            />
          </div>
        )}

      {/* Quick Wins - "Momentum Starts Now" directly below quiz */}
      <QuickWins onWinClick={setSelectedWin} />

        {/* Personalized Steps - Only show if quiz completed */}
        {quizAnswers && quizAnswers !== 'skipped' && (
          <section className="py-12 bg-muted/20">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-2">Your Personalized Roadmap</h2>
                <p className="text-muted-foreground">Follow these steps tailored to your {quizAnswers.stage} stage startup.</p>
                <Button
                  onClick={() => setQuizAnswers(null)}
                  variant="outline"
                  className="mt-4 border-primary/30 text-primary hover:bg-green-pale"
                >
                  Retake Quiz
                </Button>
              </div>

              <div className="relative">
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

                <div className="space-y-6">
                  {personalizedSteps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.number} className="relative flex gap-6">
                        <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-primary text-white font-manrope font-black text-xl items-center justify-center z-10 shadow-lg shadow-primary/20">
                          {step.number}
                        </div>

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

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLearnMore(step)}
                            className="gap-2 border-primary/30 text-primary hover:bg-green-pale font-semibold"
                          >
                            Learn More
                            {step.isExternal ? <ExternalLink size={13} /> : <ArrowRight size={14} />}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI CTA */}
              <div className="mt-16 bg-primary rounded-3xl p-8 text-center">
                <h2 className="font-manrope font-extrabold text-2xl text-white mb-2">Have questions about your specific situation?</h2>
                <p className="text-white/80 mb-6">Our AI Advisor can give you personalized guidance based on your stage, sector, and location.</p>
                <Button onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8">
                  Talk to AI Advisor <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Founder Stories Testimonial Carousel */}
        <section className="py-12">
          <FounderStories />
        </section>
      </div>

      {/* Quick Win Action Panel */}
      {selectedWin && <QuickWinActionPanel win={selectedWin} onClose={() => setSelectedWin(null)} />}

      {/* Right Side Panel */}
      {panel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setPanel(null)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
              <h2 className="font-manrope font-bold text-lg text-foreground">{panel.title}</h2>
              <div className="flex items-center gap-2">
                <Link
                  to={panel.link}
                  className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                  onClick={() => setPanel(null)}
                >
                  Open full page <ExternalLink size={12} />
                </Link>
                <button
                  onClick={() => setPanel(null)}
                  className="ml-3 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Embedded content via iframe */}
            <iframe
              key={panel.link}
              src={panel.link}
              className="flex-1 w-full border-none"
              title={panel.title}
            />
          </div>
        </>
      )}
    </div>
  );
}