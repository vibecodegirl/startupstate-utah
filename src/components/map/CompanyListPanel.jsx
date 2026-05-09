import { useState } from 'react';
import { List, Table, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import StartupCard from './StartupCard';

const sectorColors = {
  'AI': 'bg-blue-100 text-blue-700',
  'Aerospace & Defense': 'bg-orange-100 text-orange-700',
  'Life Sciences': 'bg-red-100 text-red-700',
  'Fintech': 'bg-purple-100 text-purple-700',
  'B2B Software': 'bg-green-100 text-green-700',
  'Marketplaces': 'bg-pink-100 text-pink-700',
  'Energy': 'bg-yellow-100 text-yellow-700',
  'Consumer': 'bg-indigo-100 text-indigo-700',
  'Security': 'bg-gray-100 text-gray-700',
  'Other': 'bg-gray-100 text-gray-700',
};

const stageColors = {
  'Pre-Seed': 'bg-yellow-100 text-yellow-700',
  'Seed': 'bg-lime-100 text-lime-700',
  'Series A': 'bg-emerald-100 text-emerald-700',
  'Series B': 'bg-teal-100 text-teal-700',
  'Series C': 'bg-cyan-100 text-cyan-700',
  'Series D+': 'bg-sky-100 text-sky-700',
  'Bootstrapped': 'bg-stone-100 text-stone-700',
};

export default function CompanyListPanel({ startups, onSelect }) {
  const [listView, setListView] = useState('cards'); // 'cards' | 'table'

  return (
    <div className="w-80 bg-white border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <h2 className="font-manrope font-bold text-sm text-foreground">
          {startups.length} Companies
        </h2>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setListView('cards')}
            title="Card view"
            className={`p-1.5 transition-colors ${listView === 'cards' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setListView('table')}
            title="Table view"
            className={`p-1.5 transition-colors ${listView === 'table' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}
          >
            <Table size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {listView === 'cards' ? (
          <div className="p-3 space-y-3">
            {startups.map(s => (
              <div key={s.id} onClick={() => onSelect(s)} className="cursor-pointer">
                <StartupCard startup={s} compact disableLink />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur z-10">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Company</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Sector</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Stage</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {startups.map(s => (
                <tr
                  key={s.id}
                  onClick={() => onSelect(s)}
                  className="cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <td className="px-3 py-2">
                    <div className="font-semibold text-foreground truncate max-w-[110px]">{s.company_name}</div>
                    {s.city && <div className="text-muted-foreground text-[10px]">{s.city}</div>}
                  </td>
                  <td className="px-3 py-2">
                    {s.sector && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${sectorColors[s.sector] || sectorColors['Other']}`}>
                        {s.sector}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {s.funding_stage && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${stageColors[s.funding_stage] || 'bg-gray-100 text-gray-700'}`}>
                        {s.funding_stage}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <Link
                      to={`/startups/${s.id}`}
                      onClick={e => e.stopPropagation()}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}