import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhyCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + items.length) % items.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const item = items[currentIndex];
  const Icon = item.icon;

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative min-h-96 bg-white rounded-2xl border border-border p-8 shadow-sm">
        {/* Content */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center mx-auto mb-6">
            <Icon size={24} className="text-primary" />
          </div>
          <h3 className="font-manrope font-bold text-2xl text-foreground mb-3">{item.title}</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border bg-white hover:bg-muted text-foreground transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border bg-white hover:bg-muted text-foreground transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-primary w-8'
                : 'bg-border w-2 hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}