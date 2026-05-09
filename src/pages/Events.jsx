import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, MapPin, ExternalLink, Video, Filter, Newspaper, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import FounderStorySubmissionForm from '@/components/founders/FounderStorySubmissionForm';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';

const SAMPLE_NEWS = [
  {
    id: 'n1',
    title: 'Utah Named #1 Best State to Start a Business in 2025',
    excerpt: 'For the 19th consecutive year, Utah has been ranked as the best state for entrepreneurship.',
    category: 'News',
    date: '2025-01-10',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    source: 'WalletHub',
    url: 'https://startup.utah.gov'
  },
  {
    id: 'n2',
    title: 'Silicon Slopes Ecosystem Hits $4.2B in Annual VC Investment',
    excerpt: 'Utah\'s tech ecosystem continues to grow with record-breaking venture capital activity.',
    category: 'News',
    date: '2025-01-05',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    source: 'Nucleus Institute',
    url: 'https://startup.utah.gov'
  },
  {
    id: 'n3',
    title: 'New Life Sciences Hub Opens in Salt Lake City',
    excerpt: 'BioInnovations Gateway announces expanded space for biotech and medical device companies.',
    category: 'News',
    date: '2024-12-28',
    image: 'https://images.unsplash.com/photo-1576091160550-112173f7f477?w=400&h=250&fit=crop',
    source: 'BioUtah',
    url: 'https://bioutah.org'
  },
];

