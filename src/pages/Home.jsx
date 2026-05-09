import HeroSection from '@/components/home/HeroSection';
import JourneyCards from '@/components/home/JourneyCards';
import PersonaSelector from '@/components/home/PersonaSelector';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home({ role }) {
  return (
    <div className="min-h-screen">
      <HeroSection role={role} />
      <JourneyCards />

      {/* Quiz Highlight */}
      <section className="bg-gradient-to-r from-primary/10 to-green-pale/20 py-16 border-y border-green-pale">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">New Feature</span>
          </div>
          <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-foreground mb-3">Find Resources That Match Your Needs</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Take our quick 3-question quiz to get personalized recommendations from Utah's startup ecosystem tailored to your stage, sector, and challenges.
          </p>
          <Link to="/resources">
            <Button size="lg" className="bg-primary text-white hover:bg-green-dark font-manrope font-bold px-8 gap-2">
              Try the Resource Quiz <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <PersonaSelector />

      {/* CTA Strip */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Ready to put your startup on the map?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of Utah founders already building the future here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/add-startup">
              <Button size="lg" className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8 gap-2">
                <MapPin size={18} /> Add Your Startup
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('openAdvisor'))} className="border-white/40 text-white hover:bg-white/10 font-manrope font-semibold px-8 gap-2">
              <Sparkles size={16} /> Talk to AI Advisor
            </Button>
          </div>
        </div>
      </section>

      {/* GOEO Attribution */}
      <section className="py-10 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <img
            src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/25e11e655_GOEO_BLACK_Standard_Web.webp"
            alt="Governor's Office of Economic Opportunity"
            className="h-10 w-auto opacity-80"
          />
          <div className="hidden sm:block w-px h-10 bg-border" />
          <p className="text-sm text-muted-foreground max-w-sm">
            The Startup State Initiative is a program of Utah's Governor's Office of Economic Opportunity, celebrating and empowering entrepreneurs statewide.
          </p>
        </div>
      </section>
    </div>
  );
}