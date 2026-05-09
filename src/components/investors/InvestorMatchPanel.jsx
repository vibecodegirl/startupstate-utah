import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SECTORS = ['AI', 'Aerospace & Defense', 'Life Sciences', 'Fintech', 'B2B Software', 'Marketplaces', 'Energy', 'Consumer', 'Security', 'All'];
const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'All'];
const INVESTOR_TYPES = ['Angel', 'Venture Capital', 'Corporate', 'Accelerator', 'Family Office', 'Individual'];

function InvestorProfileForm({ user, onProfileCreated }) {
  const [formData, setFormData] = useState({
    investor_name: '',
    investor_type: '',
    focus_sectors: [],
    focus_stages: [],
    check_size_min: '',
    check_size_max: '',
    investment_thesis: '',
    portfolio_focus: '',
    bio: '',
    linkedin_url: '',
    website: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.investor_name || !formData.investor_type) {
      setError('Name and investor type are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const profile = await base44.entities.InvestorProfile.create({
        user_email: user.email,
        ...formData,
        check_size_min: formData.check_size_min ? parseFloat(formData.check_size_min) : null,
        check_size_max: formData.check_size_max ? parseFloat(formData.check_size_max) : null,
      });

      setSuccess(true);
      setTimeout(() => onProfileCreated(profile), 1000);
    } catch (err) {
      setError('Failed to create profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">Profile Created!</h3>
        <p className="text-sm text-muted-foreground">Finding your matched startups...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
      <h3 className="font-semibold text-foreground">Create Your Investor Profile</h3>

      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <input
        type="text"
        name="investor_name"
        placeholder="Investor/Fund Name *"
        value={formData.investor_name}
        onChange={handleInputChange}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        required
      />

      <select
        name="investor_type"
        value={formData.investor_type}
        onChange={handleInputChange}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
        required
      >
        <option value="">Select Investor Type *</option>
        {INVESTOR_TYPES.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Focus Sectors</label>
        <div className="grid grid-cols-2 gap-2">
          {SECTORS.map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.focus_sectors.includes(s)}
                onChange={() => handleMultiSelect('focus_sectors', s)}
                className="accent-primary rounded"
              />
              <span className="text-xs text-foreground">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Focus Stages</label>
        <div className="grid grid-cols-2 gap-2">
          {STAGES.map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.focus_stages.includes(s)}
                onChange={() => handleMultiSelect('focus_stages', s)}
                className="accent-primary rounded"
              />
              <span className="text-xs text-foreground">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          name="check_size_min"
          placeholder="Min Check (K)"
          value={formData.check_size_min}
          onChange={handleInputChange}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="number"
          name="check_size_max"
          placeholder="Max Check (K)"
          value={formData.check_size_max}
          onChange={handleInputChange}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <textarea
        name="investment_thesis"
        placeholder="Investment Thesis"
        value={formData.investment_thesis}
        onChange={handleInputChange}
        rows={2}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />

      <textarea
        name="portfolio_focus"
        placeholder="Portfolio Focus / Geographic Focus"
        value={formData.portfolio_focus}
        onChange={handleInputChange}
        rows={2}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />

      <textarea
        name="bio"
        placeholder="Your Background & Experience"
        value={formData.bio}
        onChange={handleInputChange}
        rows={2}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />

      <input
        type="url"
        name="linkedin_url"
        placeholder="LinkedIn Profile URL"
        value={formData.linkedin_url}
        onChange={handleInputChange}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <input
        type="url"
        name="website"
        placeholder="Fund/Company Website"
        value={formData.website}
        onChange={handleInputChange}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white hover:bg-green-dark font-semibold py-2"
      >
        {submitting ? 'Creating Profile...' : 'Create Profile & Get Matches'}
      </Button>
    </form>
  );
}

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
            <InvestorProfileForm user={user} onProfileCreated={(newProfile) => {
              setProfile(newProfile);
              base44.entities.StartupMatch.filter(
                { investor_email: user.email },
                '-match_score',
                10
              ).then(setMatches).catch(() => setMatches([]));
            }} />
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