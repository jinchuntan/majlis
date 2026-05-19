'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Users, Handshake, Globe, Compass, Radar, Check, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanInput, AgentState, AnalysisReport } from '@/lib/types';
import { generateMockReport } from '@/lib/mockData';
import { saveReport } from '@/lib/agents';

const agentDefs: Omit<AgentState, 'status' | 'insight' | 'progress'>[] = [
  { id: 'regulator', name: 'Regulator', role: 'Compliance & Licensing', icon: 'Shield' },
  { id: 'competitor', name: 'Competitor', role: 'Market Intelligence', icon: 'Target' },
  { id: 'customer', name: 'Customer', role: 'Consumer Intelligence', icon: 'Users' },
  { id: 'partner', name: 'Partner', role: 'Ecosystem & Alliances', icon: 'Handshake' },
  { id: 'localization', name: 'Localization', role: 'Cultural Adaptation', icon: 'Globe' },
  { id: 'strategy', name: 'Strategy', role: 'Go-to-Market Lead', icon: 'Compass' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Target, Users, Handshake, Globe, Compass,
};

export default function AnalyzePage() {
  const router = useRouter();
  const [agents, setAgents] = useState<AgentState[]>(
    agentDefs.map(a => ({ ...a, status: 'idle', progress: 0 }))
  );
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [allComplete, setAllComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'initializing' | 'analyzing' | 'complete'>('initializing');

  const runAnalysis = useCallback(async () => {
    const raw = sessionStorage.getItem('majlis-scan-input');
    if (!raw) {
      router.push('/scan');
      return;
    }

    const input: ScanInput = JSON.parse(raw);

    // Try API first
    let analysisReport: AnalysisReport;
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        analysisReport = await res.json();
      } else {
        analysisReport = generateMockReport(input);
      }
    } catch {
      analysisReport = generateMockReport(input);
    }

    setCurrentPhase('analyzing');

    // Simulate progressive agent analysis
    for (let i = 0; i < agentDefs.length; i++) {
      const agentId = agentDefs[i].id;
      const insight = analysisReport.agentInsights.find(a => a.agentId === agentId);

      // Start thinking
      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, status: 'thinking' as const, progress: 0 } : a
      ));

      // Progress animation
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 150));
        setAgents(prev => prev.map(a =>
          a.id === agentId ? { ...a, progress: Math.min(p, 100) } : a
        ));
      }

      // Complete
      await new Promise(r => setTimeout(r, 200));
      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, status: 'complete' as const, progress: 100, insight: insight?.summary || '' } : a
      ));
    }

    setReport(analysisReport);
    setAllComplete(true);
    setCurrentPhase('complete');
  }, [router]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const handleViewReport = () => {
    if (!report) return;
    saveReport(report);
    router.push(`/report/${report.id}`);
  };

  const completedCount = agents.filter(a => a.status === 'complete').length;

  return (
    <div className="min-h-screen bg-[#1a1a2e] geometric-pattern-dark">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-[#c8a45e]/15 text-[#c8a45e] border-[#c8a45e]/30 mb-4">
            Demo Mode
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">AI Council in Session</h1>
          <p className="text-gray-400">
            {currentPhase === 'initializing' && 'Preparing the council chamber...'}
            {currentPhase === 'analyzing' && `${completedCount} of 6 agents have reported`}
            {currentPhase === 'complete' && 'All agents have delivered their analysis'}
          </p>
        </motion.div>

        {/* Council Table - Circular layout */}
        <div className="relative max-w-3xl mx-auto mb-8 sm:mb-12">
          {/* Center hub */}
          <motion.div
            className="flex justify-center mb-6 sm:mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              allComplete ? 'bg-[#c8a45e]/20 border-[#c8a45e]' : 'bg-[#2d2d44] border-[#c8a45e]/30'
            }`}>
              <div className="text-center">
                <Radar className={`w-8 h-8 mx-auto mb-0.5 transition-colors ${allComplete ? 'text-[#c8a45e]' : 'text-[#c8a45e]/50'}`} />
                <span className="text-[10px] font-bold text-[#c8a45e]">
                  {completedCount}/6
                </span>
              </div>
            </div>
          </motion.div>

          {/* Agent cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {agents.map((agent, i) => {
              const Icon = iconMap[agent.icon] || Shield;
              return (
                <motion.div
                  key={agent.id}
                  className={`relative p-3 sm:p-5 rounded-2xl border transition-all duration-500 ${
                    agent.status === 'complete'
                      ? 'bg-[#2d2d44] border-[#c8a45e]/40'
                      : agent.status === 'thinking'
                      ? 'bg-[#2d2d44]/80 border-[#c8a45e]/20'
                      : 'bg-[#2d2d44]/40 border-white/5'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  {/* Status indicator */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      agent.status === 'complete' ? 'bg-[#c8a45e]/20' : 'bg-white/5'
                    }`}>
                      <Icon className={`w-5 h-5 ${agent.status === 'complete' ? 'text-[#c8a45e]' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      {agent.status === 'thinking' && (
                        <Loader2 className="w-5 h-5 text-[#c8a45e] animate-spin" />
                      )}
                      {agent.status === 'complete' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-[#2d6a4f] flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-0.5">{agent.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{agent.role}</p>

                  {/* Progress bar */}
                  {agent.status === 'thinking' && (
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#c8a45e] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}

                  {/* Insight preview */}
                  <AnimatePresence>
                    {agent.status === 'complete' && agent.insight && (
                      <motion.p
                        className="text-xs text-gray-400 mt-3 line-clamp-3 leading-relaxed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                      >
                        {agent.insight}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Council Verdict Button */}
        <AnimatePresence>
          {allComplete && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex flex-col items-center gap-4 p-5 sm:p-8 rounded-2xl bg-[#2d2d44]/60 border border-[#c8a45e]/20 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2d6a4f] animate-pulse" />
                  <span className="text-sm text-gray-400">Council analysis complete</span>
                </div>

                {report && (
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-2">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-[#c8a45e]">{report.marketReadinessScore}</p>
                      <p className="text-xs text-gray-500">Readiness Score</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-base sm:text-lg font-semibold text-white">{report.opportunityLevel}</p>
                      <p className="text-xs text-gray-500">Opportunity</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-base sm:text-lg font-semibold text-[#2d6a4f]">{report.recommendation}</p>
                      <p className="text-xs text-gray-500">Recommendation</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleViewReport}
                  className="bg-[#c8a45e] hover:bg-[#b8943e] text-[#1a1a2e] font-semibold px-8 py-6 text-base rounded-xl gap-2 cursor-pointer"
                >
                  View Full Report
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
