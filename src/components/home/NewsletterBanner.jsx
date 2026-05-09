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
    <section className="bg-gradient-to-r from-primary via-green-mid to-primary py-12 my-16 rounded-2xl shadow-lg mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-white mb-2">
          Stay in the Loop — Utah Startup Updates
        </h2>
        <p className="text-white/85 text-base mb-6">
          Get monthly funding, events, and ecosystem insights straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/95 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium"
          />
          <Button
            type="submit"
            className="bg-white text-primary hover:bg-white/90 font-bold gap-2 whitespace-nowrap px-6"
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
      </div>
    </section>
  );
}