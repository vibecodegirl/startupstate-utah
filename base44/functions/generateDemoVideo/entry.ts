import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { videoType } = await req.json().catch(() => ({}));

    let videoPrompt = '';

    if (videoType === 'slide1') {
      // Founder Journey: Quiz → Profile → Execute
      videoPrompt = `Create a fast-paced 6-second demo video showing the founder journey on "Startup State" platform.

SEGMENT 1 (0-1.5 seconds): Quiz Intake
- Show actual quiz interface with multiple choice questions
- Quick pans through 3-4 quiz screens with founder selecting options
- Upbeat notification sound as answers are selected
- Text overlay: "1. Take the Quiz"

SEGMENT 2 (1.5-3.5 seconds): Create Profile
- Show founder landing on quiz results page
- Quick transition to FounderProfile creation form
- Pan through form fields: company name, sector dropdown, funding stage, team size
- Show data being filled in smoothly
- Text overlay: "2. Create Your Profile"
- Include founder portal dashboard appearing in background

SEGMENT 3 (3.5-6 seconds): Execute & Success
- Show personalized Business Plan tab opening with numbered steps
- Quick pan through plan with completed checkmarks and resources
- Show resource cards with status badges (Saved, In Progress, Completed)
- Smooth transition showing investor matches appearing
- Text overlay: "3. Execute Your Roadmap"
- Final frame shows founder success with profile completion notification
- Use green gradient transitions throughout

Style: Fast, energetic, clear progression. Show actual app UI. Use smooth transitions and positive success sounds. Aspect ratio: 16:9.`;

    } else if (videoType === 'slide2') {
      // Investor Journey: Explore → Select → Connect
      videoPrompt = `Create a fast-paced 6-second demo video showing the investor journey on "Startup State" platform.

SEGMENT 1 (0-1.5 seconds): Explore & Discover
- Show Investor Resources landing page hero section
- Pan through stats grid: "$1.96B", "3,500+", "#1"
- Quick glimpse of interactive Ecosystem Map with startup markers
- Text overlay: "1. Explore Utah's Ecosystem"

SEGMENT 2 (1.5-3.5 seconds): Select & Filter
- Show Trending Sectors cards with startup counts scrolling by
- Quick zoom into ecosystem map showing startup clusters
- Display startup hubs with counts (Salt Lake City, Provo, etc.)
- Show investor filtering startups by sector and stage
- Text overlay: "2. Select Your Focus"
- Include smooth map interactions and filtering in action

SEGMENT 3 (3.5-6 seconds): Connect & Match
- Show investor matching panel sliding in from right
- Display match scores and recommendations appearing
- Quick pan through multiple matched startups with contact info
- Show connection happening (notification bell, connect button presses)
- Text overlay: "3. Connect & Invest"
- Final frame shows investor portfolio with new startups added
- Use purple-to-green gradient transitions throughout

Style: Professional, confident, fast-paced. Show actual app UI and real data. Use smooth transitions. Aspect ratio: 16:9.`;

    } else if (videoType === 'slide3') {
      // Innovation Showcase: Platform Simplicity & Features
      videoPrompt = `Create an impressive 7-second demo video showcasing "Startup State" platform innovation and simplicity.

OPENING (0-1 second): 
- Show Startup State logo with vibrant green-to-orange gradient
- Text: "The Standard for Entrepreneurship"

SEGMENT 1 (1-2.5 seconds): Founder Excellence
- Show founder dashboard with business plan steps completing in sequence
- Resources being marked complete with satisfying checkmark animations
- Personalized recommendations appearing
- Text overlay: "Built for Founders"

SEGMENT 2 (2.5-4 seconds): Investor Power
- Show investor dashboard with multiple startup matches appearing
- Map interface with clustering and zoom interactions
- Match scores updating in real-time
- Trending sectors data refreshing
- Text overlay: "Powered for Investors"

SEGMENT 3 (4-5.5 seconds): Ecosystem Impact
- Fast montage: successful founder stories, notable exits
- Startup map showing Utah geographic distribution
- Events and networking happening across regions
- Growing community indicators
- Text overlay: "Ecosystem Momentum"

CLOSING (5.5-7 seconds):
- Return to Startup State logo
- Show key stats: "$1.96B invested", "3,500+ startups", "#1 economic outlook"
- Final text: "StartupState.com"
- Smooth green-to-blue gradient fades to white
- Use professional tech sounds and positive notification pings

Style: Polished, inspiring, modern. Show actual platform screenshots in rapid succession. Smooth transitions. High-quality production. Aspect ratio: 16:9.`;
    }

    if (!videoPrompt) {
      return Response.json({ 
        success: false,
        error: 'Invalid videoType parameter' 
      }, { status: 400 });
    }

    const { url } = await base44.integrations.Core.GenerateVideo({
      prompt: videoPrompt,
      duration: videoType === 'slide3' ? 7 : 6,
      aspect_ratio: '16:9'
    });

    return Response.json({ 
      success: true,
      videoUrl: url,
      message: `Demo video (${videoType}) generated successfully`
    });
  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});