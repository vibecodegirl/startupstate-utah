import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Detailed prompt for the demo video
    const videoPrompt = `Create a professional 15-second marketing demo video for "Startup State" - Utah's startup ecosystem platform. 

The video should showcase:

SEGMENT 1 (0-3 seconds): Opening/Innovation Hub
- Dynamic, modern tech aesthetic
- Show the Startup State logo
- Text overlay: "Innovation Blooms in Utah"
- Use vibrant colors (greens and blues) reflecting Utah landscape

SEGMENT 2 (3-7 seconds): Founder Experience
- Show a user clicking to access a founder profile/dashboard
- Quick pan through a business plan sidebar panel opening with resources
- Display step-by-step roadmap with checkmarks
- Text overlay: "Personalized Roadmaps. Essential Resources."
- Show resource cards with links and status badges

SEGMENT 3 (7-11 seconds): Investor Insights
- Show an interactive map with startup clusters
- Quick glimpse of trending sectors with percentage growth
- Display key statistics: $1.96B VC, 3,500+ Startups, #1 Economic Outlook
- Text overlay: "Data-Driven Insights. Discover Opportunities."
- Show investor matching panel sliding in with startup matches

SEGMENT 4 (11-15 seconds): Call to Action
- Fast-paced montage of platform features
- Show successful founder stories
- Display the Startup State branding
- Final text: "Utah: The Standard for Entrepreneurship"
- Website: "StartupState.com"
- Use green-to-blue gradient transitions between segments

Style: Modern, professional, energetic but not overwhelming. Use smooth transitions and professional animation. Include subtle sound design cues (ambient tech sounds, positive notifications). Aspect ratio: 16:9.`;

    const { url } = await base44.integrations.Core.GenerateVideo({
      prompt: videoPrompt,
      duration: 6,
      aspect_ratio: '16:9'
    });

    return Response.json({ 
      success: true,
      videoUrl: url,
      message: 'Demo video generated successfully'
    });
  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});