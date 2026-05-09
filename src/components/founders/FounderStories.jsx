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
    <section className="py-12 bg-gradient-to-b from-white via-green-pale/10 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8">
          <h2 className="font-manrope font-extrabold text-2xl text-foreground mb-1">Founders Like You, Thriving in Utah</h2>
          <p className="text-muted-foreground text-sm">Real stories from Utah founders.</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-start gap-4 mb-4">
            {current.photo_url ? (
              <img src={current.photo_url} alt={current.founder_name} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-pale flex items-center justify-center shrink-0">
                <span className="font-bold text-primary text-xs">{current.founder_name[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">{current.founder_name}</p>
              <p className="text-xs text-muted-foreground">{current.company_name} • {current.founding_stage_when_featured}</p>
            </div>
          </div>

          <p className="text-foreground font-medium leading-relaxed italic mb-3 text-sm">"{current.story_excerpt}"</p>

          <p className="text-xs text-primary font-semibold mb-1">{current.story_title}</p>
          {current.key_achievement && (
            <p className="text-xs text-muted-foreground">{current.key_achievement}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <Button onClick={prevSlide} variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft size={16} />
            </Button>
            <div className="flex gap-1.5">
              {stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-primary w-5' : 'bg-muted hover:bg-primary/40 w-1'
                  }`}
                  aria-label={`Go to story ${idx + 1}`}
                />
              ))}
            </div>
            <Button onClick={nextSlide} variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}