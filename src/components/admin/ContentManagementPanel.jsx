import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContentManagementPanel() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const handleScrape = async (functionName, label) => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await base44.functions.invoke(functionName, {});
      setStatus('success');
      setMessage(`✓ ${response.data.message || label + ' completed successfully'}`);
    } catch (error) {
      setStatus('error');
      setMessage(`✗ ${error.message || 'An error occurred'}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-manrope font-bold text-lg text-foreground mb-4">Content Scraping</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Manually trigger scraping jobs to pull the latest news and events from partner sources.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => handleScrape('scrapeStartupUtahNews', 'Startup Utah News')}
            disabled={loading}
            className="gap-2 justify-center"
            variant="outline"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Scrape Startup Utah News
          </Button>

          <Button
            onClick={() => handleScrape('scrapeBusinessUtahEvents', 'Business Utah Events')}
            disabled={loading}
            className="gap-2 justify-center"
            variant="outline"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Scrape Business Utah Events
          </Button>
        </div>

        {status && (
          <div className={`flex items-start gap-3 p-4 rounded-lg border ${
            status === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {message}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-manrope font-bold text-lg text-foreground mb-4">Manage Content</h3>
        <p className="text-sm text-muted-foreground">
          View and edit scraped articles and events in the respective entity dashboards.
        </p>
      </div>
    </div>
  );
}