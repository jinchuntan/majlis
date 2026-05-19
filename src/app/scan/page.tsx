'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScanInput } from '@/lib/types';
import { demoInput } from '@/lib/mockData';

const industries = ['Beauty & Personal Care', 'Food & Beverage', 'Technology', 'Fashion', 'Healthcare', 'Education', 'Fintech', 'E-commerce'];
const stages = ['Pre-revenue', 'Early growth', 'Growth', 'Scaling', 'Mature'];
const budgets = ['Under USD 10,000', 'USD 10,000–30,000', 'USD 30,000–50,000', 'USD 50,000–100,000', 'Over USD 100,000'];
const timelines = ['30 days', '60 days', '90 days', '6 months', '12 months'];
const riskLevels = ['Conservative', 'Moderate', 'Aggressive'];
const countries = ['United Arab Emirates', 'Saudi Arabia', 'Singapore', 'Indonesia', 'United Kingdom', 'United States', 'Japan', 'Turkey'];

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f7]" />}>
      <ScanForm />
    </Suspense>
  );
}

function ScanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<ScanInput>({
    companyName: '',
    product: '',
    currentCountry: '',
    targetCountry: '',
    industry: '',
    stage: '',
    targetCustomer: '',
    budget: '',
    timeline: '',
    riskAppetite: '',
    websiteUrl: '',
    notes: '',
  });

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setForm(demoInput);
    }
  }, [searchParams]);

  const fillDemo = () => setForm(demoInput);
  const clearForm = () => setForm({
    companyName: '', product: '', currentCountry: '', targetCountry: '',
    industry: '', stage: '', targetCustomer: '', budget: '', timeline: '',
    riskAppetite: '', websiteUrl: '', notes: '',
  });

  const isValid = form.companyName && form.product && form.currentCountry && form.targetCountry && form.industry && form.stage && form.targetCustomer && form.budget && form.timeline && form.riskAppetite;

  const handleSubmit = () => {
    if (!isValid) return;
    sessionStorage.setItem('majlis-scan-input', JSON.stringify(form));
    router.push('/analyze');
  };

  const update = (field: keyof ScanInput, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-[#faf9f7] geometric-pattern">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-2">Market Scan</h1>
          <p className="text-gray-500">Tell us about your expansion opportunity</p>
        </motion.div>

        <div className="flex gap-3 mb-8">
          <Button onClick={fillDemo} variant="outline" className="gap-2 rounded-xl cursor-pointer border-[#c8a45e]/30 text-[#c8a45e] hover:bg-[#c8a45e]/10">
            <Sparkles className="w-4 h-4" />
            Use Demo Example
          </Button>
          <Button onClick={clearForm} variant="ghost" className="gap-2 rounded-xl cursor-pointer text-gray-400">
            <RotateCcw className="w-4 h-4" />
            Clear
          </Button>
        </div>

        <Card className="p-6 sm:p-8 rounded-2xl border-border/50 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Company Name *</Label>
              <Input value={form.companyName} onChange={e => update('companyName', e.target.value)} placeholder="e.g. NurGlow Labs" className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Current Country *</Label>
              <Input value={form.currentCountry} onChange={e => update('currentCountry', e.target.value)} placeholder="e.g. Malaysia" className="rounded-xl" />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Product / Service *</Label>
              <Textarea value={form.product} onChange={e => update('product', e.target.value)} placeholder="Describe your product or service" className="rounded-xl resize-none" rows={2} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Target Country *</Label>
              <select value={form.targetCountry} onChange={e => update('targetCountry', e.target.value)} className="w-full h-11 sm:h-10 rounded-xl border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <option value="">Select target country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Industry *</Label>
              <select value={form.industry} onChange={e => update('industry', e.target.value)} className="w-full h-11 sm:h-10 rounded-xl border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <option value="">Select industry</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Business Stage *</Label>
              <select value={form.stage} onChange={e => update('stage', e.target.value)} className="w-full h-11 sm:h-10 rounded-xl border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <option value="">Select stage</option>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Budget Range *</Label>
              <select value={form.budget} onChange={e => update('budget', e.target.value)} className="w-full h-11 sm:h-10 rounded-xl border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <option value="">Select budget</option>
                {budgets.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Target Customer *</Label>
              <Input value={form.targetCustomer} onChange={e => update('targetCustomer', e.target.value)} placeholder="e.g. Urban Muslim women aged 22–40" className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Timeline *</Label>
              <select value={form.timeline} onChange={e => update('timeline', e.target.value)} className="w-full h-11 sm:h-10 rounded-xl border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <option value="">Select timeline</option>
                {timelines.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-[#1a1a2e]">Risk Appetite *</Label>
              <div className="flex gap-2 pt-1">
                {riskLevels.map(r => (
                  <button
                    key={r}
                    onClick={() => update('riskAppetite', r)}
                    className={`flex-1 py-2.5 sm:py-2 px-3 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                      form.riskAppetite === r
                        ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                        : 'bg-white text-gray-500 border-border hover:border-[#c8a45e]/40'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-400">Website URL</Label>
              <Input value={form.websiteUrl} onChange={e => update('websiteUrl', e.target.value)} placeholder="https://" className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-400">Additional Notes</Label>
              <Input value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any context for the council" className="rounded-xl" />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex justify-stretch sm:justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full sm:w-auto bg-[#c8a45e] hover:bg-[#b8943e] text-[#1a1a2e] font-semibold px-8 py-6 text-base rounded-xl gap-2 disabled:opacity-40 cursor-pointer"
            >
              Launch AI Council
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
