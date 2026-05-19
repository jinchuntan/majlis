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

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function OnboardingGuide({ pageKey, steps }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [spotlight, setSpotlight] = useState<Rect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const key = `majlis-onboarding-${pageKey}`;
    if (localStorage.getItem(key)) return;

    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [pageKey]);

  const positionTooltip = useCallback((elRect: Rect, pos: string) => {
    const tooltipWidth = Math.min(320, window.innerWidth - 24);
    const tooltipEstHeight = 200;
    const gap = 14;

    let top = 0;
    let left = 0;
    let transform: string | undefined;

    // All coordinates are viewport-relative (for fixed positioning)
    const spaceAbove = elRect.top;
    const spaceBelow = window.innerHeight - elRect.top - elRect.height;

    // Determine best vertical placement
    let actualPos = pos;
    if (pos === 'top' && spaceAbove < tooltipEstHeight + gap) {
      actualPos = 'bottom'; // flip if no room above
    } else if (pos === 'bottom' && spaceBelow < tooltipEstHeight + gap) {
      actualPos = 'top'; // flip if no room below
    }

    switch (actualPos) {
      case 'bottom':
        top = elRect.top + elRect.height + gap;
        left = elRect.left + elRect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = elRect.top - gap;
        left = elRect.left + elRect.width / 2 - tooltipWidth / 2;
        transform = 'translateY(-100%)';
        break;
      case 'left':
        top = elRect.top + elRect.height / 2;
        left = elRect.left - tooltipWidth - gap;
        transform = 'translateY(-50%)';
        break;
      case 'right':
        top = elRect.top + elRect.height / 2;
        left = elRect.left + elRect.width + gap;
        transform = 'translateY(-50%)';
        break;
    }

    // Clamp horizontally
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));

    // Clamp vertically — ensure tooltip stays within viewport
    if (!transform) {
      top = Math.max(12, Math.min(top, window.innerHeight - tooltipEstHeight - 12));
    }

    return { top, left, width: tooltipWidth, transform };
  }, []);

  const updatePosition = useCallback(() => {
    const step = steps[currentStep];
    if (!step || !visible) return;

    const el = document.getElementById(step.targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const elRect: Rect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    setSpotlight(elRect);
    setTooltipStyle(positionTooltip(elRect, step.position || 'bottom'));
  }, [currentStep, steps, visible, positionTooltip]);

  // Scroll into view with enough room for the tooltip, then position
  useEffect(() => {
    if (!visible) return;

    const step = steps[currentStep];
    if (!step) return;

    const el = document.getElementById(step.targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tooltipSpace = 220; // tooltip height + gap
    const pos = step.position || 'bottom';

    // Check if element + tooltip space fits in viewport
    const needsAbove = pos === 'top' ? rect.top < tooltipSpace : false;
    const needsBelow = pos === 'bottom' ? (window.innerHeight - rect.bottom) < tooltipSpace : false;
    const outOfView = rect.top < 0 || rect.bottom > window.innerHeight;

    if (outOfView || needsAbove || needsBelow) {
      // Scroll so that the element is centered, giving room for tooltip on either side
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = setTimeout(updatePosition, 500);
      return () => clearTimeout(timer);
    } else {
      updatePosition();
    }
  }, [visible, currentStep, steps, updatePosition]);

  // Recalculate on scroll and resize
  useEffect(() => {
    if (!visible) return;

    const handleUpdate = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, updatePosition]);

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

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Spotlight with box-shadow overlay — the huge spread creates the dark backdrop */}
          {spotlight ? (
            <div
              className="fixed z-[9998] rounded-xl border-2 border-[#c8a45e] transition-all duration-300 ease-out"
              style={{
                top: spotlight.top - 8,
                left: spotlight.left - 8,
                width: spotlight.width + 16,
                height: spotlight.height + 16,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.6), 0 0 0 4px rgba(200,164,94,0.2)',
                pointerEvents: 'none',
              }}
            />
          ) : (
            /* Fallback overlay before spotlight is calculated */
            <div
              className="fixed inset-0 z-[9998] bg-black/60"
              onClick={dismiss}
            />
          )}

          {/* Clickable backdrop behind spotlight to dismiss */}
          <div
            className="fixed inset-0 z-[9997]"
            onClick={dismiss}
          />

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            className="fixed z-[9999]"
            style={tooltipStyle}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
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
