import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch content from business.utah.gov/events/list/
    const response = await fetch('https://business.utah.gov/events/list/?tribe_eventcategory%5B0%5D=2732');
    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    const html = await response.text();

    // Parse event details from HTML
    const eventRegex = /<div[^>]*class="[^"]*tribe-event[^"]*"[^>]*>(.*?)<\/div>/gs;
    const titleRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/;
    const dateRegex = /(\d{4}-\d{2}-\d{2})/;
    const locationRegex = /<span[^>]*class="[^"]*location[^"]*"[^>]*>(.*?)<\/span>/;
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/;

    const events = [];
    let match;

    while ((match = eventRegex.exec(html)) !== null) {
      const content = match[1];
      const titleMatch = content.match(titleRegex);
      const dateMatch = content.match(dateRegex);
      const locationMatch = content.match(locationRegex);
      const linkMatch = content.match(linkRegex);

      if (titleMatch && dateMatch && linkMatch) {
        const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        const eventDate = new Date(dateMatch[1]).toISOString();
        const location = locationMatch ? locationMatch[1].replace(/<[^>]+>/g, '').trim() : 'TBD';
        const url = linkMatch[1];

        // Check if event already exists by URL
        const existing = await base44.asServiceRole.entities.Event.filter(
          { url },
          '',
          1
        );

        if (existing.length === 0) {
          events.push({
            title,
            description: title,
            event_date: eventDate,
            location,
            url,
            organizer: 'Business Utah',
            event_type: 'Conference',
            sectors: ['All Sectors'],
            is_virtual: false,
          });
        }
      }
    }

    // Create new events in bulk
    if (events.length > 0) {
      await base44.asServiceRole.entities.Event.bulkCreate(events);
    }

    return Response.json({ 
      success: true, 
      message: `Scraped and created ${events.length} new events from Business Utah` 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});