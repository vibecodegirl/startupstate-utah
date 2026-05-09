import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Sparkles } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StartupPreviewPanel from '@/components/map/StartupPreviewPanel';

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ zoomToCity }) {
  const map = useMap();
  
  useEffect(() => {
    if (zoomToCity && zoomToCity.lat && zoomToCity.lon) {
      map.flyTo([zoomToCity.lat, zoomToCity.lon], 11, { duration: 2 });
    }
  }, [zoomToCity, map]);
  
  return null;
}

export default function EcosystemMap({ zoomToCity }) {
  const [hubs, setHubs] = useState([]);
  const [startups, setStartups] = useState([]);
  const [center, setCenter] = useState([39.3210, -111.0937]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Startup.list('-created_date', 500).catch(() => []),
      base44.entities.Startup.list('-created_date', 500).catch(() => [])
    ]).then(([startupsList, allStartups]) => {
      const validStartups = startupsList.filter(s => s.latitude && s.longitude);
      setStartups(validStartups);
      
      if (validStartups.length > 0) {
        const avgLat = validStartups.reduce((sum, s) => sum + s.latitude, 0) / validStartups.length;
        const avgLon = validStartups.reduce((sum, s) => sum + s.longitude, 0) / validStartups.length;
        setCenter([avgLat, avgLon]);
      }

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

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm h-80 mt-4">
        <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapController zoomToCity={zoomToCity} />
          {startups.map(startup => (
            <Marker
              key={startup.id}
              position={[startup.latitude, startup.longitude]}
              icon={defaultIcon}
              eventHandlers={{
                click: () => setSelectedStartup(startup)
              }}
            >
              <Popup>
                <div className="text-sm cursor-pointer" onClick={() => setSelectedStartup(startup)}>
                  <div className="font-semibold">{startup.company_name}</div>
                  <div className="text-xs text-gray-600">{startup.sector}</div>
                  <div className="text-xs text-gray-600">{startup.funding_stage}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedStartup && (
        <StartupPreviewPanel 
          startup={selectedStartup} 
          onClose={() => setSelectedStartup(null)} 
        />
      )}
    </>
  );
}