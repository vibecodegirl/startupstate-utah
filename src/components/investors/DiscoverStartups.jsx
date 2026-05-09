import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StartupPreviewPanel from '@/components/map/StartupPreviewPanel';

const SECTORS = ['AI', 'Life Sciences', 'Fintech', 'B2B Software', 'Aerospace & Defense', 'Energy', 'Consumer'];
const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C'];
const SIZES = ['2-10', '11-50', '51-200', '201-500'];

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DiscoverStartups = forwardRef(function DiscoverStartups({ onHubSelect, selectedHub }, ref) {
  const [sector, setSector] = useState('');
  const [stage, setStage] = useState('');
  const [size, setSize] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapStartups, setMapStartups] = useState([]);
  const [mapCenter, setMapCenter] = useState([39.3210, -111.0937]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapZoom, setMapZoom] = useState(7);

  const handleSearch = async () => {
    setLoading(true);
    const filters = {};
    if (sector) filters.sector = sector;
    if (stage) filters.funding_stage = stage;
    if (size) filters.employees = size;

    const query = Object.keys(filters).length > 0 ? filters : {};
    const startups = await base44.entities.Startup.filter(query, '-created_date', 6).catch(() => []);
    setResults(startups);
    setLoading(false);
  };

  useEffect(() => {
    // Load map startups
    setMapLoading(true);
    const filters = {};
    if (sector) filters.sector = sector;
    if (stage) filters.funding_stage = stage;
    if (size) filters.employees = size;

    const query = Object.keys(filters).length > 0 ? filters : {};
    base44.entities.Startup.filter(query, '-created_date', 100).then(startups => {
      const validStartups = startups.filter(s => s.latitude && s.longitude);
      setMapStartups(validStartups);
      
      if (validStartups.length > 0) {
        const avgLat = validStartups.reduce((sum, s) => sum + s.latitude, 0) / validStartups.length;
        const avgLon = validStartups.reduce((sum, s) => sum + s.longitude, 0) / validStartups.length;
        setMapCenter([avgLat, avgLon]);
      }
      setMapLoading(false);
    }).catch(() => setMapLoading(false));
  }, [sector, stage, size]);

  useEffect(() => {
    if (sector || stage || size) handleSearch();
  }, [sector, stage, size]);

  useEffect(() => {
    if (selectedHub && mapStartups.length > 0) {
      const hubStartups = mapStartups.filter(s => s.county === selectedHub.city);
      if (hubStartups.length > 0) {
        const avgLat = hubStartups.reduce((sum, s) => sum + s.latitude, 0) / hubStartups.length;
        const avgLon = hubStartups.reduce((sum, s) => sum + s.longitude, 0) / hubStartups.length;
        setMapCenter([avgLat, avgLon]);
        setMapZoom(9);
      }
    }
  }, [selectedHub, mapStartups]);

  useImperativeHandle(ref, () => ({
    focusStartup: (startup) => {
      setMapCenter([startup.latitude, startup.longitude]);
      setMapZoom(13);
    }
  }), []);

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="font-manrope font-bold text-lg text-foreground mb-4">Discover Matching Startups</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={sector}
          onChange={e => setSector(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-sm text-foreground"
        >
          <option value="">All Sectors</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={stage}
          onChange={e => setStage(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-sm text-foreground"
        >
          <option value="">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={size}
          onChange={e => setSize(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-sm text-foreground"
        >
          <option value="">All Sizes</option>
          {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-4 text-muted-foreground text-sm">Searching...</div>}

      {!loading && results.length > 0 && (
        <div className="space-y-2 mb-6">
          {results.map(s => (
            <Link key={s.id} to={`/startups/${s.id}`}>
              <div className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors flex items-center justify-between group cursor-pointer">
                <div>
                  <div className="font-semibold text-sm text-foreground">{s.company_name}</div>
                  <div className="text-xs text-muted-foreground">{s.sector} • {s.funding_stage}</div>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!mapLoading && mapStartups.length > 0 && (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm h-80 mb-6">
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {mapStartups.map(startup => (
              <Marker
                key={startup.id}
                position={[startup.latitude, startup.longitude]}
                icon={defaultIcon}
                eventHandlers={{
                  click: () => setSelectedStartup(startup)
                }}
              />
            ))}
          </MapContainer>
        </div>
      )}

      <Link to="/map">
        <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-green-pale font-semibold">
          Explore Full Map <ArrowRight size={14} />
        </Button>
      </Link>

      {selectedStartup && (
        <StartupPreviewPanel 
          startup={selectedStartup} 
          onClose={() => setSelectedStartup(null)} 
        />
      )}
    </div>
  );
});

export default DiscoverStartups;