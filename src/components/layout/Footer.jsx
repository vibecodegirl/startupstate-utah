import { Link } from 'react-router-dom';
import { Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/44ea76f88_StartupState_Logo_Web_Color_Horiz.webp"
              alt="Startup State"
              className="h-8 w-auto brightness-0 invert mb-4"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              The global standard for innovation and entrepreneurship. Powered by the Governor's Office of Economic Opportunity.
            </p>
            <img
              src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/25e11e655_GOEO_BLACK_Standard_Web.webp"
              alt="GOEO"
              className="h-8 w-auto brightness-0 invert mt-4 opacity-70"
            />
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-manrope font-semibold text-sm mb-4 text-white/90 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                { label: 'Start Your Journey', href: '/start' },
                { label: 'Resource Navigator', href: '/resources' },
                { label: 'Startup Map', href: '/map' },
                { label: 'Get Funding', href: '/funding' },
                { label: 'Events', href: '/events' },
              ].map(l => (
                <li key={l.href}><Link to={l.href} className="hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-manrope font-semibold text-sm mb-4 text-white/90 uppercase tracking-wider">Programs</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                { label: 'Why Utah?', href: '/why-utah' },
                { label: 'Add Your Startup', href: '/add-startup' },
                { label: 'AI Advisor', href: '/advisor' },
                { label: 'Admin Dashboard', href: '/admin' },
              ].map(l => (
                <li key={l.href}><Link to={l.href} className="hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-manrope font-semibold text-sm mb-4 text-white/90 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="https://startup.utah.gov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  startup.utah.gov <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="mailto:startupstate@utah.gov" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Mail size={13} /> startupstate@utah.gov
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/70 leading-relaxed">
                The Startup State Initiative is a program of Utah's Governor's Office of Economic Opportunity, celebrating and empowering entrepreneurs statewide.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© 2024 State of Utah — Startup State Initiative. All rights reserved.</p>
          <p>Startup Capital of the World 🌎</p>
        </div>
      </div>
    </footer>
  );
}