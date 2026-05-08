import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, MapPin, ExternalLink, Video, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const SAMPLE_EVENTS = [
  {
    id: 's1', title: 'Silicon Slopes Summit 2025', description: 'Utah\'s premier tech conference bringing together thousands of entrepreneurs, investors, and innovators.',
    event_date: '2025-01-15T09:00:00', location: 'Salt Lake City, UT', url: 'https://siliconslopes.com/events',
    organizer: 'Silicon Slopes', event_type: 'Conference', sectors: ['AI', 'Fintech', 'B2B Software'], is_virtual: false,
  },
  {
    id: 's2', title: 'Utah Venture Entrepreneur Forum', description: 'Connect with Utah\'s top VCs and angel investors. Pitch competitions and networking for growth-stage startups.',
    event_date: '2025-02-10T14:00:00', location: 'Provo, UT', url: 'https://www.uvef.net',
    organizer: 'UVEF', event_type: 'Networking', sectors: ['All Sectors'], is_virtual: false,
  },
  {
    id: 's3', title: 'Utah Life Science Summit', description: 'BioUtah\'s annual summit connecting Utah\'s biotech, medical device, and pharma ecosystem.',
    event_date: '2025-03-05T08:00:00', location: 'Salt Lake City, UT', url: 'https://bioutah.org/events',
    organizer: 'BioUtah', event_type: 'Conference', sectors: ['Life Sciences'], is_virtual: false,
  },
  {
    id: 's4', title: 'Startup Pitch Night — SBDC', description: 'Monthly pitch competition hosted by the Utah SBDC. Open to all stages. Cash prizes and mentor feedback.',
    event_date: '2025-01-28T18:00:00', location: 'Salt Lake City, UT / Virtual', url: 'https://utahsbdc.org',
    organizer: 'Utah SBDC', event_type: 'Pitch Competition', sectors: ['All Sectors'], is_virtual: true,
  },
  {
    id: 's5', title: '47G Aerospace & Defense Forum', description: 'Utah\'s aerospace and defense industry gathering. Defense primes, suppliers, and startups.',
    event_date: '2025-02-20T09:00:00', location: 'Ogden, UT', url: 'https://www.47g.org',
    organizer: '47G', event_type: 'Conference', sectors: ['Aerospace & Defense'], is_virtual: false,
  },
  {
    id: 's6', title: 'NSF I-Corps Utah Workshop', description: 'Free customer discovery training for researchers and academic founders commercializing technology.',
    event_date: '2025-01-20T09:00:00', location: 'University of Utah', url: 'https://tco.utah.edu',
    organizer: 'U of U Tech Commercialization', event_type: 'Workshop', sectors: ['AI', 'Life Sciences'], is_virtual: false,
  },
];

const eventTypeColors = {
  'Conference': 'bg-blue-100 text-blue-700',
  'Pitch Competition': 'bg-purple-100 text-purple-700',
  'Workshop': 'bg-orange-100 text-orange-700',
  'Networking': 'bg-green-100 text-green-700',
  'Demo Day': 'bg-yellow-100 text-yellow-700',
  'Mentorship': 'bg-pink-100 text-pink-700',
};

const types = ['All Types', 'Conference', 'Pitch Competition', 'Workshop', 'Networking', 'Demo Day'];

export default function Events() {
  const [dbEvents, setDbEvents] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [virtualOnly, setVirtualOnly] = useState(false);

  useEffect(() => {
    base44.entities.Event.list('-event_date', 50).then(setDbEvents).catch(() => {});
  }, []);

  const allEvents = [...SAMPLE_EVENTS, ...dbEvents];

  const filtered = allEvents.filter(e => {
    const matchType = typeFilter === 'All Types' || e.event_type === typeFilter;
    const matchVirtual = !virtualOnly || e.is_virtual;
    return matchType && matchVirtual;
  });

  return (
    <div className="min-h-screen pt-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-3">Events & Connections</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pitch nights, conferences, workshops, and networking events across Utah's startup ecosystem.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center mb-8">
          <div className="flex gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${typeFilter === t ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:border-primary/40'}`}>
                {t}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer ml-auto">
            <input type="checkbox" checked={virtualOnly} onChange={e => setVirtualOnly(e.target.checked)} className="accent-primary" />
            Virtual only
          </label>
        </div>

        <p className="text-sm text-muted-foreground mb-5">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map(event => {
            const date = new Date(event.event_date);
            return (
              <div key={event.id} className="bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Date strip */}
                <div className="bg-primary px-5 py-3 flex items-center justify-between">
                  <div className="text-white">
                    <div className="font-manrope font-black text-2xl">{format(date, 'dd')}</div>
                    <div className="text-white/80 text-xs font-semibold uppercase">{format(date, 'MMM yyyy')}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${eventTypeColors[event.event_type] || 'bg-white/20 text-white'}`}>
                      {event.event_type}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-manrope font-bold text-base text-foreground mb-2">{event.title}</h3>
                  <p className="text-xs text-primary font-medium mb-3">{event.organizer}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.description}</p>

                  <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      {format(date, 'MMMM d, yyyy · h:mm a')}
                    </div>
                    <div className="flex items-center gap-2">
                      {event.is_virtual ? <Video size={12} className="text-blue-500" /> : <MapPin size={12} />}
                      {event.location}
                      {event.is_virtual && <span className="text-blue-600 font-medium">(Virtual)</span>}
                    </div>
                  </div>

                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full gap-2 border-primary/30 text-primary hover:bg-green-pale font-semibold">
                      Register / Learn More <ExternalLink size={13} />
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* External link */}
        <div className="bg-green-pale rounded-2xl border border-primary/20 p-6 text-center mb-12">
          <h3 className="font-manrope font-bold text-lg text-foreground mb-2">More Utah Events</h3>
          <p className="text-muted-foreground text-sm mb-4">See the full event calendar on the official Utah business portal.</p>
          <a href="https://business.utah.gov/events/list/?tribe_eventcategory%5B0%5D=2732" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary text-white hover:bg-green-dark gap-2 font-semibold">
              View All Events on business.utah.gov <ExternalLink size={14} />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}