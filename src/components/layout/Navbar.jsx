import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import RoleSwitcher from '@/components/layout/RoleSwitcher';

const navLinks = [
  { label: 'Start', href: '/start' },
  { label: 'Resources', href: '/resources' },
  { label: 'Funding', href: '/funding' },
  { label: 'Startup Map', href: '/map' },
  { label: 'Events', href: '/events' },
  { label: 'Why Utah?', href: '/why-utah' },
  { label: 'Investors', href: '/investors' },
];

export default function Navbar({ role, setRole }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/44ea76f88_StartupState_Logo_Web_Color_Horiz.webp"
              alt="Startup State"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.href
                    ? 'text-primary bg-green-pale'
                    : 'text-foreground/70 hover:text-primary hover:bg-green-pale'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <RoleSwitcher role={role} setRole={setRole} />
            {user ? (
              <>
                <Link to="/add-startup">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-green-dark font-semibold">
                    Add Your Startup
                  </Button>
                </Link>
                <Button size="sm" variant="outline" onClick={() => base44.auth.logout()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => base44.auth.redirectToLogin()}>
                  Sign In
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-green-dark font-semibold" onClick={() => base44.auth.redirectToLogin()}>
                  Create Account
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-foreground/70 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-green-pale rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2 space-y-2">
             <RoleSwitcher role={role} setRole={setRole} />
             {user ? (
               <>
                 <Link to="/add-startup" onClick={() => setMobileOpen(false)}>
                   <Button size="sm" className="w-full bg-primary text-primary-foreground font-semibold">
                     Add Your Startup
                   </Button>
                 </Link>
                 <Button size="sm" variant="outline" className="w-full" onClick={() => { base44.auth.logout(); setMobileOpen(false); }}>
                   Sign Out
                 </Button>
               </>
             ) : (
               <>
                 <Button size="sm" variant="outline" className="w-full" onClick={() => { base44.auth.redirectToLogin(); setMobileOpen(false); }}>
                   Sign In
                 </Button>
                 <Button size="sm" className="w-full bg-primary text-primary-foreground font-semibold" onClick={() => { base44.auth.redirectToLogin(); setMobileOpen(false); }}>
                   Create Account
                 </Button>
               </>
             )}
           </div>
        </div>
      )}
    </header>
  );
}