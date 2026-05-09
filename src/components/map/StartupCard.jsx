import { ExternalLink, Linkedin, Users, MapPin, CheckCircle, Clock, AlertCircle, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

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

const verificationIcons = {
  'Verified': <CheckCircle size={13} className="text-primary" />,
  'Pending': <Clock size={13} className="text-yellow-500" />,
  'Community Sourced': <AlertCircle size={13} className="text-blue-500" />,
  'Flagged': <AlertCircle size={13} className="text-red-500" />,
};

export default function StartupCard({ startup, compact = false }) {
  if (!startup) return null;

  return (
    <Link to={`/startups/${startup.id}`} className={`block bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-manrope font-bold text-foreground truncate ${compact ? 'text-base' : 'text-lg'}`}>
              {startup.company_name}
            </h3>
            {verificationIcons[startup.verification_status]}
          </div>
          {startup.city && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={11} />
              {startup.city}
              {startup.county && `, ${startup.county}`}
            </div>
          )}
        </div>
        {startup.photo_url && (
          <img src={startup.photo_url} alt={startup.company_name} className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {startup.sector && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sectorColors[startup.sector] || sectorColors['Other']}`}>
            {startup.sector}
          </span>
        )}
        {startup.funding_stage && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColors[startup.funding_stage] || 'bg-gray-100 text-gray-700'}`}>
            {startup.funding_stage}
          </span>
        )}
        {startup.employees && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
            <Users size={10} /> {startup.employees}
          </span>
        )}
        {startup.hiring && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            Hiring
          </span>
        )}
      </div>

      {/* Description */}
      {!compact && startup.description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {startup.description}
        </p>
      )}

      {/* Links */}
      <div className="flex items-center gap-3 mt-auto" onClick={e => e.preventDefault()}>
        {startup.website && (
          <a href={startup.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
            <Globe size={13} /> Website
          </a>
        )}
        {startup.linkedin_url && (
          <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
            <Linkedin size={13} /> LinkedIn
          </a>
        )}
        {startup.job_postings_url && startup.hiring && (
          <a href={startup.job_postings_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="ml-auto flex items-center gap-1 text-xs text-green-700 hover:underline font-medium">
            <ExternalLink size={11} /> Jobs
          </a>
        )}
      </div>


    </Link>
  );
}