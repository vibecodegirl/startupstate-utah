import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { base44 } from '@/api/base44Client';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StartupCard from '@/components/map/StartupCard';
import StartupPreviewPanel from '@/components/map/StartupPreviewPanel';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const sectors = ['All Sectors', 'AI', 'Aerospace & Defense', 'Life Sciences', 'Fintech', 'B2B Software', 'Other'];
const stages = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Bootstrapped'];
const sizes = ['All Sizes', '2-10', '11-50', '51-200', '201-500', '500+'];

export default function StartupMap() {
  const [startups, setStartups] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All Sectors');
  const [stage, setStage] = useState('All Stages');
  const [size, setSize] = useState('All Sizes');
  const [hiringOnly, setHiringOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('map');

  useEffect(() => {
    base44.entities.Startup.list('-created_date', 200).then(data => {
      setStartups(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = startups;
    if (search) result = result.filter(s => s.company_name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()));
    if (sector !== 'All Sectors') result = result.filter(s => s.sector === sector);
    if (stage !== 'All Stages') result = result.filter(s => s.funding_stage === stage);
    if (size !== 'All Sizes') result = result.filter(s => s.employees === size);
    if (hiringOnly) result = result.filter(s => s.hiring);
    setFiltered(result);
  }, [search, sector, stage, size, hiringOnly, startups]);

  const mappable = filtered.filter(s => s.latitude && s.longitude);

  return (
    <div className="min-h-screen pt-16 bg-muted/30">
      {/* Top bar */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search startups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-muted/30"
            />
          </div>

          {/* Filter toggles */}
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 border-border">
            <SlidersHorizontal size={14} />
            Filters
            {(sector !== 'All Sectors' || stage !== 'All Stages' || size !== 'All Sizes' || hiringOnly) && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {['map', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${view === v ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}>
                {v}
              </button>
            ))}
          </div>

          <span className="text-sm text-muted-foreground ml-auto">
            {filtered.length} startup{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="border-t border-border px-4 py-3 flex flex-wrap gap-3 bg-muted/20">
            {[
              { label: 'Sector', value: sector, options: sectors, setter: setSector },
              { label: 'Stage', value: stage, options: stages, setter: setStage },
              { label: 'Size', value: size, options: sizes, setter: setSize },
            ].map(f => (
              <select key={f.label} value={f.value} onChange={e => f.setter(e.target.value)}
                className="text-xs border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
              <input type="checkbox" checked={hiringOnly} onChange={e => setHiringOnly(e.target.checked)} className="accent-primary" />
              Hiring only
            </label>
            <button onClick={() => { setSector('All Sectors'); setStage('All Stages'); setSize('All Sizes'); setHiringOnly(false); }}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <X size={12} /> Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Map view */}
        {view === 'map' && (
          <>
            <div className="flex-1 relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <MapContainer
                  center={[40.7608, -111.891]}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {mappable.map(s => (
                    <Marker
                      key={s.id}
                      position={[s.latitude, s.longitude]}
                      eventHandlers={{ click: () => setSelected(s) }}
                    >
                      <Popup>
                        <div className="min-w-48">
                          <p className="font-bold text-sm">{s.company_name}</p>
                          <p className="text-xs text-gray-500">{s.sector} · {s.funding_stage}</p>
                          {s.description && <p className="text-xs mt-1 line-clamp-2">{s.description}</p>}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>

            {/* Side list panel */}
            <div className="w-80 bg-white border-l border-border overflow-y-auto">
              <div className="p-4 border-b border-border">
                <h2 className="font-manrope font-bold text-sm text-foreground">{filtered.length} Companies</h2>
              </div>
              <div className="p-3 space-y-3">
                {filtered.slice(0, 30).map(s => (
                  <div key={s.id} onClick={() => setSelected(s)} className="cursor-pointer">
                    <StartupCard startup={s} compact disableLink />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview slideout */}
            {selected && <StartupPreviewPanel startup={selected} onClose={() => setSelected(null)} />}
          </>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(s => <StartupCard key={s.id} startup={s} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}