import { NextRequest, NextResponse } from 'next/server';
import { ScanInput } from '@/lib/types';
import { generateMockReport } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const input: ScanInput = await request.json();

    // Validate required fields
    if (!input.companyName || !input.targetCountry || !input.industry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are a market-entry analysis AI council. Analyze the following expansion opportunity and return a structured JSON response.

Company: ${input.companyName}
Product: ${input.product}
Current Country: ${input.currentCountry}
Target Country: ${input.targetCountry}
Industry: ${input.industry}
Stage: ${input.stage}
Target Customer: ${input.targetCustomer}
Budget: ${input.budget}
Timeline: ${input.timeline}
Risk Appetite: ${input.riskAppetite}

Return a JSON object with these exact fields:
- marketReadinessScore (number 0-100)
- opportunityLevel ("Low" | "Medium" | "High" | "Very High")
- recommendation ("Enter Now" | "Pilot First" | "Wait" | "Avoid")
- executiveSummary (string, 2-3 sentences)
- agentInsights (array of 6 objects: {agentId, agentName, agentRole, icon, summary, details: string[], confidence: "high"|"medium"|"low"})
- radarData (array of 7 objects: {dimension, score: number, fullMark: 100})
- risks (array of 6 objects: {name, severity: "critical"|"high"|"medium"|"low", description, mitigation})
- competitors (array of 5 objects: {name, positioning, priceTier, strength, weakness, marketShare})
- personas (array of 3 objects: {name, ageRange, motivation, mainConcern, bestMessage, preferredChannel, avatar})
- compliance (array of 10+ objects: {item, status: "required"|"recommended"|"optional", description, completed: false})
- localization (object: {messagingAngle, wordsToAvoid: string[], culturalAdaptation: string[], campaignTheme, languageTone})
- partners (array of 6+ objects: {name, type: "retail"|"distribution"|"event"|"government"|"influencer", description, relevance: "high"|"medium"|"low"})
- launchPlan (array of 4 objects: {week: number, title, actions: string[], milestone})

Make it specific and realistic for ${input.industry} expanding from ${input.currentCountry} to ${input.targetCountry}.`;

        const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            const { v4: uuidv4 } = await import('uuid');
            return NextResponse.json({
              ...parsed,
              id: uuidv4(),
              input,
              createdAt: new Date().toISOString(),
              isDemo: false,
            });
          }
        }
      } catch {
        // Fall through to mock
      }
    }

    // Fallback to mock data
    const report = generateMockReport(input);
    return NextResponse.json(report);

  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
