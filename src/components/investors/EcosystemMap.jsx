import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function EcosystemMap() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Startup.list('-created_date', 500).then(startups => {
      const cityCounts = {};
      startups.forEach(s => {
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
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-muted rounded-lg" />;

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <MapPin size={18} className="text-primary" />
        <h3 className="font-manrope font-bold text-lg text-foreground">Investment Hubs Across Utah</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {hubs.map(hub => (
          <div key={hub.city} className="bg-gradient-to-br from-green-pale/40 to-primary/5 border border-primary/20 rounded-xl p-4 hover:shadow-md hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">{hub.city}</h4>
                <p className="text-2xl font-bold text-primary">{hub.count}</p>
              </div>
              <Sparkles size={16} className="text-primary/60" />
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {hub.sectors.length > 0 
                ? hub.sectors.join(', ')
                : 'Mixed sectors'
              }
            </div>
          </div>
        ))}
      </div>

      <Link to="/map">
        <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-green-pale font-semibold">
          View Interactive Map
        </Button>
      </Link>
    </div>
  );
}