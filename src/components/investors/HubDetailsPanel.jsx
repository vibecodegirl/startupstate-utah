import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, MapPin, TrendingUp } from 'lucide-react';

export default function HubDetailsPanel({ city, onClose }) {
  const [startups, setStartups] = useState([]);
  const [sectors, setSectors] = useState({});

  useEffect(() => {
    if (!city) return;
    base44.entities.Startup.filter({ city }, '-created_date', 15).then(data => {
      setStartups(data);
      const sectorCounts = {};
      data.forEach(s => {
        sectorCounts[s.sector] = (sectorCounts[s.sector] || 0) + 1;
      });
      setSectors(sectorCounts);
    }).catch(() => {});
  }, [city]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border flex items-center justify-between px-6 py-4 shrink-0">
          <h2 className="font-manrope font-bold text-xl text-foreground">{city} Hub</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Hub Stats */}
          <div className="bg-gradient-to-r from-primary/5 to-green-pale/30 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={18} className="text-primary" />
              <div>
                <div className="text-3xl font-bold text-primary">{startups.length}</div>
                <div className="text-sm text-muted-foreground">Active Startups</div>
              </div>
            </div>
          </div>

          {/* Sectors in Hub */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Top Sectors
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(sectors)
                .sort((a, b) => b[1] - a[1])
                .map(([sector, count]) => (
                  <div key={sector} className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <div className="font-semibold text-sm text-foreground">{sector}</div>
                    <div className="text-xs text-primary font-bold mt-1">{count} startups</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Startups List */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Startups in {city}</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {startups.map(s => (
                <div key={s.id} className="bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/30 transition-colors">
                  <div className="font-semibold text-sm text-foreground">{s.company_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.sector} • {s.funding_stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}