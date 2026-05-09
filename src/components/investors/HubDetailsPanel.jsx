import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, MapPin, TrendingUp, Building2 } from 'lucide-react';

export default function HubDetailsPanel({ hub, onClose }) {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hub?.city) {
      setLoading(false);
      return;
    }
    
    base44.entities.Startup.filter({ city: hub.city }, '-created_date', 15).then(data => {
      setStartups(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [hub]);

  if (!hub) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border flex items-center justify-between px-6 py-4 shrink-0">
          <h2 className="font-manrope font-bold text-xl text-foreground">{hub.city} Hub</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Hub Stats */}
          <div className="bg-gradient-to-r from-primary/5 to-green-pale/30 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-primary" />
              <div>
                <div className="text-3xl font-bold text-primary">{startups.length}</div>
                <div className="text-sm text-muted-foreground">Active Startups</div>
              </div>
            </div>
          </div>

          {/* Startups List */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              Startups in {hub.city}
            </h3>
            {loading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded-lg" />)}
              </div>
            ) : startups.length > 0 ? (
              <div className="space-y-2">
                {startups.map(s => (
                  <div key={s.id} className="bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/30 transition-colors">
                    <div className="font-semibold text-sm text-foreground">{s.company_name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.sector} • {s.funding_stage}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No startups found in this hub.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}