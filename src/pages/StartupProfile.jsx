import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Globe, Linkedin, MapPin, Users, ExternalLink, CheckCircle, Clock, AlertCircle, Briefcase } from 'lucide-react';
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

export default function StartupProfile() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Startup.filter({ id }).then(results => {
      setStartup(results[0] || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-manrope font-bold text-2xl text-foreground mb-2">Company Not Found</h1>
        <p className="text-muted-foreground mb-6">This startup may have been removed or the link is invalid.</p>
        <Link to="/map"><Button className="bg-primary text-white">Back to Startup Map</Button></Link>
      </div>
    );
  }

  const verificationIcon = {
    'Verified': <CheckCircle size={16} className="text-primary" />,
    'Pending': <Clock size={16} className="text-yellow-500" />,
    'Community Sourced': <AlertCircle size={16} className="text-blue-500" />,
    'Flagged': <AlertCircle size={16} className="text-red-500" />,
  }[startup.verification_status];

  return (
    <div className="min-h-screen bg-muted/20 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <Link to="/map" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Startup Map
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-8 mb-6">
          <div className="flex items-start gap-5">
            {startup.photo_url ? (
              <img src={startup.photo_url} alt={startup.company_name}
                className="w-20 h-20 rounded-2xl object-cover border border-border shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-green-pale flex items-center justify-center shrink-0">
                <Briefcase size={28} className="text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="font-manrope font-extrabold text-3xl text-foreground">{startup.company_name}</h1>
                {verificationIcon}
              </div>
              {startup.city && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin size={13} />
                  {startup.city}{startup.county ? `, ${startup.county}` : ''}, Utah
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {startup.sector && (
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sectorColors[startup.sector] || sectorColors['Other']}`}>
                    {startup.sector}
                  </span>
                )}
                {startup.funding_stage && (
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stageColors[startup.funding_stage] || 'bg-gray-100 text-gray-700'}`}>
                    {startup.funding_stage}
                  </span>
                )}
                {startup.employees && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                    <Users size={11} /> {startup.employees} employees
                  </span>
                )}
                {startup.hiring && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Actively Hiring
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        {startup.description && (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6">
            <h2 className="font-manrope font-bold text-lg text-foreground mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">{startup.description}</p>
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6">
          <h2 className="font-manrope font-bold text-lg text-foreground mb-4">Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {startup.year_founded && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Founded</p>
                <p className="text-sm text-foreground font-medium">{startup.year_founded}</p>
              </div>
            )}
            {startup.employees && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Team Size</p>
                <p className="text-sm text-foreground font-medium">{startup.employees} employees</p>
              </div>
            )}
            {startup.funding_stage && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Funding Stage</p>
                <p className="text-sm text-foreground font-medium">{startup.funding_stage}</p>
              </div>
            )}
            {startup.address && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm text-foreground font-medium">{startup.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h2 className="font-manrope font-bold text-lg text-foreground mb-4">Links</h2>
          <div className="flex flex-wrap gap-3">
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-border text-foreground hover:border-primary/30 hover:text-primary">
                  <Globe size={14} /> Visit Website <ExternalLink size={12} />
                </Button>
              </a>
            )}
            {startup.linkedin_url && (
              <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-border text-foreground hover:border-blue-300 hover:text-blue-600">
                  <Linkedin size={14} /> LinkedIn <ExternalLink size={12} />
                </Button>
              </a>
            )}
            {startup.job_postings_url && startup.hiring && (
              <a href={startup.job_postings_url} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 bg-green-100 text-green-700 hover:bg-green-200 border-0">
                  <Briefcase size={14} /> View Open Jobs <ExternalLink size={12} />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}