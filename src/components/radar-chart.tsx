'use client';

import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { RadarDataPoint } from '@/lib/types';

interface RadarChartProps {
  data: RadarDataPoint[];
}

export function RadarChart({ data }: RadarChartProps) {
  // Shorten labels for display
  const shortLabels: Record<string, string> = {
    'Market Attractiveness': 'Market',
    'Regulatory Ease': 'Regulation',
    'Competitive Gap': 'Competition',
    'Customer Fit': 'Customers',
    'Partner Availability': 'Partners',
    'Localization Fit': 'Localization',
    'Launch Feasibility': 'Feasibility',
  };

  const chartData = data.map(d => ({
    ...d,
    shortLabel: shortLabels[d.dimension] || d.dimension,
  }));

  return (
    <div className="w-full h-[260px] sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e5e2db" />
          <PolarAngleAxis
            dataKey="shortLabel"
            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }}
            className="sm:[&_text]:!text-xs"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#c8a45e"
            fill="#c8a45e"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '13px',
              padding: '8px 12px',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`${value}/100`, 'Score']}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(label: any) => {
              const found = chartData.find(d => d.shortLabel === label);
              return found?.dimension || label;
            }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
