export interface ScanInput {
  companyName: string;
  product: string;
  currentCountry: string;
  targetCountry: string;
  industry: string;
  stage: string;
  targetCustomer: string;
  budget: string;
  timeline: string;
  riskAppetite: string;
  websiteUrl?: string;
  notes?: string;
}

export interface AgentInsight {
  agentId: string;
  agentName: string;
  agentRole: string;
  icon: string;
  summary: string;
  details: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface RadarDataPoint {
  dimension: string;
  score: number;
  fullMark: number;
}

export interface RiskItem {
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
}

export interface Competitor {
  name: string;
  positioning: string;
  priceTier: string;
  strength: string;
  weakness: string;
  marketShare?: string;
}

export interface CustomerPersona {
  name: string;
  ageRange: string;
  motivation: string;
  mainConcern: string;
  bestMessage: string;
  preferredChannel: string;
  avatar: string;
}

export interface ComplianceItem {
  item: string;
  status: 'required' | 'recommended' | 'optional';
  description: string;
  completed: boolean;
}

export interface LocalizationAdvice {
  messagingAngle: string;
  wordsToAvoid: string[];
  culturalAdaptation: string[];
  campaignTheme: string;
  languageTone: string;
}

export interface Partner {
  name: string;
  type: 'retail' | 'distribution' | 'event' | 'government' | 'influencer';
  description: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface WeekPlan {
  week: number;
  title: string;
  actions: string[];
  milestone: string;
}

export interface AnalysisReport {
  id: string;
  input: ScanInput;
  createdAt: string;
  isDemo: boolean;

  // Executive verdict
  marketReadinessScore: number;
  opportunityLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  recommendation: 'Enter Now' | 'Pilot First' | 'Wait' | 'Avoid';
  executiveSummary: string;

  // Agent insights
  agentInsights: AgentInsight[];

  // Radar data
  radarData: RadarDataPoint[];

  // Risk analysis
  risks: RiskItem[];

  // Competitor landscape
  competitors: Competitor[];

  // Customer personas
  personas: CustomerPersona[];

  // Compliance
  compliance: ComplianceItem[];

  // Localization
  localization: LocalizationAdvice;

  // Partners
  partners: Partner[];

  // Launch plan
  launchPlan: WeekPlan[];

  // Investor brief
  investorBrief?: string;
}

export type AgentStatus = 'idle' | 'thinking' | 'complete';

export interface AgentState {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: AgentStatus;
  insight?: string;
  progress: number;
}
