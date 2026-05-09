import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ParticleBackground from './ParticleBackground';

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.CarouselItem.list('-display_order', 50)
      .then(items => {
        const activeSlides = items.filter(item => item.is_active).sort((a, b) => a.display_order - b.display_order);
        setSlides(activeSlides.length > 0 ? activeSlides : [getDefaultSlide()]);
        setLoading(false);
      })
      .catch(() => {
        setSlides([getDefaultSlide()]);
        setLoading(false);
      });
  }, []);

  const getDefaultSlide = () => ({
    id: 'default',
    title: "Utah's Thriving Ecosystem",
    subtitle: 'Startup Capital of the World',
    description: 'Be a part of Utah\'s startup scene. Start, grow, and build your business with the resources, connections, and capital you need — all in one place.',
    media_type: 'particles',
    cta_text: 'Explore the Map',
    cta_link: '/map',
  });

  const goToSlide = (index) => {
    setCurrentIndex((index + slides.length) % slides.length);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-pale to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const slide = slides[currentIndex];

  const getSlideColors = () => {
    if (!slide || slides.length === 0) return { bg: 'bg-white', accent: 'bg-primary', label: 'text-primary', stat: 'text-primary' };
    const index = slides.findIndex(s => s.id === slide.id);
    const colors = [
      { bg: 'bg-gradient-to-b from-green-pale to-white', accent: 'bg-primary', label: 'text-primary', stat: 'text-primary', border: 'border-primary/20' },
      { bg: 'bg-gradient-to-b from-blue-50 to-white', accent: 'bg-blue-600', label: 'text-blue-600', stat: 'text-blue-600', border: 'border-blue-200' },
      { bg: 'bg-gradient-to-b from-purple-50 to-white', accent: 'bg-purple-600', label: 'text-purple-600', stat: 'text-purple-600', border: 'border-purple-200' },
      { bg: 'bg-gradient-to-b from-orange-50 to-white', accent: 'bg-orange-600', label: 'text-orange-600', stat: 'text-orange-600', border: 'border-orange-200' },
    ];
    return colors[index % colors.length];
  };

  const colors = getSlideColors();

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${colors.bg}`}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {slide.subtitle && (
              <div className={`inline-flex items-center gap-2 ${colors.accent}/10 border ${colors.border} rounded-full px-4 py-1.5 w-fit`}>
                <span className={`text-xs font-semibold ${colors.label} uppercase tracking-wider`}>{slide.subtitle}</span>
              </div>
            )}

            <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl text-foreground leading-tight">
              {slide.title}
            </h1>

            {slide.description && (
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                {slide.description}
              </p>
            )}

            {/* CTA Button */}
            <div>
              <Link to={slide.cta_link || '/'}>
                <Button size="lg" className={`${colors.accent} text-white hover:opacity-90 font-manrope font-bold px-8 py-3 text-base rounded-xl transition-all`}>
                  {slide.cta_text || 'Learn More'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '3,500+', label: 'Startups' },
              { value: '$4.2B+', label: 'VC Invested' },
              { value: '#1', label: 'Best State' },
              { value: '45+', label: 'Accelerators' },
            ].map((stat) => (
              <div key={stat.label} className={`bg-white border ${colors.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                <div className={`font-manrope font-extrabold text-3xl ${colors.stat}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border ${colors.border} bg-white hover:${colors.accent}/10 text-foreground transition-all`}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border ${colors.border} bg-white hover:${colors.accent}/10 text-foreground transition-all`}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? `${colors.accent} w-8`
                    : 'bg-border w-2 hover:bg-muted-foreground'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className={`w-6 h-10 border-2 rounded-full flex items-start justify-center pt-2`} style={{ borderColor: colors.accent.replace('bg-', '') + '/30' }}>
          <div className={`w-1.5 h-3 rounded-full animate-pulse-gentle`} style={{ backgroundColor: colors.accent.replace('bg-', '') + '/30' }} />
        </div>
      </div>
    </section>
  );
}