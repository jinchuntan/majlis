import { ScanInput, AnalysisReport, AgentInsight, RiskItem, Competitor, CustomerPersona, ComplianceItem, Partner, WeekPlan, LocalizationAdvice, RadarDataPoint } from './types';
import { calculateScores, calculateOverallScore, getOpportunityLevel, getRecommendation } from './scoring';
import { v4 as uuidv4 } from 'uuid';

export const demoInput: ScanInput = {
  companyName: 'NurGlow Labs',
  product: 'Halal-certified skincare brand using tropical botanical ingredients',
  currentCountry: 'Malaysia',
  targetCountry: 'United Arab Emirates',
  industry: 'Beauty & Personal Care',
  stage: 'Early growth',
  targetCustomer: 'Urban Muslim women aged 22–40',
  budget: 'USD 30,000–50,000',
  timeline: '90 days',
  riskAppetite: 'Moderate',
  websiteUrl: '',
  notes: '',
};

// Industry + country specific data maps
const competitorMaps: Record<string, Record<string, Competitor[]>> = {
  'Beauty & Personal Care': {
    'United Arab Emirates': [
      { name: 'Huda Beauty', positioning: 'Premium halal-conscious beauty brand', priceTier: 'Premium', strength: 'Massive social media following and brand recognition', weakness: 'Limited skincare focus, primarily cosmetics', marketShare: '12%' },
      { name: 'SimplySiti', positioning: 'Malaysian halal beauty expanding in GCC', priceTier: 'Mid-range', strength: 'Established halal certification and GCC presence', weakness: 'Lower brand awareness outside Malaysian diaspora', marketShare: '3%' },
      { name: 'Wardah', positioning: 'Indonesian halal beauty giant', priceTier: 'Affordable', strength: 'Price-competitive with wide product range', weakness: 'Perceived as mass-market, less premium appeal', marketShare: '5%' },
      { name: 'The Ordinary (DECIEM)', positioning: 'Science-driven affordable skincare', priceTier: 'Affordable-Mid', strength: 'Cult following, transparent ingredient lists', weakness: 'No halal certification, no cultural positioning', marketShare: '8%' },
      { name: 'Kiehl\'s', positioning: 'Heritage premium skincare', priceTier: 'Premium', strength: 'Strong retail presence in UAE malls', weakness: 'No halal or botanical differentiation', marketShare: '6%' },
    ],
    default: [
      { name: 'L\'Oréal', positioning: 'Global beauty leader', priceTier: 'Mid-Premium', strength: 'Global distribution and brand power', weakness: 'Slow to adapt to niche markets', marketShare: '15%' },
      { name: 'Innisfree', positioning: 'Natural ingredients focus', priceTier: 'Mid-range', strength: 'Strong botanical brand story', weakness: 'Limited halal certification', marketShare: '4%' },
      { name: 'The Body Shop', positioning: 'Ethical beauty', priceTier: 'Mid-range', strength: 'Strong ethical positioning', weakness: 'Aging brand perception', marketShare: '5%' },
      { name: 'Drunk Elephant', positioning: 'Clean beauty premium', priceTier: 'Premium', strength: 'Strong ingredient transparency', weakness: 'High price point limits accessibility', marketShare: '3%' },
    ],
  },
  default: {
    default: [
      { name: 'Market Leader A', positioning: 'Established dominant player', priceTier: 'Premium', strength: 'Brand recognition and distribution', weakness: 'Slow to innovate', marketShare: '20%' },
      { name: 'Challenger Brand B', positioning: 'Disruptive newcomer', priceTier: 'Mid-range', strength: 'Digital-first approach', weakness: 'Limited offline presence', marketShare: '8%' },
      { name: 'Regional Player C', positioning: 'Local market specialist', priceTier: 'Affordable', strength: 'Deep local knowledge', weakness: 'Limited scalability', marketShare: '12%' },
      { name: 'Global Corp D', positioning: 'International expansion', priceTier: 'Premium', strength: 'Resources and supply chain', weakness: 'Cultural disconnect', marketShare: '10%' },
    ],
  },
};

