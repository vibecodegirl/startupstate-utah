import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, AlertCircle, Zap, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DEMO_INVESTOR_EMAILS = ['demo-investor-1@example.com', 'demo-investor-2@example.com', 'demo-investor-3@example.com'];

export default function InvestorPortal({ user }) {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Check if we're viewing a demo profile
    const currentRole = sessionStorage.getItem('currentRole');
    const isDemoMode = currentRole === 'investor';

    // Use demo email for investor demo role - works even without auth
    const emailToUse = isDemoMode ? DEMO_INVESTOR_EMAILS[0] : user?.email;

    if (!emailToUse) {
      // Allow demo mode to load even without user email
      if (!isDemoMode) {
        setLoading(false);
        return;
      }
    }

    Promise.all([
      base44.entities.InvestorProfile.filter({ user_email: emailToUse }, '', 1),
      base44.entities.StartupMatch.filter({ investor_email: emailToUse }, '-match_score', 5),
    ])
      .then(([profiles, matchData]) => {
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          generateNotifications(profiles[0], matchData);
        }
        setMatches(matchData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.email]);

  const generateNotifications = (profile, matchData) => {
    const notifs = [];
    if (!profile.profile_complete) {
      notifs.push({
        id: 'complete-profile',
        type: 'warning',
        title: 'Complete Your Profile',
        description: 'Finish your profile to receive better startup matches',
        icon: AlertCircle,
      });
    }
    if (matchData && matchData.length > 0) {
      notifs.push({
        id: 'new-matches',
        type: 'info',
        title: `${matchData.length} New Startup Matches`,
        description: 'View startups that match your investment criteria',
        icon: Zap,
      });
    }
    setNotifications(notifs);
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-manrope font-bold text-2xl text-foreground flex items-center gap-2">
            <TrendingUp size={24} className="text-purple-600" />
            Investor Portal
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Discover and track startup investment opportunities</p>
        </div>
        <Link to="/investor-profile">
          <Button className="bg-primary text-white hover:bg-green-dark gap-2 font-semibold">
            <Plus size={16} /> Edit Profile
          </Button>
        </Link>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map(notif => {
            const Icon = notif.icon;
            const bgColor = notif.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
            const textColor = notif.type === 'warning' ? 'text-yellow-700' : 'text-blue-700';
            return (
              <div key={notif.id} className={`rounded-lg border p-4 ${bgColor}`}>
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`mt-0.5 shrink-0 ${textColor}`} />
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${textColor}`}>{notif.title}</h3>
                    <p className="text-xs opacity-80 mt-0.5">{notif.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Status */}
      {profile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Investment Profile Card */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Investment Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Investor Name</p>
                <p className="font-medium text-foreground">{profile.investor_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Investor Type</p>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-600 rounded-full">
                  {profile.investor_type}
                </span>
              </div>
              {profile.check_size_min && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Check Size Range</p>
                  <p className="font-medium text-foreground">${profile.check_size_min}K - ${profile.check_size_max}K</p>
                </div>
              )}
            </div>
          </div>

          {/* Matches Card */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Recent Matches</h3>
            <div className="space-y-3">
              {matches.length > 0 ? (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Available Matches</p>
                    <p className="font-bold text-lg text-primary">{matches.length}</p>
                  </div>
                  {matches.slice(0, 1).map(m => (
                    <div key={m.id} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-xs text-muted-foreground">Top Match Score</p>
                      <p className="font-bold text-primary">{Math.round(m.match_score)}%</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No matches yet. Complete your profile to get started.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-purple-50/30 rounded-xl border border-purple-200/30 p-8 text-center">
          <TrendingUp size={32} className="text-purple-600 mx-auto mb-3 opacity-60" />
          <h3 className="font-semibold text-foreground mb-2">No Profile Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your investor profile to find and match with startups</p>
          <Link to="/investor-profile">
            <Button className="bg-primary text-white hover:bg-green-dark">
              Create Profile <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/matches">
            <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-green-pale text-sm">
              View All Matches
            </Button>
          </Link>
          <Link to="/investors">
            <Button variant="outline" className="w-full border-border text-foreground hover:border-primary/30 text-sm">
              Explore Startups
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}