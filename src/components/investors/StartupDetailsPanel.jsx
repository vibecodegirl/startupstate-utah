import { X, MapPin, Globe, Linkedin, Briefcase, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function StartupDetailsPanel({ startup, onClose }) {
  if (!startup) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-y-auto animate-slide-in rounded-l-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border flex items-center justify-between px-6 py-4 shrink-0">
          <h2 className="font-manrope font-bold text-lg text-foreground truncate">{startup.company_name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors ml-2 shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-4">
          {/* Location */}
          {(startup.address || startup.city) && (
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                  {startup.address && <div className="font-medium text-foreground">{startup.address}</div>}
                  {startup.city && <div className="text-xs text-muted-foreground">{startup.city}, {startup.county || 'UT'}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {startup.description && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">{startup.description}</p>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {startup.sector && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                {startup.sector}
              </span>
            )}
            {startup.funding_stage && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                {startup.funding_stage}
              </span>
            )}
            {startup.employees && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                <Users size={12} /> {startup.employees}
              </span>
            )}
          </div>

          {/* Quick Facts */}
          {(startup.year_founded) && (
            <div className="space-y-2 text-sm">
              {startup.year_founded && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-medium text-foreground">{startup.year_founded}</span>
                </div>
              )}
            </div>
          )}

          {/* Links */}
          <div className="space-y-2 pt-2">
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-between gap-2 text-sm text-primary hover:underline font-medium bg-green-pale/30 border border-primary/20 px-3 py-2 rounded-lg hover:bg-green-pale/50 transition-colors">
                  <span className="flex items-center gap-2"><Globe size={14} /> Website</span>
                  <ExternalLink size={12} />
                </button>
              </a>
            )}
            {startup.linkedin_url && (
              <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-between gap-2 text-sm text-blue-600 hover:underline font-medium bg-blue-50/30 border border-blue-200/30 px-3 py-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <span className="flex items-center gap-2"><Linkedin size={14} /> LinkedIn</span>
                  <ExternalLink size={12} />
                </button>
              </a>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-border bg-white shrink-0">
          <Link to={`/startups/${startup.id}`} onClick={onClose}>
            <Button className="w-full bg-primary text-white hover:bg-green-dark font-semibold">
              View Full Profile
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}