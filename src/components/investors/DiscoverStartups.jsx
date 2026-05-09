import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MiniClusterMap from './MiniClusterMap';
import EmbeddedStartupMap from './EmbeddedStartupMap';

const SECTORS = ['AI', 'Life Sciences', 'Fintech', 'B2B Software', 'Aerospace & Defense', 'Energy', 'Consumer'];
const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C'];
const SIZES = ['2-10', '11-50', '51-200', '201-500'];

export default function DiscoverStartups() {
  const [sector, setSector] = useState('');
  const [stage, setStage] = useState('');
  const [size, setSize] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (sector || stage || size) handleSearch();
  }, [sector, stage, size]);

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

      {!loading && results.length === 0 && (sector || stage || size) && (
        <div className="text-center py-4 text-muted-foreground text-sm">No startups match your criteria.</div>
      )}

      {(sector || stage || size) && (
        <>
          <EmbeddedStartupMap sector={sector} stage={stage} size={size} />
          <Link to="/map">
            <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-green-pale font-semibold">
              Explore Full Map <ArrowRight size={14} />
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}