import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Sparkles, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FounderStories() {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.FounderStory.list('display_order', 50)
      .then(data => {
        const active = data.filter(s => s.is_active);
        setStories(active);
        setLoading(false);
      })
      .catch(() => {
        setStories([]);
        setLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  if (loading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;
  if (stories.length === 0) return null;

  const current = stories[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-green-pale/10 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Founder Testimonials</span>
          </div>
          <h2 className="font-manrope font-extrabold text-3xl text-foreground mb-2">Founders Like You, Thriving in Utah</h2>
          <p className="text-muted-foreground">Real stories. Real wins. Hear directly from Utah founders who've built successful companies.</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="bg-white rounded-3xl border border-border shadow-lg p-8 sm:p-12">
            {/* Testimonial content */}
            <div className="space-y-6">
              {/* Quote icon */}
              <Quote size={32} className="text-primary/20" />

              {/* Story excerpt as testimonial */}
              <div>
                <p className="text-lg sm:text-xl text-foreground font-medium leading-relaxed italic">"{current.story_excerpt}"</p>
              </div>

              {/* Founder info */}
              <div className="border-t border-border pt-6">
                <div className="flex items-start gap-4">
                  {current.photo_url ? (
                    <img src={current.photo_url} alt={current.founder_name} className="w-12 h-12 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-pale flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary text-sm">{current.founder_name[0]}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{current.founder_name}</p>
                    <p className="text-sm text-muted-foreground">{current.company_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">{current.founding_stage_when_featured}</span>
                      {current.key_achievement && (
                        <span className="text-xs text-muted-foreground font-medium">{current.key_achievement}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Story title/headline */}
              <div className="bg-green-pale/30 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-bold text-primary mb-1">Their Journey</p>
                <p className="text-base font-semibold text-foreground">{current.story_title}</p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={prevSlide}
                variant="outline"
                size="icon"
                className="rounded-full border-border hover:border-primary/30"
              >
                <ChevronLeft size={20} />
              </Button>

              <div className="flex gap-2">
                {stories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'bg-primary w-6' : 'bg-muted hover:bg-primary/40'
                    }`}
                    aria-label={`Go to story ${idx + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={nextSlide}
                variant="outline"
                size="icon"
                className="rounded-full border-border hover:border-primary/30"
              >
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Slide counter */}
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground font-medium">
                Story {currentIndex + 1} of {stories.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}