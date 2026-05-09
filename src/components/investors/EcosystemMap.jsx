import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin } from 'lucide-react';
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
  const [startups, setStartups] = useState([]);
  const [center, setCenter] = useState([39.3210, -111.0937]); // Utah center
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    base44.entities.Startup.list('-created_date', 500).then(data => {
      const validStartups = data.filter(s => s.latitude && s.longitude);
      setStartups(validStartups);
      
      if (validStartups.length > 0) {
        const avgLat = validStartups.reduce((sum, s) => sum + s.latitude, 0) / validStartups.length;
        const avgLon = validStartups.reduce((sum, s) => sum + s.longitude, 0) / validStartups.length;
        setCenter([avgLat, avgLon]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-96 bg-muted rounded-2xl" />;

  return (
    <>
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm h-96">
        <MapContainer ref={mapRef} center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
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