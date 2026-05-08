import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const personas = [
  {
    id: 'jordan',
    name: 'Jordan, 20',
    location: 'Salt Lake City',
    tag: 'First-Time Founder',
    tagColor: 'bg-blue-100 text-blue-700',
    borderHover: 'hover:border-blue-300',
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
    borderHover: 'hover:border-purple-300',
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
    borderHover: 'hover:border-orange-300',
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
    borderHover: 'hover:border-green-300',
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
    borderHover: 'hover:border-red-300',
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
    borderHover: 'hover:border-indigo-300',
    description: 'PhD at U of U commercializing novel technology. Never started a business.',
    resources: ['SBIR/STTR Grants', 'U of U Tech Commercialization', 'NSF I-Corps', 'Bench to Bedside'],
    advisorContext: "I'm Dr. Amir, 29, a PhD candidate at the University of Utah commercializing novel research. I've never started a business. What programs exist for academic founders?",
  },
];

export default function PersonaSelector() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const active = selected || hovered;

  return (
    <section className="bg-green-pale py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-manrope font-extrabold text-4xl text-foreground mb-3">Find Your Path</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Hover or select a profile that matches your situation to see a personalized resource pathway.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {personas.map((p) => {
            const isActive = selected?.id === p.id;
            const isHovered = hovered?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
                className={`relative text-center rounded-2xl border p-4 transition-all duration-200 ${
                  isActive
                    ? 'border-primary bg-white shadow-lg ring-2 ring-primary/20'
                    : `border-border bg-white ${p.borderHover} hover:shadow-md`
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <User size={16} className="text-primary" />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full block leading-snug ${p.tagColor}`}>
                  {p.tag}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-primary/20 rotate-45" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detail panel — shows on hover or click */}
        <div className={`transition-all duration-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          {active && (
            <div className="bg-white rounded-2xl border border-primary/20 p-6 md:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${active.tagColor}`}>{active.tag}</span>
                    <span className="text-sm text-muted-foreground">{active.name} · {active.location}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{active.description}</p>
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Top Matched Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {active.resources.map(r => (
                        <span key={r} className="text-xs bg-green-light/50 text-green-dark px-3 py-1 rounded-full font-medium border border-green-primary/20">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:w-52 shrink-0">
                  <Link to={`/advisor?persona=${active.id}&context=${encodeURIComponent(active.advisorContext)}`}>
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
      </div>
    </section>
  );
}