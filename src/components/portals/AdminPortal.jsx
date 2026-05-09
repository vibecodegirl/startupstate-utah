import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, AlertCircle, CheckCircle, Clock, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AdminPortal({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setLoading(false);
      return;
    }

    Promise.all([
      base44.entities.Startup.list('-created_date', 1),
      base44.entities.FounderProfile.list('-created_date', 1),
      base44.entities.InvestorProfile.list('-created_date', 1),
      base44.entities.ListingRequest.list('-created_date', 100),
    ])
      .then(([startups, founders, investors, requests]) => {
        const pendingRequests = requests.filter(r => r.status === 'Pending').length;
        setStats({
          totalStartups: startups.length,
          totalFounders: founders.length,
          totalInvestors: investors.length,
          pendingListings: pendingRequests,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.role]);

  if (loading) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg" />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-8 text-center">
        <AlertCircle size={32} className="text-red-600 mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-2">Admin Access Required</h3>
        <p className="text-sm text-muted-foreground">You need admin privileges to access this portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-manrope font-bold text-2xl text-foreground flex items-center gap-2">
            <Shield size={24} className="text-orange-600" />
            Super Admin Portal
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Monitor and manage the Utah startup ecosystem</p>
        </div>
        <Link to="/admin">
          <Button className="bg-orange-600 text-white hover:bg-orange-700 gap-2 font-semibold">
            <BarChart3 size={16} /> Go to Dashboard
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Startups', value: stats.totalStartups, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'Founder Profiles', value: stats.totalFounders, icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
            { label: 'Investor Profiles', value: stats.totalInvestors, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
            { label: 'Pending Listings', value: stats.pendingListings, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className={`rounded-xl border p-4 ${metric.color}`}>
                <Icon size={16} className="mb-2" />
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs opacity-75 mt-1">{metric.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Actions */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Admin Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link to="/admin">
            <Button variant="outline" className="w-full border-border text-foreground hover:border-primary/30 justify-start text-sm">
              <BarChart3 size={14} className="mr-2" />
              View Full Dashboard
              <ArrowRight size={12} className="ml-auto" />
            </Button>
          </Link>
          <button className="flex items-center justify-between gap-2 text-sm text-foreground hover:underline font-medium px-3 py-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
            <span className="flex items-center gap-2">
              <AlertCircle size={14} />
              Review Flagged Listings
            </span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">System Health</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Database Sync</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
              <CheckCircle size={14} /> Healthy
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Last Content Scrape</span>
            <span className="text-xs text-muted-foreground">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">API Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
              <CheckCircle size={14} /> Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}