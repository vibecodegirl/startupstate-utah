import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function EmbeddedStartupMap({ sector, stage, size }) {
  const [startups, setStartups] = useState([]);
  const [center, setCenter] = useState([39.3210, -111.0937]); // Utah center
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filters = {};
    if (sector) filters.sector = sector;
    if (stage) filters.funding_stage = stage;
    if (size) filters.employees = size;

    const query = Object.keys(filters).length > 0 ? filters : {};
    base44.entities.Startup.filter(query, '-created_date', 50).then(data => {
      const validStartups = data.filter(s => s.latitude && s.longitude);
      setStartups(validStartups);
      
      if (validStartups.length > 0) {
        const avgLat = validStartups.reduce((sum, s) => sum + s.latitude, 0) / validStartups.length;
        const avgLon = validStartups.reduce((sum, s) => sum + s.longitude, 0) / validStartups.length;
        setCenter([avgLat, avgLon]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [sector, stage, size]);

  if (loading) return <div className="animate-pulse h-80 bg-muted rounded-xl" />;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm h-80">
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {startups.map(startup => (
          <Marker
            key={startup.id}
            position={[startup.latitude, startup.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{startup.company_name}</div>
                <div className="text-xs text-gray-600">{startup.sector}</div>
                <div className="text-xs text-gray-600">{startup.funding_stage}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}