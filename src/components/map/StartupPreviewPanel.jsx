import { Link } from 'react-router-dom';
import { X, Globe, Linkedin, MapPin, Users, ExternalLink, ArrowRight, Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sectorColors = {
  'AI': 'bg-blue-100 text-blue-700',
  'Aerospace & Defense': 'bg-orange-100 text-orange-700',
  'Life Sciences': 'bg-red-100 text-red-700',
  'Fintech': 'bg-purple-100 text-purple-700',
  'B2B Software': 'bg-green-100 text-green-700',
  'Other': 'bg-gray-100 text-gray-700',
};

const stageColors = {
  'Pre-Seed': 'bg-yellow-100 text-yellow-700',
  'Seed': 'bg-lime-100 text-lime-700',
  'Series A': 'bg-emerald-100 text-emerald-700',
  'Series B': 'bg-teal-100 text-teal-700',
  'Series C': 'bg-cyan-100 text-cyan-700',
  'Series D+': 'bg-sky-100 text-sky-700',
  'Bootstrapped': 'bg-stone-100 text-stone-700',
};

const verificationLabel = {
  'Verified': { icon: <CheckCircle size={13} className="text-primary" />, label: 'Verified' },
  'Pending': { icon: <Clock size={13} className="text-yellow-500" />, label: 'Pending Review' },
  'Community Sourced': { icon: <AlertCircle size={13} className="text-blue-500" />, label: 'Community Sourced' },
  'Flagged': { icon: <AlertCircle size={13} className="text-red-500" />, label: 'Flagged' },
};

export default function StartupPreviewPanel({ startup, onClose }) {
  if (!startup) return null;

  const verification = verificationLabel[startup.verification_status];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-t border-border
        h-auto max-h-[85vh] sm:h-full sm:max-h-none
        sm:bottom-0 sm:top-[112px]
        flex flex-col rounded-t-2xl sm:rounded-none overflow-hidden
        animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {startup.photo_url ? (
              <img src={startup.photo_url} alt={startup.company_name}
                className="w-12 h-12 rounded-xl object-cover border border-border shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center shrink-0">
                <Briefcase size={20} className="text-primary" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-manrope font-bold text-lg text-foreground leading-tight truncate">{startup.company_name}</h2>
              {startup.city && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin size={11} /> {startup.city}{startup.county ? `, ${startup.county}` : ''}
                </div>
              )}
              {verification && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {verification.icon} {verification.label}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground ml-2 shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {startup.sector && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sectorColors[startup.sector] || sectorColors['Other']}`}>
                {startup.sector}
              </span>
            )}
            {startup.funding_stage && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stageColors[startup.funding_stage] || 'bg-gray-100 text-gray-700'}`}>
                {startup.funding_stage}
              </span>
            )}
            {startup.employees && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                <Users size={10} /> {startup.employees}
              </span>
            )}
            {startup.hiring && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                Hiring
              </span>
            )}
          </div>

          {/* Description */}
          {startup.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{startup.description}</p>
          )}

          {/* Quick facts */}
          {(startup.year_founded || startup.address) && (
            <div className="bg-muted/40 rounded-xl p-3 space-y-1.5">
              {startup.year_founded && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-medium text-foreground">{startup.year_founded}</span>
                </div>
              )}
              {startup.address && (
                <div className="flex items-center justify-between text-xs gap-4">
                  <span className="text-muted-foreground shrink-0">Address</span>
                  <span className="font-medium text-foreground text-right">{startup.address}</span>
                </div>
              )}
            </div>
          )}

          {/* External links */}
          <div className="flex flex-wrap gap-2">
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium bg-green-pale px-3 py-1.5 rounded-lg">
                <Globe size={12} /> Website <ExternalLink size={10} />
              </a>
            )}
            {startup.linkedin_url && (
              <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium bg-blue-50 px-3 py-1.5 rounded-lg">
                <Linkedin size={12} /> LinkedIn <ExternalLink size={10} />
              </a>
            )}
            {startup.job_postings_url && startup.hiring && (
              <a href={startup.job_postings_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-green-700 hover:underline font-medium bg-green-100 px-3 py-1.5 rounded-lg">
                <Briefcase size={12} /> Jobs <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-border bg-white shrink-0">
          <Link to={`/startups/${startup.id}`} onClick={onClose}>
            <Button className="w-full bg-primary text-white hover:bg-green-dark font-manrope font-semibold gap-2">
              View Full Profile <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}