const personaMaps: Record<string, Record<string, CustomerPersona[]>> = {
  'Beauty & Personal Care': {
    'United Arab Emirates': [
      { name: 'Fatima Al-Rashid', ageRange: '25–32', motivation: 'Seeking halal-certified skincare that aligns with faith and delivers visible results', mainConcern: 'Ingredient transparency and halal authenticity', bestMessage: 'Beauty rooted in nature, certified by faith — skincare you can trust', preferredChannel: 'Instagram & TikTok', avatar: '👩🏽' },
      { name: 'Noura Hassan', ageRange: '33–40', motivation: 'Premium anti-aging products that respect cultural values and use natural ingredients', mainConcern: 'Price-to-quality ratio for premium botanical products', bestMessage: 'Where tropical science meets timeless beauty — premium care without compromise', preferredChannel: 'YouTube reviews & beauty blogs', avatar: '👩🏻' },
      { name: 'Aisha Chen', ageRange: '22–28', motivation: 'Trendy, Instagram-worthy skincare with clean ingredients and ethical sourcing', mainConcern: 'Whether the brand is genuinely halal or just marketing', bestMessage: 'Clean beauty, halal roots, tropical glow — join the movement', preferredChannel: 'TikTok & influencer recommendations', avatar: '👩🏽' },
    ],
    default: [
      { name: 'Sarah M.', ageRange: '25–35', motivation: 'Effective natural skincare products', mainConcern: 'Product efficacy and value', bestMessage: 'Nature-powered skincare that actually works', preferredChannel: 'Social media', avatar: '👩🏻' },
      { name: 'Amira K.', ageRange: '30–42', motivation: 'Premium halal-certified beauty options', mainConcern: 'Certification authenticity', bestMessage: 'Trusted halal beauty, global quality', preferredChannel: 'Online reviews', avatar: '👩🏽' },
      { name: 'Lena T.', ageRange: '20–28', motivation: 'Trendy clean beauty products', mainConcern: 'Brand authenticity', bestMessage: 'Clean beauty for the conscious generation', preferredChannel: 'TikTok', avatar: '👩🏼' },
    ],
  },
  default: {
    default: [
      { name: 'Early Adopter Emma', ageRange: '25–35', motivation: 'Discovering innovative products before the mainstream', mainConcern: 'Product quality and brand authenticity', bestMessage: 'Be first to experience the future', preferredChannel: 'Social media & tech blogs', avatar: '👩🏻' },
      { name: 'Value-Seeker Omar', ageRange: '30–45', motivation: 'Getting the best quality for a reasonable price', mainConcern: 'Price justification and reviews', bestMessage: 'Premium quality, honest pricing', preferredChannel: 'Review sites & comparison platforms', avatar: '👨🏽' },
      { name: 'Conscious Buyer Zara', ageRange: '22–38', motivation: 'Supporting ethical and purpose-driven brands', mainConcern: 'Corporate social responsibility', bestMessage: 'Built with purpose, made for impact', preferredChannel: 'Community platforms & newsletters', avatar: '👩🏽' },
    ],
  },
};

function getCompetitors(industry: string, country: string): Competitor[] {
  const industryMap = competitorMaps[industry] || competitorMaps.default;
  return industryMap[country] || industryMap.default || competitorMaps.default.default;
}

function getPersonas(industry: string, country: string): CustomerPersona[] {
  const industryMap = personaMaps[industry] || personaMaps.default;
  return industryMap[country] || industryMap.default || personaMaps.default.default;
}

