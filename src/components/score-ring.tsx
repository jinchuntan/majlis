'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export function ScoreRing({ score, size: propSize, strokeWidth: propStroke, label, sublabel }: ScoreRingProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const size = propSize ?? (isMobile ? 120 : 160);
  const strokeWidth = propStroke ?? (isMobile ? 8 : 10);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#2d6a4f';
    if (s >= 65) return '#c8a45e';
    if (s >= 45) return '#e07a5f';
    return '#ef4444';
  };

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e2db"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl sm:text-3xl font-bold text-[#1a1a2e]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] sm:text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>
      {label && <p className="text-xs sm:text-sm font-semibold text-[#1a1a2e]">{label}</p>}
      {sublabel && <p className="text-[10px] sm:text-xs text-gray-500">{sublabel}</p>}
    </div>
  );
}
