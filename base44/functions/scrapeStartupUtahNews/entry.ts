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

    // Simple HTML parsing for news articles
    // Extract article metadata using regex patterns
    const articleRegex = /<article[^>]*>(.*?)<\/article>/gs;
    const titleRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/;
    const dateRegex = /(\d{4}-\d{2}-\d{2})/;
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/;

    const articles = [];
    let match;

    while ((match = articleRegex.exec(html)) !== null) {
      const content = match[1];
      const titleMatch = content.match(titleRegex);
      const dateMatch = content.match(dateRegex);
      const linkMatch = content.match(linkRegex);

      if (titleMatch && dateMatch && linkMatch) {
        const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        const publishDate = dateMatch[1];
        const url = linkMatch[1].startsWith('http') ? linkMatch[1] : `https://startup.utah.gov${linkMatch[1]}`;

        // Check if article already exists by URL
        const existing = await base44.asServiceRole.entities.NewsArticle.filter(
          { url },
          '',
          1
        );

        if (existing.length === 0) {
          articles.push({
            title,
            excerpt: title.substring(0, 150),
            category: 'News',
            publish_date: new Date(publishDate).toISOString(),
            image_url: '',
            source: 'Startup Utah',
            url,
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