import { useState } from 'react';
import { ChevronDown, User, Building2, TrendingUp, Shield } from 'lucide-react';

const roles = [
  { id: 'visitor', label: 'Visitor', icon: User, color: 'text-blue-600 bg-blue-50' },
  { id: 'founder', label: 'Founder', icon: Building2, color: 'text-green-primary bg-green-pale' },
  { id: 'investor', label: 'Investor', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
  { id: 'admin', label: 'Super Admin', icon: Shield, color: 'text-orange-600 bg-orange-50' },
];

export default function RoleSwitcher({ role, setRole }) {
  const [open, setOpen] = useState(false);
  const current = roles.find(r => r.id === role) || roles[0];
  const Icon = current.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${current.color} border-current/20`}
      >
        <Icon size={13} />
        <span>{current.label}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-border shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 text-xs text-muted-foreground font-medium border-b border-border">
            Demo Role Switcher
          </div>
          {roles.map((r) => {
            const RIcon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => { setRole(r.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted ${role === r.id ? 'bg-green-pale text-primary font-semibold' : 'text-foreground'}`}
              >
                <RIcon size={14} />
                {r.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}