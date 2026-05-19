'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radar, Shield, Target, Users, Globe, ArrowRight, Sparkles, TrendingUp, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Users, title: 'AI Council Analysis', desc: 'Six specialist agents analyze your opportunity from every angle', color: '#c8a45e' },
  { icon: Radar, title: 'Market Opportunity Radar', desc: 'Visual scoring across 7 strategic dimensions', color: '#2d6a4f' },
  { icon: Shield, title: 'Compliance & Risk Review', desc: 'Regulatory roadmap with risk severity mapping', color: '#e07a5f' },
  { icon: Map, title: 'Go-to-Market Plan', desc: 'Week-by-week launch strategy with milestones', color: '#457b9d' },
];

const agents = [
  { name: 'Regulator', role: 'Compliance', icon: '🛡️' },
  { name: 'Competitor', role: 'Market Intel', icon: '🎯' },
  { name: 'Customer', role: 'Consumer', icon: '👥' },
  { name: 'Partner', role: 'Ecosystem', icon: '🤝' },
  { name: 'Localization', role: 'Culture', icon: '🌍' },
  { name: 'Strategy', role: 'Go-to-Market', icon: '🧭' },
];

export default function LandingPage() {
  return (
    <div className="bg-[#1a1a2e] min-h-screen -mt-14 sm:-mt-16 pt-14 sm:pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern-dark" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c8a45e]/15 border border-[#c8a45e]/30 mb-8">
              <Sparkles className="w-4 h-4 text-[#c8a45e]" />
              <span className="text-sm font-medium text-[#c8a45e]">AI-Powered Market Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 tracking-tight">
              An AI majlis that turns
              <br />
              <span className="text-[#c8a45e]">market chaos</span> into an
              <br />
              <span className="text-[#c8a45e]">expansion strategy</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
              Six AI advisors analyze your market-entry opportunity across regulation,
              competition, customers, partnerships, culture, and strategy — delivering
              a complete expansion playbook in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/scan">
                <Button className="bg-[#c8a45e] hover:bg-[#b8943e] text-[#1a1a2e] font-semibold px-8 py-6 text-base rounded-xl gap-2 shadow-lg shadow-[#c8a45e]/20 cursor-pointer">
                  Start Market Scan
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/scan?demo=true">
                <Button variant="outline" className="border-[#c8a45e]/30 text-[#c8a45e] hover:bg-[#c8a45e]/10 px-8 py-6 text-base rounded-xl bg-transparent cursor-pointer">
                  View Sample Report
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Council Visual */}
      <section className="relative py-12 sm:py-20 bg-[#1a1a2e]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your AI Advisory Council</h2>
            <p className="text-gray-400">Six specialist agents, one strategic verdict</p>
          </motion.div>

          <div className="relative max-w-lg mx-auto">
            {/* Center circle — hidden on mobile, shown on sm+ */}
            <div className="hidden sm:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#c8a45e]/10 border-2 border-[#c8a45e]/30 items-center justify-center z-10">
              <div className="text-center">
                <Radar className="w-8 h-8 text-[#c8a45e] mx-auto mb-1" />
                <span className="text-xs font-semibold text-[#c8a45e]">MAJLIS</span>
              </div>
            </div>

            {/* Agent nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-8">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  className="flex flex-col items-center p-4 rounded-xl bg-[#2d2d44]/60 border border-[#c8a45e]/10 hover:border-[#c8a45e]/40 transition-all cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <span className="text-2xl mb-2">{agent.icon}</span>
                  <span className="text-sm font-semibold text-white">{agent.name}</span>
                  <span className="text-xs text-gray-500">{agent.role}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-20 bg-[#0f0f1e]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="p-6 rounded-2xl bg-[#1a1a2e] border border-[#c8a45e]/10 hover:border-[#c8a45e]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-20 bg-[#1a1a2e]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Intelligence in 3 Steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Describe Your Move', desc: 'Tell us about your company and target market', icon: Target },
              { step: '02', title: 'Council Analyzes', desc: 'Six AI agents evaluate your opportunity simultaneously', icon: TrendingUp },
              { step: '03', title: 'Get Your Playbook', desc: 'A complete dashboard with scores, risks, and a launch plan', icon: Map },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative p-6 rounded-2xl bg-[#2d2d44]/40 border border-[#c8a45e]/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="text-4xl font-bold text-[#c8a45e]/20 absolute top-4 right-4">{item.step}</span>
                <item.icon className="w-8 h-8 text-[#c8a45e] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-[#0f0f1e] geometric-pattern-dark">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to explore your next market?</h2>
          <p className="text-gray-400 mb-8">Get a complete market-entry analysis in minutes, not months.</p>
          <Link href="/scan">
            <Button className="bg-[#c8a45e] hover:bg-[#b8943e] text-[#1a1a2e] font-semibold px-8 py-6 text-base rounded-xl gap-2 cursor-pointer">
              Start Your Market Scan
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-[#1a1a2e] border-t border-[#c8a45e]/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-[#c8a45e]" />
            <span className="text-sm font-medium text-white">Majlis Radar</span>
          </div>
          <p className="text-xs text-gray-500">
            AI-assisted strategic guidance. Validate with local experts before execution.
          </p>
        </div>
      </footer>
    </div>
  );
}
