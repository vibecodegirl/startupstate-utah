import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bookmark, ExternalLink, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  'Funding',
  'Legal',
  'Mentorship',
  'Coworking',
  'Accelerator',
  'Education',
  'Networking',
];

export default function SavedResources({ founderEmail }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!founderEmail) {
      setLoading(false);
      return;
    }

    // Fetch resources from the Resource entity
    base44.entities.Resource.filter({}, '-created_date', 100)
      .then(data => {
        // Filter for resources the founder might have bookmarked
        // In a full implementation, you'd track bookmarks in the FounderProfile
        setResources(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [founderEmail]);

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  if (loading) {
    return <div className="animate-pulse h-40 bg-muted rounded-lg" />;
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <Bookmark size={32} className="text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No saved resources yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
            selectedCategory === 'All'
              ? 'bg-primary text-white'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid gap-3">
        {filteredResources.map((resource, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {resource.title}
                  <ExternalLink size={12} />
                </a>
                <p className="text-xs text-muted-foreground mt-1">{resource.provider}</p>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full shrink-0">
                {resource.category}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>

            {resource.audience && (
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.audience.slice(0, 2).map((aud, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                    {aud}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              {resource.contact_email && (
                <a
                  href={`mailto:${resource.contact_email}`}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Contact
                </a>
              )}
              <button className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}