const SAMPLE_EVENTS = [
  {
    id: 's1', title: 'Silicon Slopes Summit 2026', description: 'Utah\'s premier tech conference bringing together thousands of entrepreneurs, investors, and innovators. Network with leading founders and investors shaping the future.',
    event_date: '2026-06-15T09:00:00', location: 'Salt Lake City Convention Center', url: 'https://siliconslopes.com/events',
    organizer: 'Silicon Slopes', event_type: 'Conference', sectors: ['AI', 'Fintech', 'B2B Software'], is_virtual: false, is_internal: true,
  },
  {
    id: 's2', title: 'Utah Venture Entrepreneur Forum', description: 'Connect with Utah\'s top VCs and angel investors. Pitch competitions and networking for growth-stage startups looking to raise capital.',
    event_date: '2026-07-10T14:00:00', location: 'The Lassonde Entrepreneur Institute, Provo', url: 'https://www.uvef.net',
    organizer: 'UVEF', event_type: 'Networking', sectors: ['All Sectors'], is_virtual: false,
  },
  {
    id: 's3', title: 'Utah Life Science Summit', description: 'BioUtah\'s annual summit connecting Utah\'s biotech, medical device, and pharma ecosystem. Advanced research & innovation showcase.',
    event_date: '2026-08-05T08:00:00', location: 'Salt Lake City, UT', url: 'https://bioutah.org/events',
    organizer: 'BioUtah', event_type: 'Conference', sectors: ['Life Sciences'], is_virtual: false,
  },
  {
    id: 's4', title: 'Monthly Startup Pitch Night', description: 'Monthly pitch competition hosted by the Utah SBDC. Open to all stages. Compete for cash prizes and mentor feedback from industry experts.',
    event_date: '2026-06-28T18:00:00', location: 'Salt Lake City / Virtual', url: 'https://utahsbdc.org',
    organizer: 'Utah SBDC', event_type: 'Pitch Competition', sectors: ['All Sectors'], is_virtual: true, is_internal: true,
  },
  {
    id: 's5', title: '47G Aerospace & Defense Forum', description: 'Utah\'s aerospace and defense industry gathering featuring defense primes, suppliers, and innovative startups. Procurement opportunities showcase.',
    event_date: '2026-07-20T09:00:00', location: 'Ogden Eccles Conference Center', url: 'https://www.47g.org',
    organizer: '47G', event_type: 'Conference', sectors: ['Aerospace & Defense'], is_virtual: false,
  },
  {
    id: 's6', title: 'NSF I-Corps Workshop', description: 'Free customer discovery training for researchers and academic founders commercializing technology. Learn lean startup methodologies for deep tech.',
    event_date: '2026-06-20T09:00:00', location: 'University of Utah', url: 'https://tco.utah.edu',
    organizer: 'U of U Tech Commercialization', event_type: 'Workshop', sectors: ['AI', 'Life Sciences'], is_virtual: false,
  },
  {
    id: 's7', title: 'Utah Women Founders Roundtable', description: 'Exclusive networking and mentorship event for female founders and women-led startups. Connect with successful women entrepreneurs in Utah.',
    event_date: '2026-06-25T17:00:00', location: 'The Hub, Downtown Salt Lake City', url: 'https://www.uwbc.org',
    organizer: 'Utah Women\'s Business Center', event_type: 'Networking', sectors: ['All Sectors'], is_virtual: false, is_internal: true,
  },
  {
    id: 's8', title: 'AI & Machine Learning Workshop', description: 'Deep dive workshop on building AI-powered products. Learn deployment strategies, ethical considerations, and Utah\'s AI ecosystem.',
    event_date: '2026-07-15T10:00:00', location: 'Startup State HQ, Salt Lake City', url: 'https://startup.utah.gov',
    organizer: 'Startup State Initiative', event_type: 'Workshop', sectors: ['AI', 'B2B Software'], is_virtual: false,
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
  const [dbNews, setDbNews] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [virtualOnly, setVirtualOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // 'news' or 'events'
  const [eventTab, setEventTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Event.list('-event_date', 50).catch(() => []),
      base44.entities.NewsArticle.list('-publish_date', 50).catch(() => [])
    ]).then(([events, news]) => {
      setDbEvents(events);
      setDbNews(news.filter(n => n.is_active));
    });
  }, []);

  const now = new Date();
  const allEvents = [...SAMPLE_EVENTS, ...dbEvents];
  const upcomingEvents = allEvents.filter(e => new Date(e.event_date) >= now);
  const pastEvents = allEvents.filter(e => new Date(e.event_date) < now);

  const getFilteredEvents = (events) => {
    return events.filter(e => {
      const matchType = typeFilter === 'All Types' || e.event_type === typeFilter;
      const matchVirtual = !virtualOnly || e.is_virtual;
      return matchType && matchVirtual;
    });
  };

  const filtered = getFilteredEvents(eventTab === 'upcoming' ? upcomingEvents : pastEvents);
  const newsArticles = [...SAMPLE_NEWS, ...dbNews].sort((a, b) => {
    const dateA = new Date(a.publish_date || a.date);
    const dateB = new Date(b.publish_date || b.date);
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen pt-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl text-foreground mb-3">
            News & Events
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated on Utah's startup ecosystem — from breaking news to upcoming events and opportunities.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-10 border-b border-border">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'events'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Calendar size={16} className="inline mr-2" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'news'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Newspaper size={16} className="inline mr-2" />
            News
          </button>
        </div>

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="mb-16">
            {/* Share Your Story CTA */}
            <div className="mb-8 bg-gradient-to-r from-primary/5 to-green-pale/30 rounded-2xl border border-primary/20 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-manrope font-bold text-lg text-foreground mb-1">Share Your Founder Story</h3>
                  <p className="text-sm text-muted-foreground">Inspire other entrepreneurs by sharing your journey, challenges, and wins.</p>
                </div>
                <Button
                  onClick={() => setShowStoryForm(true)}
                  className="gap-2 bg-primary hover:bg-green-dark text-white font-semibold shrink-0"
                >
                  <Plus size={16} /> Share Story
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.map(article => {
                const articleDate = new Date(article.publish_date || article.date);
                return (
                  <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer">
                    <div className="bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                      {/* Image */}
                      <div className="h-40 bg-muted overflow-hidden">
                        <img src={article.image_url || article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{format(articleDate, 'MMM d, yyyy')}</span>
                        </div>
                        <h3 className="font-manrope font-bold text-base text-foreground mb-2 leading-snug line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{article.excerpt}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-primary font-medium">{article.source}</span>
                          <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="mb-16">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mb-8 pb-6 border-b border-border">
              <div className="flex gap-2 flex-wrap">
                {types.map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${typeFilter === t ? 'bg-primary text-white border-primary' : 'bg-white border-border text-foreground hover:border-primary/30'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer ml-auto">
                <input type="checkbox" checked={virtualOnly} onChange={e => setVirtualOnly(e.target.checked)} className="accent-primary rounded" />
                Virtual only
              </label>
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}</p>
              {eventTab === 'upcoming' && (
                <button onClick={() => setEventTab('past')} className="text-sm text-primary font-medium hover:underline">
                  View past events
                </button>
              )}
              {eventTab === 'past' && (
                <button onClick={() => setEventTab('upcoming')} className="text-sm text-primary font-medium hover:underline">
                  View upcoming events
                </button>
              )}
            </div>

            {/* Events grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filtered.map(event => {
                const date = new Date(event.event_date);
                return (
                  <div key={event.id} className="bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                    {/* Date strip */}
                    <div className="bg-primary px-5 py-3 flex items-center justify-between">
                      <div className="text-white">
                        <div className="font-manrope font-black text-2xl">{format(date, 'dd')}</div>
                        <div className="text-white/80 text-xs font-semibold uppercase">{format(date, 'MMM')}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${eventTypeColors[event.event_type] || 'bg-white/20 text-white'}`}>
                          {event.event_type}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-manrope font-bold text-base text-foreground mb-1 line-clamp-2">{event.title}</h3>
                      <p className="text-xs text-primary font-medium mb-3">{event.organizer}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">{event.description}</p>

                      <div className="space-y-1.5 text-xs text-muted-foreground mb-4 py-3 border-y border-border">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-primary/60" />
                          {format(date, 'MMM d, h:mm a')}
                        </div>
                        <div className="flex items-center gap-2">
                          {event.is_virtual ? <Video size={13} className="text-blue-500" /> : <MapPin size={13} className="text-primary/60" />}
                          {event.location}
                        </div>
                      </div>

                      {event.is_internal ? (
                        <Button 
                          onClick={() => setSelectedEventForRegistration(event)}
                          size="sm" 
                          className="w-full gap-2 bg-primary text-white hover:bg-green-dark font-semibold mt-auto"
                        >
                          Register Now
                        </Button>
                      ) : (
                        <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <Button variant="outline" size="sm" className="w-full gap-2 border-primary/30 text-primary hover:bg-green-pale font-semibold">
                            Register <ExternalLink size={12} />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* External link */}
            <div className="bg-gradient-to-r from-green-pale to-white rounded-2xl border border-primary/20 p-8 text-center">
              <Newspaper size={28} className="text-primary mx-auto mb-3 opacity-40" />
              <h3 className="font-manrope font-bold text-lg text-foreground mb-2">Discover More Events</h3>
              <p className="text-muted-foreground text-sm mb-5 max-w-xl mx-auto">Browse Utah's full calendar of startup events, conferences, and networking opportunities.</p>
              <a href="https://business.utah.gov/events/list/?tribe_eventcategory%5B0%5D=2732" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary text-white hover:bg-green-dark gap-2 font-semibold">
                  View All Events <ExternalLink size={14} />
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Founder Story Submission Form */}
        {showStoryForm && (
          <FounderStorySubmissionForm onClose={() => setShowStoryForm(false)} />
        )}

        {/* Event Registration Form */}
        {selectedEventForRegistration && (
          <EventRegistrationForm 
            event={selectedEventForRegistration} 
            onClose={() => setSelectedEventForRegistration(null)} 
          />
        )}
      </div>
    </div>
  );
}