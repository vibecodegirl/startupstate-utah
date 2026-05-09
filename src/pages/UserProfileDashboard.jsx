import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Settings, LogOut, Zap, Edit, Save, X, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UserProfileDashboard() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u);
        setEditData({ full_name: u?.full_name || '', role: u?.role || 'user' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe(editData);
      setUser({ ...user, ...editData });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="font-manrope font-bold text-2xl text-foreground mb-2">Sign in required</h1>
            <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
            <Button onClick={() => base44.auth.redirectToLogin()} className="bg-primary text-white hover:bg-green-dark">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-white to-green-pale/10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-manrope font-extrabold text-4xl text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm mb-6 overflow-hidden">
          {/* Header background */}
          <div className="h-24 bg-gradient-to-r from-primary to-green-mid opacity-10" />

          <div className="px-6 pb-6 -mt-10 relative z-10">
            {/* Avatar + Basic Info */}
            <div className="flex items-end gap-4 mb-6">
              <div className="w-20 h-20 rounded-xl bg-primary/10 border-4 border-white flex items-center justify-center shadow-sm">
                <User size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-manrope font-bold text-2xl text-foreground">{user.full_name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`gap-2 font-semibold ${
                  isEditing
                    ? 'bg-primary text-white hover:bg-green-dark'
                    : 'bg-white border border-border text-foreground hover:border-primary/30'
                }`}
                disabled={isSaving}
              >
                {isEditing ? (
                  <>
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </>
                ) : (
                  <>
                    <Edit size={16} /> Edit Profile
                  </>
                )}
              </Button>
              {isEditing && (
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ full_name: user.full_name, role: user.role });
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <X size={16} /> Cancel
                </Button>
              )}
            </div>

            {/* Edit form */}
            {isEditing && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-xl mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email (Read-only)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
                  <input
                    type="text"
                    value={editData.role}
                    disabled
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* Info Grid */}
            {!isEditing && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Account Type</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                    <p className="font-semibold text-foreground capitalize">{user.role || 'User'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <p className="font-semibold text-foreground">Active</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Member Since</p>
                  <p className="font-semibold text-foreground">Jan 2025</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Security Section */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Settings size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-manrope font-bold text-base text-foreground">Account Security</h3>
                <p className="text-xs text-muted-foreground">Manage password and security settings</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Password authentication is handled by Base44.</p>
              <Button variant="outline" className="w-full border-border text-foreground hover:border-primary/30 text-sm font-semibold">
                Review Security Settings
              </Button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Zap size={18} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-manrope font-bold text-base text-foreground">Preferences</h3>
                <p className="text-xs text-muted-foreground">Customize your experience</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="accent-primary rounded w-4 h-4" />
                <span className="text-sm text-foreground">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="accent-primary rounded w-4 h-4" />
                <span className="text-sm text-foreground">Marketing updates</span>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-12">
          <h3 className="font-manrope font-bold text-base text-red-700 mb-3">Danger Zone</h3>
          <p className="text-sm text-red-600 mb-4">Sign out from your account or delete your profile.</p>
          <div className="flex gap-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 border-red-200 text-red-700 hover:bg-red-50 font-semibold"
            >
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}