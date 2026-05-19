'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Trash2, ArrowRight, Radar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnalysisReport } from '@/lib/types';
import { getSavedReports, deleteReport } from '@/lib/agents';

export default function ReportsPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);

  useEffect(() => {
    setReports(getSavedReports());
  }, []);

  const handleDelete = (id: string) => {
    deleteReport(id);
    setReports(getSavedReports());
  };

  const getRecColor = (rec: string) => {
    switch (rec) {
      case 'Enter Now': return 'bg-green-500/10 text-green-600';
      case 'Pilot First': return 'bg-amber-500/10 text-amber-600';
      case 'Wait': return 'bg-orange-500/10 text-orange-600';
      default: return 'bg-red-500/10 text-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] geometric-pattern">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-1">Saved Reports</h1>
            <p className="text-gray-500 text-sm">{reports.length} report{reports.length !== 1 ? 's' : ''} saved locally</p>
          </div>
          <Link href="/scan" className="shrink-0">
            <Button className="bg-[#c8a45e] hover:bg-[#b8943e] text-[#1a1a2e] font-semibold rounded-xl gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Scan</span>
            </Button>
          </Link>
        </div>

        {reports.length === 0 ? (
          <Card className="p-8 sm:p-12 rounded-2xl border-border/50 bg-white text-center">
            <Radar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-400 mb-2">No reports yet</h2>
            <p className="text-sm text-gray-400 mb-6">Run your first market scan to see results here</p>
            <Link href="/scan">
              <Button className="bg-[#c8a45e] hover:bg-[#b8943e] text-[#1a1a2e] font-semibold rounded-xl gap-2 cursor-pointer">
                Start Market Scan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/report/${report.id}`}>
                  <Card className="p-4 sm:p-5 rounded-2xl border-border/50 bg-white hover:shadow-md transition-all cursor-pointer">
                    {/* Mobile layout: stacked */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-5">
                      {/* Score */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#1a1a2e] flex flex-col items-center justify-center shrink-0">
                        <span className="text-base sm:text-lg font-bold text-[#c8a45e]">{report.marketReadinessScore}</span>
                        <span className="text-[9px] text-gray-400">/100</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-[#1a1a2e] text-sm sm:text-base truncate max-w-[140px] sm:max-w-none">{report.input.companyName}</h3>
                          <span className="text-gray-400 text-xs sm:text-sm">→</span>
                          <span className="text-xs sm:text-sm text-gray-500 truncate">{report.input.targetCountry}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400 flex-wrap">
                          <span className="truncate max-w-[100px] sm:max-w-none">{report.input.industry}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{new Date(report.createdAt).toLocaleDateString()}</span>
                          {report.isDemo && <Badge className="bg-[#c8a45e]/10 text-[#c8a45e] text-[10px]">Demo</Badge>}
                        </div>
                      </div>

                      {/* Right side: badge + actions */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                        <Badge className={`${getRecColor(report.recommendation)} font-medium text-[10px] sm:text-xs`}>
                          {report.recommendation}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(report.id); }}
                          className="text-gray-400 hover:text-red-500 rounded-lg cursor-pointer h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
