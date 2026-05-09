import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, AlertCircle, CheckCircle, Clock, Zap, ArrowRight, Plus, BookOpen, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BusinessPlanPanel from '@/components/founders/BusinessPlanPanel';
import SavedResources from '@/components/founders/SavedResources';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DEMO_FOUNDER_EMAILS = ['demo-founder-1@example.com', 'demo-founder-2@example.com'];

export default function FounderPortal({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if we're viewing a demo profile
    const currentRole = sessionStorage.getItem('currentRole');
    const isDemoMode = currentRole === 'founder';
    
    // Use demo email for founder demo role
    const emailToUse = isDemoMode ? DEMO_FOUNDER_EMAILS[0] : user?.email;

    if (!emailToUse) {
      setLoading(false);
      return;
    }

    base44.entities.FounderProfile.filter({ user_email: emailToUse }, '', 1)
      .then(profiles => {
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          generateNotifications(profiles[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.email]);

  const handleUpdateResource = async (stepIndex, resourceIndex, newStatus, completeStep = false) => {
    if (!profile) return;

    const updatedPlan = [...(profile.personalized_plan || [])];
    
    if (completeStep) {
      updatedPlan[stepIndex].completed = true;
    } else if (resourceIndex !== null && resourceIndex !== undefined) {
      if (newStatus === null) {
        // Remove resource
        updatedPlan[stepIndex].resources.splice(resourceIndex, 1);
      } else {
        // Update resource status
        updatedPlan[stepIndex].resources[resourceIndex].status = newStatus;
      }
    }

    try {
      await base44.entities.FounderProfile.update(profile.id, { personalized_plan: updatedPlan });
      setProfile({ ...profile, personalized_plan: updatedPlan });
    } catch (err) {
      console.error('Failed to update plan:', err);
    }
  };

  const generateNotifications = (profile) => {
    const notifs = [];
    if (!profile.profile_complete) {
      notifs.push({
        id: 'complete-profile',
        type: 'warning',
        title: 'Complete Your Profile',
        description: 'Finish your profile to appear in investor searches',
        icon: AlertCircle,
      });
    }
    if (profile.funding_goal) {
      notifs.push({
        id: 'funding-available',
        type: 'info',
        title: `Investors Matching Your ${profile.funding_stage} Stage`,
        description: 'Check out 3 new investors interested in your sector',
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
            <Building2 size={24} className="text-primary" />
            Founder Portal
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your startup profile and funding journey</p>
        </div>
        <Link to="/founder-profile">
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
          {/* Company Info Card */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Company Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Company Name</p>
                <p className="font-medium text-foreground">{profile.company_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sector</p>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  {profile.sector}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Funding Stage</p>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-full">
                  {profile.funding_stage}
                </span>
              </div>
            </div>
          </div>

          {/* Funding Progress Card */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Funding Progress</h3>
            <div className="space-y-3">
              {profile.funding_goal && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Target Amount</p>
                  <p className="font-bold text-lg text-primary">${profile.funding_goal}K</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Profile Completion</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${profile.profile_complete ? 100 : 60}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {profile.profile_complete ? 'Complete' : 'In Progress'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-pale/30 rounded-xl border border-primary/20 p-8 text-center">
          <Building2 size={32} className="text-primary mx-auto mb-3 opacity-60" />
          <h3 className="font-semibold text-foreground mb-2">No Profile Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your founder profile to connect with investors</p>
          <Link to="/founder-profile">
            <Button className="bg-primary text-white hover:bg-green-dark">
              Create Profile <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <Building2 size={14} /> Overview
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-1.5">
            <BookOpen size={14} /> Business Plan
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1.5">
            <Bookmark size={14} /> Saved Resources
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Profile Status */}
          {profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Info Card */}
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4">Company Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Company Name</p>
                    <p className="font-medium text-foreground">{profile.company_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sector</p>
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                      {profile.sector}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Funding Stage</p>
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-full">
                      {profile.funding_stage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Funding Progress Card */}
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4">Funding Progress</h3>
                <div className="space-y-3">
                  {profile.funding_goal && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Target Amount</p>
                      <p className="font-bold text-lg text-primary">${profile.funding_goal}K</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Profile Completion</p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${profile.profile_complete ? 100 : 60}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {profile.profile_complete ? 'Complete' : 'In Progress'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-pale/30 rounded-xl border border-primary/20 p-8 text-center">
              <Building2 size={32} className="text-primary mx-auto mb-3 opacity-60" />
              <h3 className="font-semibold text-foreground mb-2">No Profile Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your founder profile to connect with investors</p>
              <Link to="/founder-profile">
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
                  View Investor Matches
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" className="w-full border-border text-foreground hover:border-primary/30 text-sm">
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        {/* Business Plan Tab */}
        <TabsContent value="plan">
          {profile ? (
            <BusinessPlanPanel plan={profile.personalized_plan || []} onUpdateResource={handleUpdateResource} />
          ) : (
            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <BookOpen size={32} className="text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Create your profile to see your personalized business plan.</p>
            </div>
          )}
        </TabsContent>

        {/* Saved Resources Tab */}
        <TabsContent value="resources">
          <SavedResources founderEmail={user?.email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}