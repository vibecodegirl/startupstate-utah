import { Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary/10 via-green-pale/20 to-primary/10 py-16 border-y border-primary/20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Mail size={20} className="text-primary" />
          <h2 className="font-manrope font-extrabold text-2xl text-foreground">
            Stay Connected with Utah's Startup Ecosystem
          </h2>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Get monthly updates on funding opportunities, events, and resources for founders and investors.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
          <Button
            type="submit"
            className="bg-primary text-white hover:bg-green-dark font-semibold gap-2 whitespace-nowrap"
          >
            {submitted ? (
              <>
                <CheckCircle size={16} /> Subscribed!
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-3">No spam, just helpful startup resources.</p>
      </div>
    </section>
  );
}