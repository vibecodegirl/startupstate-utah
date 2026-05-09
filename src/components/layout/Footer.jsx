import { Link } from 'react-router-dom';
import { Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="https://business.utah.gov/" target="_blank" rel="noopener noreferrer">
              <img src="https://media.base44.com/images/public/69fe5c22e01d3ef38f7bf78f/2e01ed50f_footer-logo.svg"

              alt="Startup State"
              className="h-8 w-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
              
            </a>
            <p className="text-white/60 text-sm leading-relaxed">
              The global standard for innovation and entrepreneurship. Powered by the Governor's Office of Economic Opportunity.
            </p>
            <img
              src="https://media.base44.com/images/public/69fe5c22e01d3ef38f7bf78f/50f598190_GOEO_BLACK_Standard.webp"
              alt="GOEO"
              className="h-8 w-auto mt-4 brightness-0 invert" />
            
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
              { label: 'Events', href: '/events' }].
              map((l) =>
              <li key={l.href}><Link to={l.href} className="hover:text-primary transition-colors">{l.label}</Link></li>
              )}
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
              { label: 'Admin Dashboard', href: '/admin' }].
              map((l) =>
              <li key={l.href}><Link to={l.href} className="hover:text-primary transition-colors">{l.label}</Link></li>
              )}
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
              <p className="text-xs text-white/50">
                A program of the <a href="https://business.utah.gov/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Governor's Office of Economic Opportunity</a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© 2026 State of Utah — Startup State Initiative. All rights reserved.</p>
          <p>Startup Capital of the World 🌎</p>
        </div>
      </div>
    </footer>);

}