import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function InvestorMatchPanel({ onClose }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const profiles = await base44.entities.InvestorProfile.filter({ user_email: currentUser.email }, '', 1).catch(() => []);
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          const foundMatches = await base44.entities.StartupMatch.filter(
            { investor_email: currentUser.email },
            '-match_score',
            10
          ).catch(() => []);
          setMatches(foundMatches);
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
        <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border flex items-center justify-between px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-primary" />
            <h2 className="font-manrope font-bold text-lg text-foreground">Startup Matching</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {!user ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Sign in to view matched startups</p>
              <Link to="/auth">
                <Button className="bg-primary text-white hover:bg-green-dark font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : !profile ? (
            <div className="text-center py-12 space-y-4">
              <h3 className="font-semibold text-foreground">Create Your Investor Profile</h3>
              <p className="text-sm text-muted-foreground">Build your profile to get matched with Utah startups aligned with your investment thesis.</p>
              <Link to="/investor-profile">
                <Button className="bg-primary text-white hover:bg-green-dark font-semibold gap-2">
                  Create Profile
                </Button>
              </Link>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">No matches yet. Check back soon or update your profile criteria.</p>
              <Link to="/investor-profile">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-green-pale font-semibold">
                  Update Profile
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Your Matched Startups</h3>
              <p className="text-sm text-muted-foreground">{matches.length} startup{matches.length !== 1 ? 's' : ''} matched to your investment criteria</p>
              
              {matches.map((match) => (
                <div key={match.id} className="bg-gradient-to-r from-primary/5 to-green-pale/20 rounded-xl p-4 border border-primary/20 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">Match Score</h4>
                      <p className="text-2xl font-bold text-primary">{Math.round(match.match_score)}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Sector • Stage</div>
                      <div className="space-y-0.5">
                        {match.sector_match && <div className="text-xs font-medium text-primary">{Math.round(match.sector_match)}% sector</div>}
                        {match.stage_match && <div className="text-xs font-medium text-primary">{Math.round(match.stage_match)}% stage</div>}
                      </div>
                    </div>
                  </div>
                  
                  {match.match_reasons && match.match_reasons.length > 0 && (
                    <div className="pt-2 border-t border-primary/10">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Why matched:</p>
                      <ul className="text-xs text-foreground space-y-0.5">
                        {match.match_reasons.slice(0, 2).map((reason, i) => (
                          <li key={i} className="flex gap-1">
                            <span className="text-primary">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {match.recommendation_summary && (
                    <div className="pt-2 border-t border-primary/10">
                      <p className="text-xs text-muted-foreground line-clamp-2">{match.recommendation_summary}</p>
                    </div>
                  )}
                </div>
              ))}

              <Link to="/matches">
                <Button className="w-full bg-primary text-white hover:bg-green-dark font-semibold">
                  View Full Matches
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}