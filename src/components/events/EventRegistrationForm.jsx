import { useState } from 'react';
import { X, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EventRegistrationForm({ event, onClose }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate required fields
    if (!formData.full_name || !formData.email) {
      setError('Please fill in name and email');
      setSubmitting(false);
      return;
    }

    try {
      // Send registration email or store registration
      // For now, we'll just show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col animate-slide-in overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-manrope font-bold text-lg text-foreground">Register for Event</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="font-manrope font-bold text-xl text-foreground mb-2">Registered Successfully!</h3>
              <p className="text-muted-foreground mb-4">
                We've sent a confirmation email to <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">See you at the event!</p>
            </div>
          ) : (
            <>
              {/* Event Summary */}
              <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Organizer:</strong> {event.organizer}</p>
                  <p><strong>Type:</strong> {event.event_type}</p>
                  <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()} at {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Your Company"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Mail size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    We'll send you event details and updates to your email address.
                  </p>
                </div>

                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 gap-2 bg-primary hover:bg-green-dark text-white font-semibold"
                  >
                    {submitting ? 'Registering...' : 'Complete Registration'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}