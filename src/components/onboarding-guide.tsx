'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export interface OnboardingStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingGuideProps {
  pageKey: string;
  steps: OnboardingStep[];
}

interface TooltipPosition {
  top: number;
  left: number;
  spotlightRect: DOMRect | null;
}

export function OnboardingGuide({ pageKey, steps }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0, spotlightRect: null });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = `majlis-onboarding-${pageKey}`;
    if (localStorage.getItem(key)) return;

    // Small delay so elements have time to render/animate in
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [pageKey]);

  const calculatePosition = useCallback(() => {
    const step = steps[currentStep];
    if (!step) return;

    const el = document.getElementById(step.targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 180;
    const gap = 16;
    const pos = step.position || 'bottom';

    let top = 0;
    let left = 0;

    switch (pos) {
      case 'bottom':
        top = rect.bottom + gap + window.scrollY;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = rect.top - tooltipHeight - gap + window.scrollY;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2 + window.scrollY;
        left = rect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2 + window.scrollY;
        left = rect.right + gap;
        break;
    }

    // Clamp to viewport
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));
    top = Math.max(12 + window.scrollY, top);

    setPosition({ top, left, spotlightRect: rect });

    // Scroll the target into view if needed
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentStep, steps]);

  useEffect(() => {
    if (!visible) return;
    // Recalculate after a brief delay for scroll to settle
    const timer = setTimeout(calculatePosition, 100);
    window.addEventListener('resize', calculatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [visible, currentStep, calculatePosition]);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(`majlis-onboarding-${pageKey}`, 'done');
  }, [pageKey]);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      dismiss();
    }
  };

  const back = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!visible || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const spotRect = position.spotlightRect;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay with spotlight cutout */}
          <div className="fixed inset-0 z-[9998]" style={{ pointerEvents: 'none' }}>
            <svg className="w-full h-full" style={{ position: 'fixed', inset: 0 }}>
              <defs>
                <mask id="onboarding-spotlight">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {spotRect && (
                    <rect
                      x={spotRect.left - 6}
                      y={spotRect.top - 6}
                      width={spotRect.width + 12}
                      height={spotRect.height + 12}
                      rx="12"
                      fill="black"
                    />
                  )}
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.6)"
                mask="url(#onboarding-spotlight)"
                style={{ pointerEvents: 'auto' }}
                onClick={dismiss}
              />
            </svg>

            {/* Spotlight ring highlight */}
            {spotRect && (
              <div
                className="absolute rounded-xl border-2 border-[#c8a45e] shadow-[0_0_0_4px_rgba(200,164,94,0.15)]"
                style={{
                  top: spotRect.top - 6,
                  left: spotRect.left - 6,
                  width: spotRect.width + 12,
                  height: spotRect.height + 12,
                  pointerEvents: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            )}
          </div>

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            className="fixed z-[9999] w-[320px]"
            style={{ top: position.top, left: position.left }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            key={currentStep}
          >
            <div className="bg-[#1a1a2e] border border-[#c8a45e]/40 rounded-2xl p-5 shadow-2xl shadow-black/40">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#c8a45e]" />
                  <span className="text-xs font-medium text-[#c8a45e]">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <button
                  onClick={dismiss}
                  className="text-gray-500 hover:text-white transition-colors p-1 cursor-pointer"
                  aria-label="Close tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{step.description}</p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={dismiss}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Skip tour
                </button>
                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={back}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold bg-[#c8a45e] hover:bg-[#b8943e] text-[#1a1a2e] rounded-lg transition-colors cursor-pointer"
                  >
                    {isLast ? 'Finish' : 'Next'}
                    {!isLast && <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentStep ? 'bg-[#c8a45e]' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
