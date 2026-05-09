import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const slides = [
  {
    type: 'image',
    title: 'Build Your Startup',
    subtitle: 'Access funding, mentorship, and resources tailored for Utah founders',
    image: 'https://startup.utah.gov/wp-content/uploads/starting-idea_1.webp',
    cta: { label: 'Start Your Journey', href: '/start' },
    gradient: 'from-primary/40 to-primary/20',
  },
  {
    type: 'image',
    title: 'Find Investment Opportunities',
    subtitle: 'Discover 3,500+ innovative startups across Utah',
    image: 'https://business.utah.gov/wp-content/uploads/2024/01/shutterstock_1024766865-1-scaled.jpg',
    cta: { label: 'Explore Startups', href: '/map' },
    gradient: 'from-blue-500/40 to-blue-500/20',
  },
  {
    type: 'image',
    title: 'Support the Ecosystem',
    subtitle: 'Mentor, advise, or invest in Utah\'s next generation of innovators',
    image: 'https://startup.utah.gov/wp-content/uploads/growing-image-1.webp',
    cta: { label: 'Learn More', href: '/why-utah' },
    gradient: 'from-purple-500/40 to-purple-500/20',
  },
  {
    type: 'video',
    title: 'See Utah\'s Innovation in Action',
    subtitle: 'Explore the map of Utah\'s startups and entrepreneurs transforming industries',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1',
    cta: { label: 'Explore Map', href: '/map' },
    gradient: 'from-green-primary/40 to-green-primary/20',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const goToSlide = (index) => {
    setCurrent(index);
    setAutoplay(false);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setAutoplay(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoplay(false);
  };

  const slide = slides[current];

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl shadow-xl">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        {slide.type === 'image' ? (
          <>
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/40" />
            <iframe
              src={slide.video}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen"
              title={slide.title}
            />
          </>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-2xl">
            <h2 className="font-manrope font-extrabold text-4xl sm:text-5xl mb-4 leading-tight">
              {slide.title}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8">{slide.subtitle}</p>
            <Link to={slide.cta.href}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-green-pale font-manrope font-bold px-8 gap-2 rounded-xl shadow-lg"
              >
                {slide.cta.label} <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              current === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Hover to pause */}
      <div
        className="absolute inset-0 z-10"
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      />
    </div>
  );
}