function generateAgentInsights(input: ScanInput, scores: ReturnType<typeof calculateScores>): AgentInsight[] {
  return [
    {
      agentId: 'regulator',
      agentName: 'Regulator',
      agentRole: 'Compliance & Licensing',
      icon: 'Shield',
      summary: `${input.targetCountry} requires specific import licenses and product certifications for ${input.industry.toLowerCase()}. Halal certification from recognized bodies (ESMA/Emirates Authority) is essential for market credibility.`,
      details: [
        `Product registration with the ${input.targetCountry} regulatory authority is mandatory before commercial distribution`,
        `Labeling must comply with local language and ingredient disclosure requirements`,
        `Import permits require a local sponsor or authorized distributor in most GCC markets`,
        `Timeline for full regulatory clearance: typically 45–90 days with proper documentation`,
      ],
      confidence: 'high',
    },
    {
      agentId: 'competitor',
      agentName: 'Competitor',
      agentRole: 'Market Intelligence',
      icon: 'Target',
      summary: `The ${input.industry.toLowerCase()} market in ${input.targetCountry} is growing at 8–12% annually. Your botanical-halal positioning creates a distinct niche between premium Western brands and affordable Asian alternatives.`,
      details: [
        `Market gap identified: premium halal-certified botanical skincare is underserved`,
        `Key competitors focus on either halal OR premium botanicals — few combine both`,
        `Price positioning opportunity in the AED 80–180 range per product`,
        `E-commerce channel growing 25% YoY, reducing need for expensive retail partnerships initially`,
      ],
      confidence: 'high',
    },
    {
      agentId: 'customer',
      agentName: 'Customer',
      agentRole: 'Consumer Intelligence',
      icon: 'Users',
      summary: `Your target segment — urban Muslim women 22–40 — represents 2.3M potential customers in ${input.targetCountry}. They actively seek halal-certified products but demand premium quality and modern branding.`,
      details: [
        `68% of target demographic research beauty products on Instagram before purchasing`,
        `"Ingredient transparency" is the #1 purchase driver, followed by certification trust`,
        `Willingness to pay 15–20% premium for verified halal + natural ingredients`,
        `Key objection: unfamiliarity with Malaysian beauty brands — requires trust-building strategy`,
      ],
      confidence: 'medium',
    },
    {
      agentId: 'partner',
      agentName: 'Partner',
      agentRole: 'Ecosystem & Alliances',
      icon: 'Handshake',
      summary: `Strong partner ecosystem exists in ${input.targetCountry} for ${input.industry.toLowerCase()} market entry. Recommend starting with e-commerce platforms and beauty-focused distributors before pursuing retail.`,
      details: [
        `Noon.com and Namshi are top e-commerce platforms for beauty in the UAE`,
        `Dubai Multi Commodities Centre (DMCC) offers free zone setup for product companies`,
        `Beautyworld Middle East (annual expo) is the key industry networking event`,
        `Consider partnership with local beauty influencers (10K–100K followers) for authentic reach`,
      ],
      confidence: 'high',
    },
    {
      agentId: 'localization',
      agentName: 'Localization',
      agentRole: 'Cultural Adaptation',
      icon: 'Globe',
      summary: `${input.targetCountry} consumers expect bilingual (Arabic/English) content with culturally respectful messaging. Your Malaysian halal heritage is a strong asset but needs positioning as premium, not regional.`,
      details: [
        `All product packaging and digital content should be bilingual (Arabic + English)`,
        `Avoid direct skin-lightening claims — focus on "radiance" and "glow" instead`,
        `Malaysian botanical heritage can be positioned as "exotic tropical luxury"`,
        `Ramadan and Eid periods are peak beauty purchasing seasons — plan campaigns accordingly`,
      ],
      confidence: 'medium',
    },
    {
      agentId: 'strategy',
      agentName: 'Strategy',
      agentRole: 'Go-to-Market Lead',
      icon: 'Compass',
      summary: `Recommend a "Pilot First" approach: launch with 3–5 hero SKUs on e-commerce, build social proof through micro-influencers, then expand to selective retail within 6 months.`,
      details: [
        `Phase 1 (Week 1–4): Regulatory setup + e-commerce storefront launch`,
        `Phase 2 (Week 5–8): Influencer seeding + paid social campaigns`,
        `Phase 3 (Week 9–12): Performance analysis + retail partnership discussions`,
        `Budget allocation: 40% digital marketing, 25% regulatory/compliance, 20% partnerships, 15% operations`,
      ],
      confidence: 'high',
    },
  ];
}

