import { ScanInput } from './types';

interface ScoreWeights {
  marketAttractiveness: number;
  regulatoryEase: number;
  competitiveGap: number;
  customerFit: number;
  partnerAvailability: number;
  localizationFit: number;
  launchFeasibility: number;
}

const countryScores: Record<string, Partial<ScoreWeights>> = {
  'United Arab Emirates': { marketAttractiveness: 85, regulatoryEase: 70, partnerAvailability: 80, localizationFit: 75 },
  'Saudi Arabia': { marketAttractiveness: 82, regulatoryEase: 60, partnerAvailability: 75, localizationFit: 70 },
  'Singapore': { marketAttractiveness: 78, regulatoryEase: 90, partnerAvailability: 85, localizationFit: 80 },
  'Indonesia': { marketAttractiveness: 80, regulatoryEase: 55, partnerAvailability: 70, localizationFit: 65 },
  'United Kingdom': { marketAttractiveness: 75, regulatoryEase: 72, partnerAvailability: 78, localizationFit: 85 },
  'United States': { marketAttractiveness: 90, regulatoryEase: 65, partnerAvailability: 88, localizationFit: 82 },
  'Japan': { marketAttractiveness: 72, regulatoryEase: 50, partnerAvailability: 60, localizationFit: 45 },
  'Turkey': { marketAttractiveness: 70, regulatoryEase: 55, partnerAvailability: 65, localizationFit: 68 },
};

const industryMultipliers: Record<string, number> = {
  'Beauty & Personal Care': 1.1,
  'Food & Beverage': 1.05,
  'Technology': 1.15,
  'Fashion': 1.0,
  'Healthcare': 0.9,
  'Education': 0.95,
  'Fintech': 1.08,
  'E-commerce': 1.12,
};

const stageMultipliers: Record<string, number> = {
  'Pre-revenue': 0.7,
  'Early growth': 0.85,
  'Growth': 1.0,
  'Scaling': 1.1,
  'Mature': 1.05,
};

const budgetScores: Record<string, number> = {
  'Under USD 10,000': 55,
  'USD 10,000–30,000': 65,
  'USD 30,000–50,000': 75,
  'USD 50,000–100,000': 85,
  'Over USD 100,000': 92,
};

export function calculateScores(input: ScanInput): ScoreWeights {
  const base = countryScores[input.targetCountry] || {
    marketAttractiveness: 65,
    regulatoryEase: 60,
    partnerAvailability: 60,
    localizationFit: 60,
  };

  const industryMult = industryMultipliers[input.industry] || 1.0;
  const stageMult = stageMultipliers[input.stage] || 0.9;
  const budgetBase = budgetScores[input.budget] || 70;

  const riskMod = input.riskAppetite === 'Aggressive' ? 1.1 : input.riskAppetite === 'Conservative' ? 0.85 : 1.0;

  const clamp = (v: number) => Math.min(95, Math.max(30, Math.round(v)));

  return {
    marketAttractiveness: clamp((base.marketAttractiveness || 65) * industryMult),
    regulatoryEase: clamp((base.regulatoryEase || 60) * stageMult),
    competitiveGap: clamp(68 * industryMult * riskMod),
    customerFit: clamp((base.localizationFit || 60) * industryMult),
    partnerAvailability: clamp((base.partnerAvailability || 60) * stageMult),
    localizationFit: clamp((base.localizationFit || 60) * riskMod),
    launchFeasibility: clamp(budgetBase * stageMult * riskMod),
  };
}

export function calculateOverallScore(scores: ScoreWeights): number {
  const weights = {
    marketAttractiveness: 0.2,
    regulatoryEase: 0.15,
    competitiveGap: 0.15,
    customerFit: 0.15,
    partnerAvailability: 0.1,
    localizationFit: 0.1,
    launchFeasibility: 0.15,
  };

  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (scores[key as keyof ScoreWeights] || 0) * weight;
  }
  return Math.round(total);
}

export function getOpportunityLevel(score: number): 'Low' | 'Medium' | 'High' | 'Very High' {
  if (score >= 80) return 'Very High';
  if (score >= 65) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

export function getRecommendation(score: number, riskAppetite: string): 'Enter Now' | 'Pilot First' | 'Wait' | 'Avoid' {
  if (score >= 80) return 'Enter Now';
  if (score >= 65) return riskAppetite === 'Aggressive' ? 'Enter Now' : 'Pilot First';
  if (score >= 45) return riskAppetite === 'Conservative' ? 'Wait' : 'Pilot First';
  return 'Avoid';
}
