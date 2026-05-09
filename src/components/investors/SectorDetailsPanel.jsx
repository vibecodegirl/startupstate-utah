import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, TrendingUp, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SectorDetailsPanel({ sector, onClose }) {
  const [startups, setStartups] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!sector) return;
    base44.entities.Startup.filter({ sector }, '-created_date', 20).then(data => {
      setStartups(data);
      const stages = {};
      data.forEach(s => {
        stages[s.funding_stage] = (stages[s.funding_stage] || 0) + 1;
      });
      setStats(stages);
    }).catch(() => {});
  }, [sector]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border flex items-center justify-between px-6 py-4 shrink-0">
          <h2 className="font-manrope font-bold text-xl text-foreground">{sector} Startups</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Stats */}
          {stats && (
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-2xl font-bold text-primary">{startups.length}</div>
                  <div className="text-xs text-muted-foreground">Total Startups</div>
                </div>
                {Object.entries(stats).map(([stage, count]) => (
                  <div key={stage}>
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-xs text-muted-foreground">{stage}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Startups List */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              Active Startups
            </h3>
            <div className="space-y-2">
              {startups.map(s => (
                <div key={s.id} className="bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/30 transition-colors">
                  <div className="font-semibold text-sm text-foreground">{s.company_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {s.funding_stage} • {s.employees} employees {s.website && <span>• <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit</a></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}