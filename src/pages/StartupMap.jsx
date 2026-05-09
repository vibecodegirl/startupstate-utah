import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { base44 } from '@/api/base44Client';
import { Search, Filter, X, SlidersHorizontal, ExternalLink, CheckCircle, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StartupCard from '@/components/map/StartupCard';
import StartupPreviewPanel from '@/components/map/StartupPreviewPanel';
import CompanyListPanel from '@/components/map/CompanyListPanel';
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

function ColumnFilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isFiltered = value !== options[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex items-center gap-1 cursor-pointer group select-none" onClick={() => setOpen(o => !o)}>
      <span className={`text-xs uppercase tracking-wider font-semibold ${isFiltered ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
      <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''} ${isFiltered ? 'text-primary' : 'text-muted-foreground'}`} />
      {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-primary absolute -top-1 -right-2" />}
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-50 py-1 min-w-[140px]" onClick={e => e.stopPropagation()}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted/60 transition-colors ${value === opt ? 'text-primary font-semibold bg-green-pale' : 'text-foreground'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StartupMap() {
  const [startups, setStartups] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [sector, setSector] = useState('All Sectors');
  const [stage, setStage] = useState('All Stages');
  const [size, setSize] = useState('All Sizes');
  const [hiringOnly, setHiringOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('map');

  useEffect(() => {
    base44.entities.Startup.list('-created_date', 500).then(data => {
      setStartups(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = startups;
    if (search) result = result.filter(s => s.company_name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()));
    if (companySearch) result = result.filter(s => s.company_name?.toLowerCase().includes(companySearch.toLowerCase()));
    if (locationSearch) result = result.filter(s =>
      s.city?.toLowerCase().includes(locationSearch.toLowerCase()) ||
      s.county?.toLowerCase().includes(locationSearch.toLowerCase()) ||
      s.address?.toLowerCase().includes(locationSearch.toLowerCase())
    );
    if (sector !== 'All Sectors') result = result.filter(s => s.sector === sector);
    if (stage !== 'All Stages') result = result.filter(s => s.funding_stage === stage);
    if (size !== 'All Sizes') result = result.filter(s => s.employees === size);
    if (hiringOnly) result = result.filter(s => s.hiring);
    setFiltered(result);
  }, [search, companySearch, locationSearch, sector, stage, size, hiringOnly, startups]);

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
            {(sector !== 'All Sectors' || stage !== 'All Stages' || size !== 'All Sizes' || hiringOnly || companySearch || locationSearch) && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {['map', 'list', 'table'].map(v => (
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
          <div className="border-t border-border px-4 py-3 flex flex-wrap gap-3 bg-muted/20 items-center">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Company name..."
                value={companySearch}
                onChange={e => setCompanySearch(e.target.value)}
                className="pl-7 pr-3 py-2 text-xs border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 w-40"
              />
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="City or county..."
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                className="pl-7 pr-3 py-2 text-xs border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 w-40"
              />
            </div>
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
            <button onClick={() => { setCompanySearch(''); setLocationSearch(''); setSector('All Sectors'); setStage('All Stages'); setSize('All Sizes'); setHiringOnly(false); }}
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

            <CompanyListPanel startups={filtered} onSelect={setSelected} />

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

        {/* Table view */}
        {view === 'table' && (
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[35%]" />
                  <col className="w-[18%]" />
                  <col className="w-[15%]" />
                  <col className="w-[12%]" />
                  <col className="w-[18%]" />
                  <col className="w-[2%]" />
                </colgroup>
                <thead className="sticky top-0 bg-white border-b border-border z-10 shadow-sm">
                  <tr>
                    <th className="text-left px-5 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Company</span>
                        <div className="relative">
                          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={companySearch}
                            onChange={e => setCompanySearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className={`pl-6 pr-2 py-1 text-xs border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary/40 ${companySearch ? 'border-primary bg-green-pale' : 'border-border bg-muted/30'}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="text-left px-4 py-3">
                      <ColumnFilterDropdown label="Sector" value={sector} options={sectors} onChange={setSector} />
                    </th>
                    <th className="text-left px-4 py-3">
                      <ColumnFilterDropdown label="Stage" value={stage} options={stages} onChange={setStage} />
                    </th>
                    <th className="text-left px-4 py-3">
                      <ColumnFilterDropdown label="Size" value={size} options={sizes} onChange={setSize} />
                    </th>
                    <th className="text-left px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Location</span>
                        <div className="relative">
                          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={locationSearch}
                            onChange={e => setLocationSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className={`pl-6 pr-2 py-1 text-xs border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary/40 ${locationSearch ? 'border-primary bg-green-pale' : 'border-border bg-muted/30'}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(s => (
                    <tr key={s.id} onClick={() => setSelected(s)} className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {s.photo_url && <img src={s.photo_url} alt={s.company_name} className="w-7 h-7 rounded-md object-cover border border-border shrink-0" />}
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate">{s.company_name}</div>
                            {s.description && <div className="text-xs text-muted-foreground truncate">{s.description}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {s.sector && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">{s.sector}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {s.funding_stage && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">{s.funding_stage}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.employees || '—'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground truncate">
                        {s.city ? `${s.city}${s.county ? `, ${s.county}` : ''}` : '—'}
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}