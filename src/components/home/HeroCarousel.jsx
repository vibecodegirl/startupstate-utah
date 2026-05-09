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
    title: "Start Building Your Startup Today",
    subtitle: 'Get Personalized Guidance for Utah Founders',
    description: 'Find exactly what you need right now — from funding and mentorship to legal guidance and talent. Take our quick resource quiz and get matched with Utah\'s best startup support.',
    media_type: 'particles',
    cta_text: 'Take the Quiz',
    cta_link: '/resources?quiz=1',
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      {slide.media_type === 'particles' ? (
        <div className={`absolute inset-0 ${colors.bg}`} />
      ) : slide.media_type === 'video' ? (
        <video
          src={slide.image_url}
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : slide.image_url ? (
        <img
          src={slide.image_url}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 ${colors.bg}`} />
      )}

      {/* Overlay - gradient with stronger coverage on left for text */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />

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

            <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl text-foreground leading-tight drop-shadow-lg">
              {slide.title}
            </h1>

            {slide.description && (
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed drop-shadow">
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

          {/* Right: Action Steps */}
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colors.accent}/10 shrink-0`}>
                  <span className={`text-sm font-bold ${colors.stat}`}>1</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Answer 3 Questions</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Tell us about your stage, sector, and needs</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colors.accent}/10 shrink-0`}>
                  <span className={`text-sm font-bold ${colors.stat}`}>2</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Get Matched Resources</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Curated Utah support tailored to you</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colors.accent}/10 shrink-0`}>
                  <span className={`text-sm font-bold ${colors.stat}`}>3</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Connect & Launch</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Explore mentors, funding, and your network</div>
                </div>
              </div>
            </div>
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
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-foreground/20 rounded-full animate-pulse-gentle" />
        </div>
      </div>
    </section>
  );
}