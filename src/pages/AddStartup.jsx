import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, AlertCircle, Building2, Linkedin, Globe, MapPin, Users, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sectors = ['AI', 'Aerospace & Defense', 'Life Sciences', 'Fintech', 'B2B Software', 'Marketplaces', 'Energy', 'Consumer', 'Security', 'Other'];
const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Bootstrapped'];
const sizes = ['2-10', '11-50', '51-200', '201-500', '500+'];

export default function AddStartup() {
  const [form, setForm] = useState({
    company_name: '', company_linkedin: '', address: '', description: '',
    website: '', funding_stage: '', employees: '', sector: '',
    contact_email: '', contact_name: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.company_name) e.company_name = 'Required';
    if (!form.contact_email) e.contact_email = 'Required';
    if (!form.sector) e.sector = 'Required';
    if (!form.funding_stage) e.funding_stage = 'Required';
    if (!form.employees) e.employees = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await base44.entities.ListingRequest.create({
      ...form,
      status: 'Pending',
    });
    setSubmitted(true);
    setLoading(false);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-green-pale">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h1 className="font-manrope font-extrabold text-3xl text-foreground mb-3">Submission Received!</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Your startup listing request has been submitted. Our team will review it within 2–3 business days and notify you at <strong>{form.contact_email}</strong>.
          </p>
          <div className="bg-white rounded-2xl border border-border p-5 text-left mb-6">
            <h3 className="font-semibold text-sm mb-3 text-foreground">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary font-bold">1.</span> Team reviews your submission against the CLEVER Framework</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">2.</span> We verify via LinkedIn or website</li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">3.</span> You receive an email confirmation with your listing link</li>
            </ul>
          </div>
          <a href="/map">
            <Button className="bg-primary text-white hover:bg-green-dark font-semibold">View the Startup Map</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-muted/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-manrope font-extrabold text-4xl text-foreground mb-3">Add Your Startup</h1>
          <p className="text-muted-foreground text-lg">Join Utah's startup map and connect with investors, mentors, and partners.</p>
        </div>

        {/* Info banner */}
        <div className="bg-green-pale border border-primary/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-green-dark mb-1">Verification Process</p>
            <p className="text-muted-foreground">All listings are reviewed against our CLEVER Framework standards. Provide accurate information to speed up approval. Your listing will appear as "Pending" until verified.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-manrope font-bold text-lg text-foreground mb-5 flex items-center gap-2">
              <Building2 size={18} className="text-primary" /> Company Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5">Company Name *</label>
                <input value={form.company_name} onChange={e => set('company_name', e.target.value)}
                  placeholder="Acme Technologies"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.company_name ? 'border-destructive' : 'border-border'}`} />
                {errors.company_name && <p className="text-xs text-destructive mt-1">{errors.company_name}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1"><Linkedin size={14} /> Company LinkedIn *</label>
                <input value={form.company_linkedin} onChange={e => set('company_linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1"><Globe size={14} /> Website</label>
                <input value={form.website} onChange={e => set('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1"><MapPin size={14} /> Full Address *</label>
                <input value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="123 Main St, Salt Lake City, UT 84101"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5">Company Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Describe what your company does, who you serve, and what makes you unique..."
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-manrope font-bold text-lg text-foreground mb-5 flex items-center gap-2">
              <Tag size={18} className="text-primary" /> Classification
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1"><Tag size={13} /> Sector *</label>
                <select value={form.sector} onChange={e => set('sector', e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white ${errors.sector ? 'border-destructive' : 'border-border'}`}>
                  <option value="">Select sector</option>
                  {sectors.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.sector && <p className="text-xs text-destructive mt-1">{errors.sector}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1"><DollarSign size={13} /> Funding Stage *</label>
                <select value={form.funding_stage} onChange={e => set('funding_stage', e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white ${errors.funding_stage ? 'border-destructive' : 'border-border'}`}>
                  <option value="">Select stage</option>
                  {stages.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.funding_stage && <p className="text-xs text-destructive mt-1">{errors.funding_stage}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1"><Users size={13} /> Employees *</label>
                <select value={form.employees} onChange={e => set('employees', e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white ${errors.employees ? 'border-destructive' : 'border-border'}`}>
                  <option value="">Select size</option>
                  {sizes.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.employees && <p className="text-xs text-destructive mt-1">{errors.employees}</p>}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-manrope font-bold text-lg text-foreground mb-5">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name *</label>
                <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address *</label>
                <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)}
                  placeholder="jane@company.com"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.contact_email ? 'border-destructive' : 'border-border'}`} />
                {errors.contact_email && <p className="text-xs text-destructive mt-1">{errors.contact_email}</p>}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary text-white hover:bg-green-dark font-manrope font-bold py-3 text-base rounded-xl shadow-lg shadow-primary/20">
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting, you agree to the Active Flagging Protocol — your data will be kept accurate and transparent.
          </p>
        </form>
      </div>
    </div>
  );
}