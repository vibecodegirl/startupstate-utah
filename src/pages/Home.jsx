import HeroSection from '@/components/home/HeroSection';
import JourneyCards from '@/components/home/JourneyCards';
import PersonaSelector from '@/components/home/PersonaSelector';
import CLEVERBanner from '@/components/home/CLEVERBanner';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home({ role }) {
  return (
    <div className="min-h-screen">
      <HeroSection role={role} />
      <JourneyCards />
      <PersonaSelector />
      <CLEVERBanner />

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
            <Link to="/advisor">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-manrope font-semibold px-8 gap-2">
                <Sparkles size={16} /> Talk to AI Advisor
              </Button>
            </Link>
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