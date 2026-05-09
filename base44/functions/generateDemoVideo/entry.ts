import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Detailed prompt for the demo video with actual app screens
    const videoPrompt = `Create a professional 8-second marketing demo video for "Startup State" - Utah's startup ecosystem platform. Show actual app UI in motion.

SEGMENT 1 (0-2 seconds): Opening/Innovation Hub
- Open with Startup State logo and branding
- Show dynamic green-to-blue gradient background
- Text overlay: "Innovation Blooms in Utah"
- Subtle tech ambient sound

SEGMENT 2 (2-4 seconds): Founder Portal in Motion
- Show actual founder dashboard with "Founder Portal" header
- Quick screen capture of the "Business Plan" tab with numbered steps (1, 2, 3...)
- Pan through personalized plan with completed checkmarks and resources
- Display resource cards with status badges (Saved, In Progress, Completed)
- Text overlay: "Founders: Personalized Roadmaps in 3 Clicks"
- Smooth slide transition

SEGMENT 3 (4-6 seconds): Investor Dashboard in Motion
- Show actual Investor Resources page with stats grid
- Quick showcase of key metrics: "$1.96B", "3,500+", "#1" 
- Show the interactive Ecosystem Map with startup markers
- Quick pan of Trending Sectors cards with startup counts
- Show investor matching panel sliding in with match scores and recommendations
- Text overlay: "Investors: Discover Utah's Best in 1 Click"

SEGMENT 4 (6-8 seconds): Call to Action
- Fast montage showing Startup Map, founder stories, successful exits
- Show "Invest Here. Start Here." messaging
- Display Startup State logo prominently
- Final frame with website: "StartupState.com"
- Text: "Utah: The Standard for Entrepreneurship"
- Use smooth green-to-orange gradient transitions

Style: Modern, professional, fast-paced but clear. Show actual app UI screens in motion with smooth camera pans. Use positive notification sounds and tech ambient audio. Aspect ratio: 16:9.`;

    const { url } = await base44.integrations.Core.GenerateVideo({
      prompt: videoPrompt,
      duration: 8,
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