import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { founderEmail, investorEmail, founderProfile, investorProfile } = await req.json();

    if (!founderProfile || !investorProfile) {
      return Response.json({ error: 'Missing profile data' }, { status: 400 });
    }

    // Generate match analysis via LLM
    const prompt = `You are a venture capital and startup matching expert. Analyze the compatibility between this founder/startup and investor.

FOUNDER/STARTUP PROFILE:
- Company: ${founderProfile.company_name}
- Sector: ${founderProfile.sector}
- Funding Stage: ${founderProfile.funding_stage}
- Seeking: $${founderProfile.funding_goal}k
- Team Size: ${founderProfile.team_size}
- Growth Goals: ${founderProfile.growth_goals?.join(', ') || 'Not specified'}
- Vision: ${founderProfile.description}
- Ideal Investor: ${founderProfile.ideal_investor_profile || 'Not specified'}

INVESTOR PROFILE:
- Name: ${investorProfile.investor_name}
- Type: ${investorProfile.investor_type}
- Focus Sectors: ${investorProfile.focus_sectors?.join(', ') || 'All'}
- Focus Stages: ${investorProfile.focus_stages?.join(', ') || 'All'}
- Check Size: $${investorProfile.check_size_min}k - $${investorProfile.check_size_max}k
- Investment Thesis: ${investorProfile.investment_thesis || 'Not specified'}
- Portfolio Focus: ${investorProfile.portfolio_focus || 'Not specified'}

Provide a JSON response with:
1. matchScore (0-100): Overall compatibility
2. sectorMatch (0-100): Sector alignment
3. stageMatch (0-100): Funding stage fit
4. matchReasons: Array of 3-4 specific reasons for the match
5. recommendationSummary: 2-3 sentences explaining the match and suggesting next steps

Keep it concise and actionable.`;

    const matchAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          matchScore: { type: 'number' },
          sectorMatch: { type: 'number' },
          stageMatch: { type: 'number' },
          matchReasons: { type: 'array', items: { type: 'string' } },
          recommendationSummary: { type: 'string' },
        },
      },
    });

    // Save the match record
    const matchRecord = await base44.entities.StartupMatch.create({
      founder_email: founderEmail,
      investor_email: investorEmail,
      match_score: matchAnalysis.matchScore,
      sector_match: matchAnalysis.sectorMatch,
      stage_match: matchAnalysis.stageMatch,
      recommendation_summary: matchAnalysis.recommendationSummary,
      match_type: 'founder_to_investor',
      match_reasons: matchAnalysis.matchReasons,
    });

    return Response.json({
      success: true,
      match: matchRecord,
      analysis: matchAnalysis,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});