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

    // Parse article blocks with title, excerpt, image, and date
    // Looking for pattern: link > img + h2 + excerpt + date
    const articleLinkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*[^>]*>\s*<figure[^>]*>.*?<img[^>]*src=["']([^"']+)["'][^>]*>.*?<\/figure>.*?<h2[^>]*>([^<]+)<\/h2>.*?<div[^>]*class="[^"]*x-text-content-text[^"]*">([^<]*)<\/div>.*?<div[^>]*>([^<]*\d{4})<\/div>/gs;

    let match;
    while ((match = articleLinkRegex.exec(html)) !== null) {
      const url = match[1];
      const imageUrl = match[2];
      const title = match[3].trim();
      const excerpt = match[4].substring(0, 200).trim();
      const dateStr = match[5].trim();

      // Parse date string like "February 27, 2026"
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
          url,
          is_active: true,
        });
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