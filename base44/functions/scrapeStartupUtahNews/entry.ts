import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch content from startup.utah.gov/news/
    const response = await fetch('https://startup.utah.gov/news/');
    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch content' }, { status: 500 });
    }

    const html = await response.text();
    const articles = [];

    // Extract title, link, date, image, and excerpt from HTML
    // Pattern: <h2><span>Title</span></h2>, <a href=...>, date in div
    const titleRegex = /<h2[^>]*class="[^"]*x-text-content-text-primary[^"]*"[^>]*>([^<]*)<\/h2>/g;
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/g;
    const dateRegex = /([A-Za-z]+\s+\d{1,2},\s+\d{4})/g;
    const imageRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/g;
    const excerptRegex = /<div[^>]*class="[^"]*x-text-content-text[^"]*"[^>]*>([^<]+)<\/div>/g;

    // Split content into article sections
    const sections = html.split(/<a\s+class="x-col[^"]*no-underline"/);
    
    for (let i = 1; i < sections.length && i < 20; i++) {
      const section = sections[i];
      
      // Extract elements from this section
      const titleMatch = section.match(/<h2[^>]*>([^<]+)<\/h2>/);
      const linkMatch = section.match(/href=["']([^"']+)["']/);
      const dateMatch = section.match(/([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
      const imageMatch = section.match(/<img[^>]*src=["']([^"']+)["']/);
      const excerptMatch = section.match(/<div[^>]*class="[^"]*x-text-content[^"]*"[^>]*>([^<]+)<\/div>/);

      if (titleMatch && linkMatch && dateMatch) {
        const title = titleMatch[1].trim();
        const url = linkMatch[1];
        const dateStr = dateMatch[1];
        const imageUrl = imageMatch ? imageMatch[1] : '';
        const excerpt = excerptMatch ? excerptMatch[1].substring(0, 200).trim() : title.substring(0, 150);

        // Parse date
        const dateObj = new Date(dateStr);
        const publishDate = isNaN(dateObj.getTime()) ? new Date().toISOString() : dateObj.toISOString();

        // Check if article already exists by URL
        const existing = await base44.asServiceRole.entities.NewsArticle.filter(
          { url },
          '',
          1
        );

        if (existing.length === 0 && title && url) {
          articles.push({
            title,
            excerpt: excerpt || title.substring(0, 150),
            category: 'News',
            publish_date: publishDate,
            image_url: imageUrl,
            source: 'Startup Utah',
            url: url.startsWith('http') ? url : `https://startup.utah.gov${url}`,
            is_active: true,
          });
        }
      }
    }

    // Create new articles in bulk
    if (articles.length > 0) {
      await base44.asServiceRole.entities.NewsArticle.bulkCreate(articles);
    }

    return Response.json({ 
      success: true, 
      message: `Scraped and created ${articles.length} new articles from Startup Utah` 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});