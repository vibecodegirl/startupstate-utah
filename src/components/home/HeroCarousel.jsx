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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      {slide.media_type === 'particles' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-white via-green-pale to-white" />
          <ParticleBackground />
        </>
      ) : slide.media_type === 'video' ? (
        <video
          src={slide.image_url}
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={slide.image_url}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        {slide.subtitle && (
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm animate-fade-in">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">{slide.subtitle}</span>
          </div>
        )}

        <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-fade-up drop-shadow-lg">
          {slide.title}
        </h1>

        {slide.description && (
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-inter font-light leading-relaxed animate-fade-up drop-shadow">
            {slide.description}
          </p>
        )}

        {/* CTA Button */}
        <div className="mb-6 animate-fade-up">
          <Link to={slide.cta_link || '/'}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-green-dark font-manrope font-bold px-8 py-3 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              {slide.cta_text || 'Learn More'}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-up">
          {[
            { value: '3,500+', label: 'Startups' },
            { value: '$4.2B+', label: 'VC Invested' },
            { value: '#1', label: 'Best State' },
            { value: '45+', label: 'Accelerators' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="font-manrope font-extrabold text-3xl text-white drop-shadow">{stat.value}</div>
              <div className="text-xs text-white/70 font-medium mt-1 drop-shadow">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
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
                    ? 'bg-white w-8'
                    : 'bg-white/50 w-2 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse-gentle" />
        </div>
      </div>
    </section>
  );
}