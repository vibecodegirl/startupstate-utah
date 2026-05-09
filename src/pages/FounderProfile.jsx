import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, Users, Target, Link as LinkIcon, CheckCircle, Zap, TrendingUp, Loader, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sectors = ['AI', 'Aerospace & Defense', 'Life Sciences', 'Fintech', 'B2B Software', 'Marketplaces', 'Energy', 'Consumer', 'Security', 'Other'];
const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Bootstrapped'];
const teamSizes = ['1', '2-5', '6-10', '11-20', '20+'];
const growthGoalsOptions = ['Market expansion', 'Product development', 'Team building', 'International growth', 'Strategic partnership', 'Profitability'];

export default function FounderProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    company_name: '',
    sector: '',
    funding_stage: '',
    funding_goal: '',
    description: '',
    team_size: '',
    growth_goals: [],
    ideal_investor_profile: '',
    website: '',
    linkedin_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [matches, setMatches] = useState([]);
  const [computing, setComputing] = useState(false);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    const init = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      if (currentUser) {
        const profiles = await base44.entities.FounderProfile.filter({ user_email: currentUser.email });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setForm(profiles[0]);
        } else {
          // New user - auto-populate from pending quiz answers if available
          const pendingAnswers = sessionStorage.getItem('pendingQuizAnswers');
          if (pendingAnswers) {
            const answers = JSON.parse(pendingAnswers);
            setForm(prev => ({
              ...prev,
              sector: answers.sector || '',
              funding_stage: answers.stage || '',
            }));
          }
        }
        const allInvestors = await base44.entities.InvestorProfile.list('-created_date', 200);
        setInvestors(allInvestors);
      }
      setLoading(false);
    };
    init();
  }, []);

  const toggleGrowthGoal = (goal) => {
    setForm(f => ({
      ...f,
      growth_goals: f.growth_goals.includes(goal)
        ? f.growth_goals.filter(g => g !== goal)
        : [...f.growth_goals, goal]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = {
      ...form,
      user_email: user.email,
      profile_complete: !!(form.company_name && form.sector && form.funding_stage && form.description),
    };

    if (profile?.id) {
      await base44.entities.FounderProfile.update(profile.id, formData);
    } else {
      const created = await base44.entities.FounderProfile.create(formData);
      setProfile(created);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  const computeMatches = async () => {
    if (!profile || !user) return;
    setComputing(true);
    const newMatches = [];

    for (const investor of investors) {
      if (investor.user_email === user.email) continue;
      try {
        const res = await base44.functions.invoke('computeStartupMatches', {
          founderEmail: user.email,
          investorEmail: investor.user_email,
          founderProfile: profile,
          investorProfile: investor,
        });
        if (res.data?.match) {
          newMatches.push(res.data.match);
        }
      } catch (err) {
        console.error('Match error:', err);
      }
    }

    setMatches(newMatches.sort((a, b) => b.match_score - a.match_score));
    setComputing(false);
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-20 bg-muted/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-manrope font-extrabold text-3xl text-foreground">Founder Profile</h1>
            <p className="text-muted-foreground text-sm">Build your startup profile to get matched with ideal investors</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-8">
          {/* Company Info */}
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2"><Building2 size={18} className="text-primary" /> Company Information</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Company Name *" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select Sector *</option>
                  {sectors.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={form.funding_stage} onChange={e => setForm({ ...form, funding_stage: e.target.value })} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Funding Stage *</option>
                  {stages.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <textarea placeholder="Startup Description & Vision *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>

          {/* Funding & Team */}
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2"><Target size={18} className="text-primary" /> Funding & Team</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Funding Goal (in thousands)</label>
                  <input type="number" placeholder="e.g. 500" value={form.funding_goal} onChange={e => setForm({ ...form, funding_goal: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <select value={form.team_size} onChange={e => setForm({ ...form, team_size: e.target.value })} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 h-fit">
                  <option value="">Team Size</option>
                  {teamSizes.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">Growth Goals</label>
                <div className="grid grid-cols-2 gap-2">
                  {growthGoalsOptions.map(goal => (
                    <label key={goal} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.growth_goals.includes(goal)} onChange={() => toggleGrowthGoal(goal)} className="accent-primary" />
                      <span className="text-sm text-foreground">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
              <textarea placeholder="What's your ideal investor?" value={form.ideal_investor_profile} onChange={e => setForm({ ...form, ideal_investor_profile: e.target.value })} rows={3} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2"><LinkIcon size={18} className="text-primary" /> Links</h2>
            <div className="space-y-4">
              <input type="url" placeholder="Website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="url" placeholder="LinkedIn Profile URL" value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Fields marked with * are required</p>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-white hover:bg-green-dark gap-2 font-semibold">
              {saved && <CheckCircle size={16} />}
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>

        {/* Investor Matches Section */}
        {profile && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-manrope font-bold text-2xl text-foreground flex items-center gap-2"><Zap size={24} className="text-primary" /> Find Investors</h2>
                <p className="text-muted-foreground text-sm">Discover investors aligned with your vision</p>
              </div>
              {!showMatches && <Button onClick={() => setShowMatches(true)} className="bg-primary text-white hover:bg-green-dark gap-2 font-semibold">
                <TrendingUp size={16} /> Discover Matches
              </Button>}
            </div>

            {showMatches && (
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border p-8 text-center">
                    <Button
                      onClick={computeMatches}
                      disabled={computing}
                      className="bg-primary text-white hover:bg-green-dark gap-2 font-semibold mx-auto"
                    >
                      {computing ? (
                        <>
                          <Loader size={16} className="animate-spin" /> Computing...
                        </>
                      ) : (
                        <>
                          <TrendingUp size={16} /> Compute Investor Matches
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  matches.map((match) => {
                    const investor = investors.find(i => i.user_email === match.investor_email);
                    if (!investor) return null;
                    const scoreColor = match.match_score >= 80 ? 'text-green-600' : match.match_score >= 60 ? 'text-yellow-600' : 'text-orange-600';
                    return (
                      <div key={match.id} className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-foreground">{investor.investor_name}</h3>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 ${scoreColor}`}>
                                {match.match_score}% Match
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{investor.investor_type}</p>
                          </div>
                        </div>
                        <p className="text-xs text-foreground mb-2">{match.recommendation_summary}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {match.match_reasons?.slice(0, 2).map((r, i) => (
                            <span key={i} className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full">
                              {r}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {investor.linkedin_url && (
                            <a href={investor.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="text-xs h-7">LinkedIn</Button>
                            </a>
                          )}
                          {investor.website && (
                            <a href={investor.website} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="text-xs h-7">Visit</Button>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}