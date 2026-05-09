import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin } from 'lucide-react';

export default function MiniClusterMap({ sector, stage, size, onHubSelect }) {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const filters = {};
    if (sector) filters.sector = sector;
    if (stage) filters.funding_stage = stage;
    if (size) filters.employees = size;

    const query = Object.keys(filters).length > 0 ? filters : {};
    base44.entities.Startup.filter(query, '-created_date', 100).then(startups => {
      const cityCounts = {};
      startups.forEach(s => {
        if (s.city) cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
      });
      
      const clusterList = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count);
      
      setClusters(clusterList);
    }).catch(() => {});
  }, [sector, stage, size]);

  if (clusters.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-green-pale/20 rounded-xl p-4 border border-primary/20">
      <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
        <MapPin size={14} className="text-primary" />
        Geographic Clusters
      </h4>
      <div className="space-y-2">
        {clusters.slice(0, 5).map(({ city, count }) => (
          <button
            key={city}
            onClick={() => {
              if (onHubSelect) onHubSelect({ city, count });
            }}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors text-left"
          >
            <span className="text-xs text-foreground">{city}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/70 rounded-full"
                  style={{ width: `${(count / Math.max(...clusters.map(c => c.count))) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-primary w-6 text-right">{count}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}