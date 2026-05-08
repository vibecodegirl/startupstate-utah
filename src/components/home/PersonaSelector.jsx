import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const personas = [
  {
    id: 'jordan',
    name: 'Jordan, 20',
    location: 'Salt Lake City',
    tag: 'First-Time Founder',
    tagColor: 'bg-blue-100 text-blue-700',
    description: 'Pre-seed, has an idea but no business yet. Looking for first steps.',
    resources: ['New Business Checklist', 'Startup Utah Resources', 'SBIR Phase 0', 'Mentor Networks'],
    advisorContext: "I'm Jordan, 20 years old in Salt Lake City. I have a startup idea but haven't registered a business yet. I'm pre-seed with no funding. What are my first steps?",
  },
  {
    id: 'maria',
    name: 'Maria, 38',
    location: 'Washington County',
    tag: 'Rural & Woman-Owned',
    tagColor: 'bg-purple-100 text-purple-700',
    description: 'Running a small agricultural operation near St. George. Looking to scale.',
    resources: ['Rural Business Grants', 'Women\'s Business Center', 'USDA Resources', 'Utah SBDC'],
    advisorContext: "I'm Maria, 38 in Washington County near St. George. I run a small woman-owned agricultural business and I'm looking for resources to scale. What's available for rural founders?",
  },
  {
    id: 'marcus',
    name: 'Marcus, 34',
    location: 'Ogden, Weber County',
    tag: 'Veteran Entrepreneur',
    tagColor: 'bg-orange-100 text-orange-700',
    description: 'Left the military, starting custom fabrication and manufacturing.',
    resources: ['Boots to Business', 'SBA Veteran Programs', 'Utah Manufacturers Assoc.', 'Ogden-Weber SBDC'],
    advisorContext: "I'm Marcus, 34, a veteran in Ogden starting a custom fabrication and manufacturing business. What veteran-specific programs and manufacturing resources are in Utah?",
  },
  {
    id: 'priya',
    name: 'Priya, 31',
    location: 'Salt Lake City',
    tag: 'Venture-Ready SaaS',
    tagColor: 'bg-green-100 text-green-700',
    description: 'B2B SaaS, 18 months in, paying customers. Ready to raise first round.',
    resources: ['Utah Angels', 'Kickstart Fund', 'Album VC', 'Silicon Slopes Investor Network'],
    advisorContext: "I'm Priya, 31 in SLC. I have a B2B SaaS company, 18 months in with paying customers. I'm looking to raise my first venture round. What angel groups and VCs are in Utah?",
  },
  {
    id: 'david',
    name: 'David, 45',
    location: 'Provo, Utah County',
    tag: 'Growth Stage MedTech',
    tagColor: 'bg-red-100 text-red-700',
    description: 'Medical device, 12 employees, FDA cleared. Expanding internationally.',
    resources: ['BioUtah', 'GOED International Trade', 'Utah Life Science Summit', 'Export Resources'],
    advisorContext: "I'm David, 45 in Provo. I have a medical device company with 12 employees that's FDA cleared. I'm looking to expand internationally. What international resources does Utah offer?",
  },
  {
    id: 'amir',
    name: 'Dr. Amir, 29',
    location: 'Salt Lake City',
    tag: 'Deep Tech / Research',
    tagColor: 'bg-indigo-100 text-indigo-700',
    description: 'PhD at U of U commercializing novel technology. Never started a business.',
    resources: ['SBIR/STTR Grants', 'U of U Tech Commercialization', 'NSF I-Corps', 'Bench to Bedside'],
    advisorContext: "I'm Dr. Amir, 29, a PhD candidate at the University of Utah commercializing novel research. I've never started a business. What programs exist for academic founders?",
  },
];

export default function PersonaSelector() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="bg-green-pale py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-manrope font-extrabold text-4xl text-foreground mb-3">Find Your Path</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Select the scenario that best describes you and get a personalized resource pathway — or launch a custom AI conversation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}
              className={`text-left rounded-2xl border p-5 transition-all duration-300 ${
                selected?.id === p.id
                  ? 'border-primary bg-white shadow-lg shadow-primary/10 ring-2 ring-primary/20'
                  : 'border-border bg-white hover:border-primary/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.tagColor}`}>{p.tag}</span>
              </div>
              <h3 className="font-manrope font-bold text-base text-foreground">{p.name}</h3>
              <p className="text-xs text-primary font-medium mb-2">{p.location}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </button>
          ))}
        </div>

        {/* Expanded panel */}
        {selected && (
          <div className="mt-8 bg-white rounded-2xl border border-primary/20 p-6 md:p-8 shadow-lg animate-fade-up">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-pale flex items-center justify-center">
                    <User size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-bold text-xl text-foreground">{selected.name}</h3>
                    <p className="text-primary text-sm font-medium">{selected.location} · {selected.tag}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{selected.description}</p>
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Top Matched Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.resources.map(r => (
                      <span key={r} className="text-xs bg-green-light/50 text-green-dark px-3 py-1 rounded-full font-medium border border-green-primary/20">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:w-56">
                <Link
                  to={`/advisor?persona=${selected.id}&context=${encodeURIComponent(selected.advisorContext)}`}
                >
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-green-dark font-semibold gap-2">
                    <ArrowRight size={16} /> Ask AI Advisor
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-green-pale font-semibold">
                    Browse Resources
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}