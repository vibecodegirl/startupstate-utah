import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, TrendingUp, ArrowRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function StartupMatch() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [allProfiles, setAllProfiles] = useState({ founders: [], investors: [] });

  useEffect(() => {
    const init = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Check if user has a founder or investor profile
      const founderProfiles = await base44.entities.FounderProfile.filter({ user_email: currentUser.email });
      const investorProfiles = await base44.entities.InvestorProfile.filter({ user_email: currentUser.email });

      if (founderProfiles.length > 0) {
        setUserType('founder');
        setUserProfile(founderProfiles[0]);
      } else if (investorProfiles.length > 0) {
        setUserType('investor');
        setUserProfile(investorProfiles[0]);
      }

      // Load all profiles for matching
      const allFounders = await base44.entities.FounderProfile.list('-created_date', 200);
      const allInvestors = await base44.entities.InvestorProfile.list('-created_date', 200);
      setAllProfiles({ founders: allFounders, investors: allInvestors });

      // Load existing matches
      if (userType === 'founder') {
        const founderMatches = await base44.entities.StartupMatch.filter({ founder_email: currentUser.email });
        setMatches(founderMatches);
      } else if (userType === 'investor') {
        const investorMatches = await base44.entities.StartupMatch.filter({ investor_email: currentUser.email });
        setMatches(investorMatches);
      }

      setLoading(false);
    };
    init();
  }, []);

  const computeMatches = async () => {
    if (!userProfile || !user) return;

    setComputing(true);

    try {
      if (userType === 'founder') {
        // Compute matches to all investors
        const newMatches = [];
        for (const investor of allProfiles.investors) {
          if (investor.user_email === user.email) continue; // Skip self

          const res = await base44.functions.invoke('computeStartupMatches', {
            founderEmail: user.email,
            investorEmail: investor.user_email,
            founderProfile: userProfile,
            investorProfile: investor,
          });

          if (res.data?.match) {
            newMatches.push(res.data.match);
          }
        }
        setMatches(newMatches.sort((a, b) => b.match_score - a.match_score));
      } else if (userType === 'investor') {
        // Compute matches to all founders
        const newMatches = [];
        for (const founder of allProfiles.founders) {
          if (founder.user_email === user.email) continue; // Skip self

          const res = await base44.functions.invoke('computeStartupMatches', {
            founderEmail: founder.user_email,
            investorEmail: user.email,
            founderProfile: founder,
            investorProfile: userProfile,
          });

          if (res.data?.match) {
            newMatches.push(res.data.match);
          }
        }
        setMatches(newMatches.sort((a, b) => b.match_score - a.match_score));
      }
    } catch (err) {
      console.error('Error computing matches:', err);
    } finally {
      setComputing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h2 className="font-manrope font-bold text-2xl text-foreground mb-4">Sign in to Access Startup Match</h2>
          <Link to="/auth"><Button className="bg-primary text-white">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-muted/20">
        <div className="text-center max-w-md mx-auto px-4">
          <Zap size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="font-manrope font-bold text-2xl text-foreground mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground mb-6">To get matched, please complete your founder or investor profile first.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/founder-profile" className="flex-1"><Button className="w-full bg-primary text-white">Create Founder Profile</Button></Link>
            <Link to="/investor-profile" className="flex-1"><Button variant="outline" className="w-full">Create Investor Profile</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-manrope font-extrabold text-3xl text-foreground flex items-center gap-2">
              <Zap size={28} className="text-primary" /> Startup Match
            </h1>
            <p className="text-muted-foreground text-sm">AI-powered matching for {userType === 'founder' ? 'investors' : 'startups'}</p>
          </div>
          <Button
            onClick={computeMatches}
            disabled={computing}
            className="bg-primary text-white hover:bg-green-dark gap-2 font-semibold"
          >
            {computing ? (
              <>
                <Loader size={16} className="animate-spin" /> Computing...
              </>
            ) : (
              <>
                <TrendingUp size={16} /> Compute Matches
              </>
            )}
          </Button>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <Zap size={40} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Click "Compute Matches" to find {userType === 'founder' ? 'investors' : 'startups'} aligned with your profile.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, idx) => {
              const matchedProfile = userType === 'founder'
                ? allProfiles.investors.find(i => i.user_email === match.investor_email)
                : allProfiles.founders.find(f => f.user_email === match.founder_email);

              if (!matchedProfile) return null;

              const scoreColor = match.match_score >= 80 ? 'text-green-600' : match.match_score >= 60 ? 'text-yellow-600' : 'text-orange-600';

              return (
                <div key={match.id} className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-manrope font-bold text-lg text-foreground">
                          {userType === 'founder' ? matchedProfile.investor_name : matchedProfile.company_name}
                        </h3>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full bg-primary/10 ${scoreColor}`}>
                          {match.match_score}% Match
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {userType === 'founder'
                          ? `${matchedProfile.investor_type} · $${matchedProfile.check_size_min}k-$${matchedProfile.check_size_max}k`
                          : `${matchedProfile.sector} · ${matchedProfile.funding_stage} · $${matchedProfile.funding_goal}k seeking`
                        }
                      </p>
                      <p className="text-sm text-foreground mb-4">{match.recommendation_summary}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {match.match_reasons?.map((reason, i) => (
                          <span key={i} className="text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                            {reason}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                        <div><span className="text-muted-foreground">Sector Match:</span> <span className="font-bold text-foreground">{match.sector_match}%</span></div>
                        <div><span className="text-muted-foreground">Stage Match:</span> <span className="font-bold text-foreground">{match.stage_match}%</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-border/50">
                    {matchedProfile.linkedin_url && (
                      <a href={matchedProfile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1">LinkedIn</Button>
                      </a>
                    )}
                    {matchedProfile.website && (
                      <a href={matchedProfile.website} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1">Visit</Button>
                      </a>
                    )}
                    <Button size="sm" className="ml-auto bg-primary text-white hover:bg-green-dark gap-1">
                      <ArrowRight size={14} /> Connect
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}