import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, ExternalLink, Bookmark, CheckCircle, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuickWinActionPanel({ win, onClose }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const handleSaveWin = async () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    setIsSaved(!isSaved);
    // TODO: Persist to user profile when schema is updated
  };

  const handleStartNow = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    if (win.link.startsWith('http')) {
      window.open(win.link, '_blank', 'noopener noreferrer');
    } else {
      window.location.href = win.link;
    }
  };

  if (!win) return null;

  const Icon = win.icon;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
          <h2 className="font-manrope font-bold text-lg text-foreground">{win.title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Icon and key info */}
          <div className="bg-gradient-to-br from-primary/10 to-green-pale rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground mb-2">{win.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{win.description}</p>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Clock size={13} /> Time
              </div>
              <div className="font-semibold text-sm text-foreground">{win.time}</div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Zap size={13} /> Impact
              </div>
              <div className="font-semibold text-sm text-foreground">{win.impact}</div>
            </div>
          </div>

          {/* Why do this */}
          <div className="bg-green-pale/30 border border-primary/20 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-2">Why do this now?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This is a high-leverage action that will move your business forward immediately. It's designed to be simple but powerful.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-white border-t border-border pt-6 mt-auto">
            {user ? (
              <div className="space-y-3">
                <Button onClick={handleStartNow} className="w-full bg-primary text-white hover:bg-green-dark font-semibold gap-2 py-2.5">
                  <Zap size={16} /> Start Now
                  {win.link.startsWith('http') && <ExternalLink size={14} />}
                </Button>
                <Button onClick={handleSaveWin} variant="outline" className={`w-full gap-2 ${isSaved ? 'border-primary/30 text-primary bg-green-pale' : 'border-border'}`}>
                  <Bookmark size={16} /> {isSaved ? 'Saved to Profile' : 'Save to Profile'}
                </Button>
              </div>
            ) : (
              <Button onClick={() => base44.auth.redirectToLogin()} className="w-full bg-primary text-white hover:bg-green-dark font-semibold py-2.5">
                Sign In to Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}