function generateRisks(input: ScanInput): RiskItem[] {
  return [
    { name: 'Regulatory Compliance', severity: 'high', description: `Product registration and import licensing in ${input.targetCountry} involves multi-step approval that could delay market entry by 30–60 days`, mitigation: 'Engage a local regulatory consultant and begin documentation process immediately' },
    { name: 'Market Competition', severity: 'medium', description: 'Established players have strong brand loyalty and retail distribution networks', mitigation: 'Differentiate through halal-botanical niche positioning and digital-first go-to-market' },
    { name: 'Brand Localization', severity: 'medium', description: 'Malaysian brand origin may face initial trust barrier compared to Western or local brands', mitigation: 'Position Malaysian heritage as "tropical luxury" and invest in local influencer partnerships' },
    { name: 'Distribution Access', severity: 'high', description: 'Retail shelf space is competitive and requires established distributor relationships', mitigation: 'Start with e-commerce platforms (Noon, Amazon.ae) before pursuing retail partnerships' },
    { name: 'Pricing Pressure', severity: 'low', description: 'Consumer price sensitivity in the mid-range segment could affect margins', mitigation: 'Bundle products and offer discovery sets to lower trial barrier while maintaining premium pricing' },
    { name: 'Customer Trust', severity: 'medium', description: 'New brand needs to establish credibility in a market with many established options', mitigation: 'Leverage halal certification as trust anchor, build social proof through micro-influencer reviews' },
  ];
}

function generateCompliance(input: ScanInput): ComplianceItem[] {
  return [
    { item: 'Business Trade License', status: 'required', description: `Register a trade license in ${input.targetCountry} or partner with a licensed distributor`, completed: false },
    { item: 'Product Registration (Cosmetics)', status: 'required', description: 'Register all SKUs with the national cosmetics regulatory authority', completed: false },
    { item: 'Halal Certification (Local Body)', status: 'required', description: `Obtain halal certification recognized by ${input.targetCountry} authorities`, completed: false },
    { item: 'Arabic Labeling Compliance', status: 'required', description: 'All product labels must include Arabic text with ingredient lists and usage instructions', completed: false },
    { item: 'Import Permit', status: 'required', description: 'Secure import permit through authorized local importer or distributor', completed: false },
    { item: 'Product Safety Testing', status: 'required', description: 'Submit products for safety testing at accredited local laboratories', completed: false },
    { item: 'Trademark Registration', status: 'recommended', description: `Register brand trademark in ${input.targetCountry} to protect intellectual property`, completed: false },
    { item: 'E-commerce Platform Seller Registration', status: 'recommended', description: 'Complete seller verification on target e-commerce platforms', completed: false },
    { item: 'Data Privacy Compliance', status: 'recommended', description: 'Ensure website and customer data handling meets local data protection regulations', completed: false },
    { item: 'Influencer Marketing Disclosure', status: 'recommended', description: 'Comply with local advertising standards for sponsored content disclosure', completed: false },
    { item: 'Free Zone Company Setup', status: 'optional', description: 'Consider free zone setup for tax benefits and simplified operations', completed: false },
    { item: 'Environmental Compliance', status: 'optional', description: 'Verify packaging meets local environmental and recycling requirements', completed: false },
  ];
}

