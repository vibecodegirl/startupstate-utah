import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    title: "Start Building in Utah",
    subtitle: 'Startup Capital of the World',
    description: 'Utah is the #1 best state to start a business. Get personalized resources, funding, and mentorship — or explore why thousands of founders are choosing Utah.',
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
    <section className="relative py-20 bg-gradient-to-br from-green-dark via-primary to-green-mid text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img src="https://startup.utah.gov/wp-content/uploads/asset-1@3x.webp" alt="SLC" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
          <Award size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">{slide.subtitle}</span>
        </div>
        <h1 className="font-manrope font-extrabold text-5xl sm:text-6xl mb-6 leading-tight">
          {slide.title}
        </h1>
        <p className="text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
          {slide.description}
        </p>
      </div>
    </section>
  );
}