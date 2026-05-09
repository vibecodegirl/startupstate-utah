import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, CheckCircle, Clock, AlertCircle, Flag, Users, Building2, Eye, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard({ role }) {
  const [requests, setRequests] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.ListingRequest.list('-created_date', 50),
      base44.entities.Startup.list('-created_date', 50),
    ]).then(([reqs, sts]) => {
      setRequests(reqs);
      setStartups(sts);
      setLoading(false);
    });
  }, []);

  const approveRequest = async (req) => {
    setUpdating(req.id);
    await base44.entities.ListingRequest.update(req.id, { status: 'Approved' });
    await base44.entities.Startup.create({
      company_name: req.company_name,
      linkedin_url: req.company_linkedin,
      address: req.address,
      description: req.description,
      website: req.website,
      funding_stage: req.funding_stage,
      employees: req.employees,
      sector: req.sector,
      verification_status: 'Verified',
      is_claimed: true,
    });
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
    setUpdating(null);
  };

  const rejectRequest = async (req) => {
    setUpdating(req.id);
    await base44.entities.ListingRequest.update(req.id, { status: 'Rejected' });
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r));
    setUpdating(null);
  };

  const flagStartup = async (startup) => {
    await base44.entities.Startup.update(startup.id, { verification_status: 'Flagged' });
    setStartups(prev => prev.map(s => s.id === startup.id ? { ...s, verification_status: 'Flagged' } : s));
  };

  const verifyStartup = async (startup) => {
    await base44.entities.Startup.update(startup.id, { verification_status: 'Verified' });
    setStartups(prev => prev.map(s => s.id === startup.id ? { ...s, verification_status: 'Verified' } : s));
  };

  if (role !== 'admin') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="text-muted-foreground mx-auto mb-4" />
          <h1 className="font-manrope font-bold text-2xl text-foreground mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-4">Switch to the Super Admin role using the role switcher in the header.</p>
        </div>
      </div>
    );
  }

  const pending = requests.filter(r => r.status === 'Pending');
  const flagged = startups.filter(s => s.verification_status === 'Flagged');

  const tabs = [
    { id: 'requests', label: 'Listing Requests', count: pending.length, icon: Clock },
    { id: 'startups', label: 'All Startups', count: startups.length, icon: Building2 },
    { id: 'flags', label: 'Active Flags', count: flagged.length, icon: Flag },
  ];

  return (
    <div className="min-h-screen pt-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <Shield size={22} className="text-orange-600" />
          </div>
          <div>
            <h1 className="font-manrope font-extrabold text-3xl text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Startup State Control Center</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Startups', value: startups.length, icon: Building2, color: 'text-primary bg-green-pale' },
            { label: 'Pending Reviews', value: pending.length, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
            { label: 'Active Flags', value: flagged.length, icon: Flag, color: 'text-red-600 bg-red-50' },
            { label: 'Verified', value: startups.filter(s => s.verification_status === 'Verified').length, icon: CheckCircle, color: 'text-primary bg-green-pale' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon size={18} />
                </div>
                <div className="font-manrope font-extrabold text-2xl text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}>
                <Icon size={15} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full font-bold ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Listing Requests */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                {requests.length === 0 && <p className="text-muted-foreground text-sm py-8 text-center">No listing requests yet.</p>}
                {requests.map(req => (
                  <div key={req.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-manrope font-bold text-base text-foreground">{req.company_name}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>{req.status}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground mb-3">
                          <span><strong className="text-foreground">Sector:</strong> {req.sector}</span>
                          <span><strong className="text-foreground">Stage:</strong> {req.funding_stage}</span>
                          <span><strong className="text-foreground">Size:</strong> {req.employees}</span>
                          <span><strong className="text-foreground">Contact:</strong> {req.contact_email}</span>
                        </div>
                        {req.description && <p className="text-xs text-muted-foreground line-clamp-2">{req.description}</p>}
                      </div>
                      {req.status === 'Pending' && (
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" disabled={updating === req.id} onClick={() => approveRequest(req)}
                            className="bg-primary text-white hover:bg-green-dark gap-1">
                            <Check size={14} /> Approve
                          </Button>
                          <Button size="sm" variant="outline" disabled={updating === req.id} onClick={() => rejectRequest(req)}
                            className="border-destructive/30 text-destructive hover:bg-red-50 gap-1">
                            <X size={14} /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Startups */}
            {activeTab === 'startups' && (
              <div className="space-y-3">
                {startups.map(s => (
                  <div key={s.id} className="bg-white rounded-xl border border-border p-4 shadow-sm flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{s.company_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.verification_status === 'Verified' ? 'bg-green-100 text-green-700' :
                          s.verification_status === 'Flagged' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{s.verification_status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{s.sector} · {s.funding_stage} · {s.employees} employees</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {s.verification_status !== 'Verified' && (
                        <Button size="sm" variant="outline" onClick={() => verifyStartup(s)} className="gap-1 border-primary/30 text-primary hover:bg-green-pale text-xs">
                          <CheckCircle size={12} /> Verify
                        </Button>
                      )}
                      {s.verification_status !== 'Flagged' && (
                        <Button size="sm" variant="outline" onClick={() => flagStartup(s)} className="gap-1 border-red-200 text-red-600 hover:bg-red-50 text-xs">
                          <Flag size={12} /> Flag
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Flags */}
            {activeTab === 'flags' && (
              <div className="space-y-4">
                {flagged.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle size={40} className="mx-auto mb-3 text-primary" />
                    <p className="font-semibold">No active flags — data integrity is clean.</p>
                  </div>
                ) : (
                  flagged.map(s => (
                    <div key={s.id} className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Flag size={15} className="text-red-500" />
                          <h3 className="font-semibold text-sm text-foreground">{s.company_name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{s.sector} · {s.address}</p>
                        {s.data_flags?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {s.data_flags.map(f => <span key={f} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{f}</span>)}
                          </div>
                        )}
                      </div>
                      <Button size="sm" onClick={() => verifyStartup(s)} className="gap-1 bg-primary text-white hover:bg-green-dark shrink-0">
                        <CheckCircle size={13} /> Resolve
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}