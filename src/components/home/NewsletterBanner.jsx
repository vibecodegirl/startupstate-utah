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
    <section className="bg-gradient-to-r from-primary/10 via-green-pale/20 to-primary/10 py-4 border-y border-primary/20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-primary shrink-0" />
            <div className="text-left">
              <h2 className="font-manrope font-extrabold text-lg text-foreground">
                Stay Connected with Utah's Startup Ecosystem
              </h2>
              <p className="text-muted-foreground text-xs">
                Monthly updates on funding, events, and resources for founders and investors.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto shrink-0">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm w-full sm:w-80"
            />
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-green-dark font-semibold gap-1 whitespace-nowrap text-sm"
            >
              {submitted ? (
                <>
                  <CheckCircle size={14} /> Done
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}