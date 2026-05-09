import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Sparkles } from 'lucide-react';

export default function EcosystemMap({ zoomToCity }) {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Startup.list('-created_date', 500).catch(() => []).then(allStartups => {
      // Calculate hubs
      const cityCounts = {};
      allStartups.forEach(s => {
        if (s.city) {
          if (!cityCounts[s.city]) cityCounts[s.city] = { count: 0, sectors: new Set(), lat: s.latitude, lon: s.longitude };
          cityCounts[s.city].count++;
          if (s.sector) cityCounts[s.city].sectors.add(s.sector);
        }
      });

      const hubsList = Object.entries(cityCounts)
        .map(([city, data]) => ({
          city,
          count: data.count,
          sectors: Array.from(data.sectors).slice(0, 2),
          lat: data.lat,
          lon: data.lon
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setHubs(hubsList);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse h-80 bg-muted rounded-2xl" />;

  return (
    <>
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={18} className="text-primary" />
          <h3 className="font-manrope font-bold text-lg text-foreground">Investment Hubs Across Utah</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {hubs.map(hub => (
            <button
              key={hub.city}
              onClick={() => {
                // Trigger map zoom (handled by MapController via zoomToCity prop)
              }}
              className="bg-gradient-to-br from-green-pale/40 to-primary/5 border border-primary/20 rounded-xl p-4 hover:shadow-md hover:border-primary/50 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{hub.city}</h4>
                  <p className="text-2xl font-bold text-primary">{hub.count}</p>
                </div>
                <Sparkles size={16} className="text-primary/60 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {hub.sectors.length > 0 
                  ? hub.sectors.join(', ')
                  : 'Mixed sectors'
                }
              </div>
            </button>
          ))}
        </div>
      </div>


    </>
  );
}