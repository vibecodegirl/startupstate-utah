import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, TrendingUp, DollarSign, Users } from 'lucide-react';

const journeys = [
  {
    icon: Rocket,
    title: 'Starting a Business',
    subtitle: 'New Business Steps',
    href: '/start',
    image: 'https://startup.utah.gov/wp-content/uploads/thinking-image-1.webp',
    color: 'from-green-primary/10 to-transparent',
    tag: 'For New Founders',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    subtitle: 'Explore Resources',
    href: '/resources',
    image: 'https://startup.utah.gov/wp-content/uploads/starting-idea_1.webp',
    color: 'from-blue-500/10 to-transparent',
    tag: 'Scaling Stage',
  },
  {
    icon: DollarSign,
    title: 'Get Funding',
    subtitle: 'Funding Opportunities',
    href: '/funding',
    image: 'https://startup.utah.gov/wp-content/uploads/growing-image-1.webp',
    color: 'from-purple-500/10 to-transparent',
    tag: 'Raise Capital',
  },
  {
    icon: Users,
    title: 'Build Connections',
    subtitle: 'Find Events',
    href: '/events',
    image: 'https://startup.utah.gov/wp-content/uploads/sell-exit-image-1.webp',
    color: 'from-orange-500/10 to-transparent',
    tag: 'Network',
  },
];

export default function JourneyCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="font-manrope font-extrabold text-4xl text-foreground mb-3">Your Path Forward</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Wherever you are in your entrepreneurial journey, we have the resources to take you further.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {journeys.map((j) => {
          const Icon = j.icon;
          return (
            <Link
              key={j.href}
              to={j.href}
              className="group relative bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={j.image}
                  alt={j.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-xs font-semibold text-primary bg-green-pale px-2 py-0.5 rounded-full">{j.tag}</span>
                <h3 className="font-manrope font-bold text-lg mt-2 mb-1 text-foreground">{j.title}</h3>
                <div className="flex items-center gap-1 text-sm text-primary font-medium">
                  {j.subtitle} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}