function generatePartners(input: ScanInput): Partner[] {
  if (input.targetCountry === 'United Arab Emirates') {
    return [
      { name: 'Noon.com', type: 'retail', description: 'Leading Middle East e-commerce platform — ideal for initial online launch', relevance: 'high' },
      { name: 'Amazon.ae', type: 'retail', description: 'Growing beauty category with Fulfilled by Amazon (FBA) option', relevance: 'high' },
      { name: 'Al Tayer Group', type: 'distribution', description: 'Premium beauty distributor with retail partnerships across GCC', relevance: 'medium' },
      { name: 'Chalhoub Group', type: 'distribution', description: 'Largest luxury beauty distributor in the Middle East', relevance: 'high' },
      { name: 'Beautyworld Middle East', type: 'event', description: 'Largest beauty trade show in the region — held annually in Dubai', relevance: 'high' },
      { name: 'Dubai SME', type: 'government', description: 'Government entity supporting SME market entry and growth programs', relevance: 'medium' },
      { name: 'MATRADE Dubai', type: 'government', description: 'Malaysian Trade Commission — supports Malaysian businesses expanding to UAE', relevance: 'high' },
      { name: 'Beauty micro-influencers (10K–100K)', type: 'influencer', description: 'UAE-based beauty content creators focusing on halal and clean beauty', relevance: 'high' },
    ];
  }
  return [
    { name: 'Local E-commerce Platform', type: 'retail', description: `Leading online marketplace in ${input.targetCountry}`, relevance: 'high' },
    { name: 'Regional Distributor', type: 'distribution', description: `Established distribution network for ${input.industry.toLowerCase()} products`, relevance: 'high' },
    { name: 'Industry Trade Show', type: 'event', description: `Major annual trade event for ${input.industry.toLowerCase()} in ${input.targetCountry}`, relevance: 'medium' },
    { name: 'Trade Commission', type: 'government', description: `${input.currentCountry} trade commission supporting international expansion`, relevance: 'high' },
    { name: 'Local Influencers', type: 'influencer', description: `Micro-influencers in ${input.targetCountry} focusing on your product category`, relevance: 'high' },
  ];
}

function generateLocalization(input: ScanInput): LocalizationAdvice {
  if (input.targetCountry === 'United Arab Emirates') {
    return {
      messagingAngle: 'Position as "Tropical Luxury Meets Halal Purity" — emphasize exotic Malaysian botanical heritage with world-class halal certification standards',
      wordsToAvoid: ['Skin whitening', 'Anti-dark', 'Cheap', 'Basic', 'Chemical-free (use "clean ingredients" instead)', 'Miracle cure'],
      culturalAdaptation: [
        'Feature diverse models representing UAE\'s multicultural population',
        'Align major campaigns with Islamic calendar events (Ramadan, Eid)',
        'Use Arabic-first content for social media, with English as secondary',
        'Respect modesty in all visual marketing — elegant, sophisticated imagery',
        'Highlight family-friendly values alongside individual empowerment',
      ],
      campaignTheme: '"Glow with Intention" — connecting natural beauty rituals with mindful, faith-aligned self-care',
      languageTone: 'Warm, sophisticated, confident. Avoid overly casual Western tone. Use aspirational but authentic language that respects cultural values while celebrating modern beauty.',
    };
  }
  return {
    messagingAngle: `Position as a premium, purpose-driven brand entering ${input.targetCountry} with unique value`,
    wordsToAvoid: ['Cheap', 'Basic', 'Generic', 'One-size-fits-all'],
    culturalAdaptation: [
      'Research local beauty standards and preferences',
      'Adapt visual content to reflect local demographics',
      'Align campaigns with local holidays and cultural events',
      'Use local language as primary in all customer-facing content',
    ],
    campaignTheme: '"Discover Your Natural Radiance" — universal beauty theme adapted to local context',
    languageTone: 'Professional yet warm, culturally sensitive, and aspirational',
  };
}

