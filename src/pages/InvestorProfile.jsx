import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Target, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const investorTypes = ['Angel', 'Venture Capital', 'Corporate', 'Accelerator', 'Family Office', 'Individual'];
const sectors = ['AI', 'Aerospace & Defense', 'Life Sciences', 'Fintech', 'B2B Software', 'Marketplaces', 'Energy', 'Consumer', 'Security', 'All'];
const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'All'];

export default function InvestorProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const init = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      if (currentUser) {
        const profiles = await base44.entities.InvestorProfile.filter({ user_email: currentUser.email });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setForm(profiles[0]);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const toggleSector = (sector) => {
    setForm(f => ({
      ...f,
      focus_sectors: f.focus_sectors.includes(sector)
        ? f.focus_sectors.filter(s => s !== sector)
        : [...f.focus_sectors, sector]
    }));
  };

  const toggleStage = (stage) => {
    setForm(f => ({
      ...f,
      focus_stages: f.focus_stages.includes(stage)
        ? f.focus_stages.filter(s => s !== stage)
        : [...f.focus_stages, stage]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = {
      ...form,
      user_email: user.email,
      profile_complete: !!(form.investor_name && form.investor_type && form.investment_thesis),
    };

    if (profile?.id) {
      await base44.entities.InvestorProfile.update(profile.id, formData);
    } else {
      const created = await base44.entities.InvestorProfile.create(formData);
      setProfile(created);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-20 bg-muted/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <div>
            <h1 className="font-manrope font-extrabold text-3xl text-foreground">Investor Profile</h1>
            <p className="text-muted-foreground text-sm">Build your investor profile to discover startups aligned with your thesis</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-8">
          {/* Investor Info */}
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-purple-600" /> Investor Information</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Investor Name or Fund Name *" value={form.investor_name} onChange={e => setForm({ ...form, investor_name: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
              <select value={form.investor_type} onChange={e => setForm({ ...form, investor_type: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30">
                <option value="">Select Investor Type *</option>
                {investorTypes.map(t => <option key={t}>{t}</option>)}
              </select>
              <textarea placeholder="Investment Thesis & Criteria *" value={form.investment_thesis} onChange={e => setForm({ ...form, investment_thesis: e.target.value })} rows={4} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none" />
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2"><Target size={18} className="text-purple-600" /> Investment Focus</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Sectors of Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {sectors.map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.focus_sectors.includes(s)} onChange={() => toggleSector(s)} className="accent-primary" />
                      <span className="text-sm text-foreground">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Funding Stages of Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {stages.map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.focus_stages.includes(s)} onChange={() => toggleStage(s)} className="accent-primary" />
                      <span className="text-sm text-foreground">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Min Check Size ($k)</label>
                  <input type="number" placeholder="e.g. 25" value={form.check_size_min} onChange={e => setForm({ ...form, check_size_min: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Max Check Size ($k)</label>
                  <input type="number" placeholder="e.g. 1000" value={form.check_size_max} onChange={e => setForm({ ...form, check_size_max: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                </div>
              </div>
              <textarea placeholder="Portfolio focus, geographic focus, team values" value={form.portfolio_focus} onChange={e => setForm({ ...form, portfolio_focus: e.target.value })} rows={3} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none" />
            </div>
          </div>

          {/* Background */}
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4">Background & Links</h2>
            <div className="space-y-4">
              <textarea placeholder="Bio and experience" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none" />
              <input type="url" placeholder="LinkedIn Profile URL" value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
              <input type="url" placeholder="Fund or Company Website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Fields marked with * are required</p>
            <Button onClick={handleSave} disabled={saving} className="bg-purple-600 text-white hover:bg-purple-700 gap-2 font-semibold">
              {saved && <CheckCircle size={16} />}
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}