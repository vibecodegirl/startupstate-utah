import { useState } from 'react';
import { X, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FounderStorySubmissionForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    founder_name: '',
    company_name: '',
    sector: '',
    story_title: '',
    story_excerpt: '',
    full_story: '',
    key_achievement: '',
    photo_url: '',
    company_logo_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const sectors = [
    'AI',
    'Aerospace & Defense',
    'Life Sciences',
    'Fintech',
    'B2B Software',
    'Marketplaces',
    'Energy',
    'Consumer',
    'Security',
    'Other',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.founder_name || !formData.company_name || !formData.sector)) {
      setError('Please fill in all fields');
      return;
    }
    if (step === 2 && (!formData.story_title || !formData.story_excerpt)) {
      setError('Please fill in story title and excerpt');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Open Google Form with pre-filled data
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf481sVWLWpwclZD8qZ7uhpz0-REyBC-8tn_pIywci2BhDQNQ/viewform?usp=sf_link';
      const prefillData = `entry.1234567890=${encodeURIComponent(formData.founder_name)}&entry.1234567891=${encodeURIComponent(formData.company_name)}&entry.1234567892=${encodeURIComponent(formData.story_title)}`;
      
      // Open in new tab with data
      window.open(`${formUrl}&${prefillData}`, '_blank', 'noopener,noreferrer');
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to submit. Please try again.');
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
          <h2 className="font-manrope font-bold text-lg text-foreground">Share Your Founder Story</h2>
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
              <h3 className="font-manrope font-bold text-xl text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-4">
                Your founder story has been submitted to our team. We'll review it and feature it in our newsroom soon.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting in a moment...</p>
            </div>
          ) : (
            <>
              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3].map(s => (
                    <div
                      key={s}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        s <= step ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Step {step} of 3</p>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Step 1: Founder & Company Info */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h3 className="font-semibold text-foreground">Your Information</h3>
                    <input
                      type="text"
                      name="founder_name"
                      placeholder="Your Full Name"
                      value={formData.founder_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                      required
                    />
                    <input
                      type="text"
                      name="company_name"
                      placeholder="Company Name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                      required
                    />
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-foreground"
                      required
                    >
                      <option value="">Select Your Sector</option>
                      {sectors.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 2: Story Content */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="font-semibold text-foreground">Your Story</h3>
                    <input
                      type="text"
                      name="story_title"
                      placeholder="Story Headline (e.g., 'From Idea to Seed in 6 Months')"
                      value={formData.story_title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                      required
                    />
                    <textarea
                      name="story_excerpt"
                      placeholder="Brief summary of your journey (2-3 sentences)"
                      value={formData.story_excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground resize-none"
                      required
                    />
                    <textarea
                      name="full_story"
                      placeholder="Tell us your complete story and key lessons learned"
                      value={formData.full_story}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground resize-none"
                    />
                    <input
                      type="text"
                      name="key_achievement"
                      placeholder="Main achievement (e.g., '$2.5M seed round raised')"
                      value={formData.key_achievement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                    />
                  </div>
                )}

                {/* Step 3: Media & Review */}
                {step === 3 && (
                  <div className="space-y-5">
                    <h3 className="font-semibold text-foreground">Media & Review</h3>
                    <input
                      type="url"
                      name="photo_url"
                      placeholder="Your Photo URL (optional)"
                      value={formData.photo_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                    />
                    <input
                      type="url"
                      name="company_logo_url"
                      placeholder="Company Logo URL (optional)"
                      value={formData.company_logo_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground"
                    />
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-semibold text-sm text-foreground mb-3">Review Your Submission</p>
                      <div className="space-y-2 text-sm">
                        <p><strong>Founder:</strong> {formData.founder_name}</p>
                        <p><strong>Company:</strong> {formData.company_name}</p>
                        <p><strong>Sector:</strong> {formData.sector}</p>
                        <p><strong>Story Title:</strong> {formData.story_title}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => step > 1 && setStep(step - 1)}
                    disabled={step === 1}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 gap-2 bg-primary hover:bg-green-dark text-white font-semibold"
                    >
                      Next <ArrowRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 gap-2 bg-primary hover:bg-green-dark text-white font-semibold"
                    >
                      {submitting ? 'Submitting...' : 'Submit Story'}
                    </Button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}