function generateLaunchPlan(input: ScanInput): WeekPlan[] {
  return [
    {
      week: 1,
      title: 'Validate & Research',
      actions: [
        'Finalize regulatory requirements list and documentation',
        'Engage local regulatory consultant for product registration',
        'Set up business entity or distributor agreement',
        'Begin Arabic translation of product content and labels',
        'Research and shortlist 3 e-commerce platforms for launch',
      ],
      milestone: 'Regulatory roadmap confirmed, local entity decision made',
    },
    {
      week: 2,
      title: 'Compliance & Partner Outreach',
      actions: [
        'Submit product registration applications',
        'Initiate halal certification transfer/recognition process',
        'Contact top 3 distribution partners for introductory meetings',
        'Begin e-commerce platform seller registration',
        'Identify and reach out to 10 potential micro-influencers',
      ],
      milestone: 'Applications submitted, 2+ partner conversations initiated',
    },
    {
      week: 3,
      title: 'Campaign & Localization',
      actions: [
        'Launch localized social media accounts (Instagram, TikTok)',
        'Create bilingual landing page for the target market',
        'Finalize product photography with culturally adapted styling',
        'Send product samples to confirmed influencer partners',
        'Set up customer service in Arabic and English',
      ],
      milestone: 'Digital presence live, influencer seeding started',
    },
    {
      week: 4,
      title: 'Pilot Launch & Feedback',
      actions: [
        'Go live on primary e-commerce platform with 3–5 hero SKUs',
        'Activate first influencer campaign wave',
        'Launch targeted paid social ads (Instagram + TikTok)',
        'Monitor customer feedback and reviews daily',
        'Collect data for Week 5+ optimization decisions',
      ],
      milestone: 'First sales generated, initial customer feedback collected',
    },
  ];
}

export function generateMockReport(input: ScanInput): AnalysisReport {
  const scores = calculateScores(input);
  const overallScore = calculateOverallScore(scores);
  const opportunityLevel = getOpportunityLevel(overallScore);
  const recommendation = getRecommendation(overallScore, input.riskAppetite);

  const radarData: RadarDataPoint[] = [
    { dimension: 'Market Attractiveness', score: scores.marketAttractiveness, fullMark: 100 },
    { dimension: 'Regulatory Ease', score: scores.regulatoryEase, fullMark: 100 },
    { dimension: 'Competitive Gap', score: scores.competitiveGap, fullMark: 100 },
    { dimension: 'Customer Fit', score: scores.customerFit, fullMark: 100 },
    { dimension: 'Partner Availability', score: scores.partnerAvailability, fullMark: 100 },
    { dimension: 'Localization Fit', score: scores.localizationFit, fullMark: 100 },
    { dimension: 'Launch Feasibility', score: scores.launchFeasibility, fullMark: 100 },
  ];

  return {
    id: uuidv4(),
    input,
    createdAt: new Date().toISOString(),
    isDemo: true,
    marketReadinessScore: overallScore,
    opportunityLevel,
    recommendation,
    executiveSummary: `${input.companyName}'s expansion into ${input.targetCountry} presents a ${opportunityLevel.toLowerCase()}-opportunity scenario. The ${input.industry.toLowerCase()} market is growing steadily, and the halal-botanical niche remains underserved by current competitors. With a ${input.budget} budget and ${input.timeline} timeline, a phased e-commerce-first approach is recommended. Key success factors include securing local regulatory approval, building digital-first brand awareness through influencer partnerships, and differentiating on ingredient transparency and halal authenticity. The council recommends a "${recommendation.toLowerCase()}" strategy with emphasis on digital channels before retail expansion.`,
    agentInsights: generateAgentInsights(input, scores),
    radarData,
    risks: generateRisks(input),
    competitors: getCompetitors(input.industry, input.targetCountry),
    personas: getPersonas(input.industry, input.targetCountry),
    compliance: generateCompliance(input),
    localization: generateLocalization(input),
    partners: generatePartners(input),
    launchPlan: generateLaunchPlan(input),
  };
}
