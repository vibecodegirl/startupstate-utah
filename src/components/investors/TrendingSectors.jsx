import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Zap } from 'lucide-react';
import SectorDetailsPanel from './SectorDetailsPanel';

export default function TrendingSectors() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState(null);

  useEffect(() => {
    base44.entities.Startup.list('-created_date', 200).then(startups => {
      const sectorCounts = {};
      startups.forEach(s => {
        if (s.sector) sectorCounts[s.sector] = (sectorCounts[s.sector] || 0) + 1;
      });
      
      const sorted = Object.entries(sectorCounts)
        .map(([sector, count]) => ({ sector, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
      
      setSectors(sorted);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-20 bg-muted rounded-lg" />;

  return (
    <>
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-primary" />
          <h3 className="font-manrope font-bold text-lg text-foreground">Today's Trending Sectors</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectors.map(({ sector, count }) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className="bg-gradient-to-br from-green-pale to-primary/5 border border-primary/20 rounded-xl p-3 text-center hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="font-bold text-primary group-hover:scale-110 transition-transform">{count}</div>
              <div className="text-xs text-foreground font-semibold leading-tight mt-1">{sector}</div>
            </button>
          ))}
        </div>
      </div>
      
      {selectedSector && <SectorDetailsPanel sector={selectedSector} onClose={() => setSelectedSector(null)} />}
    </>
  );
}