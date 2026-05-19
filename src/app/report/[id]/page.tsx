'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield, Target, Users, Handshake, Globe, Compass, ArrowLeft,
  AlertTriangle, CheckCircle2, Clock, Copy, Check, Download,
  TrendingUp, MapPin, Megaphone, CalendarDays, FileText, Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScoreRing } from '@/components/score-ring';
import { RadarChart } from '@/components/radar-chart';
import { AnalysisReport } from '@/lib/types';
import { getReportById, generateInvestorBrief } from '@/lib/agents';
import Link from 'next/link';

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const statusColors: Record<string, string> = {
  required: 'bg-red-500/10 text-red-600',
  recommended: 'bg-amber-500/10 text-amber-600',
  optional: 'bg-blue-500/10 text-blue-600',
};

const partnerTypeColors: Record<string, string> = {
  retail: 'bg-purple-500/10 text-purple-600',
  distribution: 'bg-blue-500/10 text-blue-600',
  event: 'bg-pink-500/10 text-pink-600',
  government: 'bg-green-500/10 text-green-600',
  influencer: 'bg-amber-500/10 text-amber-600',
};

const confidenceLabels: Record<string, { color: string; label: string }> = {
  high: { color: 'bg-green-500/10 text-green-600', label: 'High confidence' },
  medium: { color: 'bg-amber-500/10 text-amber-600', label: 'Medium confidence' },
  low: { color: 'bg-red-500/10 text-red-500', label: 'Needs validation' },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Target, Users, Handshake, Globe, Compass,
};

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [briefText, setBriefText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showBrief, setShowBrief] = useState(false);

  useEffect(() => {
    const r = getReportById(id);
    if (r) {
      setReport(r);
    } else {
      router.push('/reports');
    }
  }, [id, router]);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading report...</div>
      </div>
    );
  }

  const handleGenerateBrief = () => {
    const brief = generateInvestorBrief(report);
    setBriefText(brief);
    setShowBrief(true);
  };

  const handleCopyBrief = async () => {
    await navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Enter Now': return 'text-green-600 bg-green-500/10';
      case 'Pilot First': return 'text-amber-600 bg-amber-500/10';
      case 'Wait': return 'text-orange-600 bg-orange-500/10';
      case 'Avoid': return 'text-red-600 bg-red-500/10';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <Link href="/reports">
            <Button variant="ghost" className="gap-2 text-gray-500 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              All Reports
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {report.isDemo && (
              <Badge className="bg-[#c8a45e]/15 text-[#c8a45e] border-[#c8a45e]/30">Demo</Badge>
            )}
            <Button onClick={handleGenerateBrief} variant="outline" className="gap-2 rounded-xl cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Generate Investor Brief</span>
              <span className="sm:hidden">Brief</span>
            </Button>
          </div>
        </div>

        {/* Executive Verdict */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-5 sm:p-8 rounded-2xl border-border/50 bg-white overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-5 sm:gap-8">
              <ScoreRing
                score={report.marketReadinessScore}
                label="Market Readiness"
                sublabel={report.opportunityLevel}
              />
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">
                    {report.input.companyName}
                  </h1>
                  <span className="text-gray-400">→</span>
                  <span className="text-base sm:text-lg text-gray-600">{report.input.targetCountry}</span>
                  <Badge className={`${getRecommendationColor(report.recommendation)} font-semibold px-3 py-1`}>
                    {report.recommendation}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{report.executiveSummary}</p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide">
            <TabsList className="bg-white border border-border/50 rounded-xl p-1 h-auto inline-flex w-max sm:w-auto sm:flex-wrap">
              <TabsTrigger value="overview" className="rounded-lg cursor-pointer text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="agents" className="rounded-lg cursor-pointer text-xs sm:text-sm">Council</TabsTrigger>
              <TabsTrigger value="risks" className="rounded-lg cursor-pointer text-xs sm:text-sm">Risks</TabsTrigger>
              <TabsTrigger value="competitors" className="rounded-lg cursor-pointer text-xs sm:text-sm">Competitors</TabsTrigger>
              <TabsTrigger value="customers" className="rounded-lg cursor-pointer text-xs sm:text-sm">Personas</TabsTrigger>
              <TabsTrigger value="compliance" className="rounded-lg cursor-pointer text-xs sm:text-sm">Compliance</TabsTrigger>
              <TabsTrigger value="localization" className="rounded-lg cursor-pointer text-xs sm:text-sm">Localization</TabsTrigger>
              <TabsTrigger value="partners" className="rounded-lg cursor-pointer text-xs sm:text-sm">Partners</TabsTrigger>
              <TabsTrigger value="launch" className="rounded-lg cursor-pointer text-xs sm:text-sm">Launch</TabsTrigger>
            </TabsList>
          </div>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Market Opportunity Radar</h3>
                <RadarChart data={report.radarData} />
              </Card>

              {/* Quick Stats */}
              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Key Dimensions</h3>
                <div className="space-y-3">
                  {report.radarData.map(d => (
                    <div key={d.dimension} className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm text-gray-600 w-24 sm:w-40 shrink-0 truncate">{d.dimension}</span>
                      <div className="flex-1 h-3 bg-[#f0ede8] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: d.score >= 75 ? '#2d6a4f' : d.score >= 55 ? '#c8a45e' : '#e07a5f' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.score}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#1a1a2e] w-10 text-right">{d.score}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Risk Summary */}
              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Risk Heatmap</h3>
                <div className="grid grid-cols-2 gap-3">
                  {report.risks.map(risk => (
                    <div key={risk.name} className={`p-3 rounded-xl border ${severityColors[risk.severity]}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold uppercase">{risk.severity}</span>
                      </div>
                      <p className="text-sm font-medium">{risk.name}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Scan Details */}
              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Scan Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Industry', report.input.industry],
                    ['Stage', report.input.stage],
                    ['Budget', report.input.budget],
                    ['Timeline', report.input.timeline],
                    ['Risk Appetite', report.input.riskAppetite],
                    ['Target', report.input.targetCustomer],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-gray-400 text-xs">{label}</span>
                      <p className="font-medium text-[#1a1a2e]">{value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* AGENTS TAB */}
          <TabsContent value="agents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.agentInsights.map((agent, i) => {
                const Icon = iconMap[agent.icon] || Shield;
                const conf = confidenceLabels[agent.confidence];
                return (
                  <motion.div
                    key={agent.agentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-5 rounded-2xl border-border/50 bg-white h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#c8a45e]/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[#c8a45e]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-[#1a1a2e]">{agent.agentName} Agent</h3>
                            <Badge className={`text-[10px] ${conf.color}`}>{conf.label}</Badge>
                          </div>
                          <p className="text-xs text-gray-400">{agent.agentRole}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{agent.summary}</p>
                      <div className="space-y-1.5">
                        {agent.details.map((d, j) => (
                          <div key={j} className="flex gap-2 text-xs text-gray-500">
                            <span className="text-[#c8a45e] mt-0.5">•</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* RISKS TAB */}
          <TabsContent value="risks">
            <div className="space-y-4">
              {report.risks.map((risk, i) => (
                <motion.div
                  key={risk.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 rounded-2xl border-border/50 bg-white">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${severityColors[risk.severity]}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-[#1a1a2e]">{risk.name}</h3>
                          <Badge className={`${severityColors[risk.severity]} text-[10px] uppercase font-bold`}>{risk.severity}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                        <div className="flex items-start gap-2 text-sm text-green-700 bg-green-500/5 p-3 rounded-xl">
                          <Shield className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{risk.mitigation}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* COMPETITORS TAB */}
          <TabsContent value="competitors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.competitors.map((comp, i) => (
                <motion.div
                  key={comp.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 rounded-2xl border-border/50 bg-white h-full">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#1a1a2e]">{comp.name}</h3>
                      <Badge variant="outline" className="text-xs">{comp.priceTier}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{comp.positioning}</p>
                    {comp.marketShare && (
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-400">Est. market share: {comp.marketShare}</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-green-600 font-semibold shrink-0">+</span>
                        <span className="text-gray-600">{comp.strength}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-red-500 font-semibold shrink-0">−</span>
                        <span className="text-gray-600">{comp.weakness}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* CUSTOMERS TAB */}
          <TabsContent value="customers">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.personas.map((persona, i) => (
                <motion.div
                  key={persona.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 rounded-2xl border-border/50 bg-white h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{persona.avatar}</span>
                      <div>
                        <h3 className="font-semibold text-[#1a1a2e]">{persona.name}</h3>
                        <p className="text-xs text-gray-400">Age {persona.ageRange}</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-xs font-medium text-gray-400 uppercase">Motivation</span>
                        <p className="text-gray-600 mt-0.5">{persona.motivation}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-400 uppercase">Main Concern</span>
                        <p className="text-gray-600 mt-0.5">{persona.mainConcern}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-400 uppercase">Best Message</span>
                        <p className="text-[#c8a45e] mt-0.5 italic">&ldquo;{persona.bestMessage}&rdquo;</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{persona.preferredChannel}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* COMPLIANCE TAB */}
          <TabsContent value="compliance">
            <Card className="p-6 rounded-2xl border-border/50 bg-white">
              <div className="space-y-3">
                {report.compliance.map((item, i) => (
                  <motion.div
                    key={item.item}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#faf9f7] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="mt-0.5">
                      {item.status === 'required' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : item.status === 'recommended' ? (
                        <Star className="w-4 h-4 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-[#1a1a2e]">{item.item}</span>
                        <Badge className={`text-[10px] ${statusColors[item.status]}`}>{item.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* LOCALIZATION TAB */}
          <TabsContent value="localization">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="w-5 h-5 text-[#c8a45e]" />
                  <h3 className="font-semibold text-[#1a1a2e]">Messaging Angle</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{report.localization.messagingAngle}</p>
              </Card>

              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-[#c8a45e]" />
                  <h3 className="font-semibold text-[#1a1a2e]">Campaign Theme</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">&ldquo;{report.localization.campaignTheme}&rdquo;</p>
                <Separator className="my-4" />
                <span className="text-xs font-medium text-gray-400 uppercase">Tone</span>
                <p className="text-sm text-gray-600 mt-1">{report.localization.languageTone}</p>
              </Card>

              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <h3 className="font-semibold text-[#1a1a2e] mb-3">Words & Claims to Avoid</h3>
                <div className="flex flex-wrap gap-2">
                  {report.localization.wordsToAvoid.map(w => (
                    <Badge key={w} variant="outline" className="bg-red-500/5 text-red-500 border-red-500/20 text-xs">{w}</Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6 rounded-2xl border-border/50 bg-white">
                <h3 className="font-semibold text-[#1a1a2e] mb-3">Cultural Adaptation</h3>
                <div className="space-y-2">
                  {report.localization.culturalAdaptation.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-[#c8a45e] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* PARTNERS TAB */}
          <TabsContent value="partners">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.partners.map((partner, i) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 rounded-2xl border-border/50 bg-white h-full">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#1a1a2e]">{partner.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] ${partnerTypeColors[partner.type]}`}>{partner.type}</Badge>
                        {partner.relevance === 'high' && (
                          <Badge className="bg-green-500/10 text-green-600 text-[10px]">Key</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{partner.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* LAUNCH PLAN TAB */}
          <TabsContent value="launch">
            <div className="space-y-4">
              {report.launchPlan.map((week, i) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-5 rounded-2xl border-border/50 bg-white">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#1a1a2e] flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs text-[#c8a45e] font-bold">WEEK</span>
                        <span className="text-lg font-bold text-white">{week.week}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1a1a2e] mb-2">{week.title}</h3>
                        <div className="space-y-1.5 mb-3">
                          {week.actions.map((action, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-gray-600">
                              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#c8a45e]/5 border border-[#c8a45e]/10">
                          <MapPin className="w-3.5 h-3.5 text-[#c8a45e]" />
                          <span className="text-xs font-medium text-[#c8a45e]">{week.milestone}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Investor Brief Modal */}
        {showBrief && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowBrief(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#1a1a2e]">Investor Brief</h2>
                <Button onClick={handleCopyBrief} variant="outline" className="gap-2 rounded-xl cursor-pointer text-xs sm:text-sm shrink-0">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words font-sans leading-relaxed bg-[#faf9f7] p-3 sm:p-4 rounded-xl overflow-x-hidden">
                {briefText}
              </pre>
            </motion.div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            This tool provides AI-assisted strategic guidance and should be validated with local experts before execution.
          </p>
        </div>
      </div>
    </div>
  );
}
