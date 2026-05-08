import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

// The advisor is now a global floating panel (AdvisorFloating in App.jsx).
// This page redirects users to home with the advisor open via a custom event.
export default function Advisor() {
  useEffect(() => {
    // Dispatch event to open the floating advisor
    window.dispatchEvent(new CustomEvent('openAdvisor'));

    // Also pass persona context if present
    const params = new URLSearchParams(window.location.search);
    const ctx = params.get('context');
    if (ctx) {
      window.dispatchEvent(new CustomEvent('openAdvisor', { detail: { context: decodeURIComponent(ctx) } }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-pale to-white pt-32 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
        <Sparkles size={30} className="text-white" />
      </div>
      <h1 className="font-manrope font-extrabold text-3xl text-foreground mb-3">AI Business Advisor</h1>
      <p className="text-muted-foreground text-lg max-w-md">
        Your Utah Startup Advisor is ready — look for the <span className="text-primary font-semibold">✨ chat button</span> in the bottom-right corner of any page.
      </p>
    </div>
  );
}