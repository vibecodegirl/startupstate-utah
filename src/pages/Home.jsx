import { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourcesQuiz from '@/components/quiz/ResourcesQuiz';


const statsAnimationStyle = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const stats = [
  { value: '#1', label: 'Best State to Start a Business', source: 'WalletHub 2023' },
  { value: '3,500+', label: 'Active Startups', source: 'Silicon Slopes' },
  { value: '$4.2B+', label: 'Annual VC Investment', source: 'NVCA' },
  { value: '45+', label: 'Active Accelerators & Incubators', source: 'GOEO' },
  { value: '15%', label: 'Annual Tech Job Growth', source: 'BLS' },
  { value: 'Top 5', label: 'Most Educated Workforce', source: 'US Census' },
];

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="min-h-screen">
      <style>{statsAnimationStyle}</style>
      <HeroSection />

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 -mt-8 relative z-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:scale-105 group cursor-default" style={{
              animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
            }}>
              <div className="font-manrope font-extrabold text-2xl bg-gradient-to-r from-primary to-green-mid bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">{s.value}</div>
              <div className="text-xs text-foreground font-semibold leading-snug mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz Section */}
      {showQuiz ? (
        <section className="relative py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <ResourcesQuiz
              onComplete={(answers) => {
                setShowQuiz(false);
                const params = new URLSearchParams({
                  stage: answers.stage || '',
                  sector: answers.sector || '',
                  challenge: answers.challenge || '',
                  location: answers.location || '',
                  community: answers.community || '',
                });
                window.location.href = `/quiz-results?${params.toString()}`;
              }}
              onSkip={() => setShowQuiz(false)}
            />
          </div>
        </section>
      ) : (
        <section className="relative py-16 border-y border-green-pale overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-green-pale/20 to-primary/10 opacity-60" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(145, 200, 100, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(145, 200, 100, 0.05) 0%, transparent 50%)'
          }} />
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-1.5 mb-6 hover:border-primary/40 transition-colors">
              <Zap size={14} className="text-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Find Your Path</span>
            </div>
            <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-foreground mb-3">Discover Resources That Match Your Journey</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Answer 3 quick questions about your stage, sector, and challenges to get personalized recommendations from Utah's startup ecosystem.
            </p>
            <Button onClick={() => setShowQuiz(true)} size="lg" className="bg-primary text-white hover:bg-green-dark font-manrope font-bold px-8 gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Start the Quiz <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      )}

      {/* CTA Strip */}
      <section className="relative bg-gradient-to-r from-primary via-green-mid to-primary py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Ready to put your startup on the map?
          </h2>
          <p className="text-white/85 text-lg mb-10">
            Join thousands of Utah founders already building the future here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/add-startup">
              <Button size="lg" className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8 gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <MapPin size={18} /> Add Your Startup
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="border-white/60 text-white hover:bg-white/15 font-manrope font-semibold px-8 gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <Sparkles size={16} /> Talk to AI Advisor
            </Button>
          </div>
        </div>
      </section>


    </div>
  );
}