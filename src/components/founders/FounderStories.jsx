import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FounderStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.FounderStory.list('-display_order', 6)
      .then(data => {
        setStories(data.filter(s => s.is_active));
        setLoading(false);
      })
      .catch(() => {
        setStories([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <section className="py-20 bg-gradient-to-b from-white via-green-pale/20 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Utah Success Stories</span>
          </div>
          <h2 className="font-manrope font-extrabold text-4xl text-foreground mb-3">Founders Like You, Thriving in Utah</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See how Utah-based founders went from idea to impact. Real stories, real wins, real momentum.</p>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No stories yet — check back soon for founder spotlights.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden group flex flex-col"
              >
                {/* Header with logo/photo */}
                <div className="relative h-40 bg-gradient-to-br from-primary/10 to-green-pale/20 overflow-hidden">
                  {story.company_logo_url ? (
                    <img src={story.company_logo_url} alt={story.company_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TrendingUp size={40} className="text-primary/20" />
                    </div>
                  )}
                  {story.founding_stage_when_featured && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">{story.founding_stage_when_featured}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-3">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{story.founder_name}</p>
                    <h3 className="font-manrope font-bold text-lg text-foreground mb-1">{story.company_name}</h3>
                    <p className="text-sm font-semibold text-foreground">{story.story_title}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{story.story_excerpt}</p>

                  {story.key_achievement && (
                    <div className="bg-green-pale/50 border border-primary/20 rounded-lg p-3 mb-4">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Key Win</p>
                      <p className="text-sm font-semibold text-foreground">{story.key_achievement}</p>
                    </div>
                  )}

                  {story.full_story && (
                    <Button variant="ghost" size="sm" className="w-full gap-1 text-primary hover:bg-green-pale group/btn justify-between px-0">
                      Read Full Story
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}