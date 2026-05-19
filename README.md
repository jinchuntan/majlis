# Majlis Radar

**An AI majlis that turns market chaos into an expansion strategy.**

Majlis Radar is an AI market-entry council that helps startups, SMEs, and founders make smarter expansion decisions. Inspired by the "majlis" — a traditional council gathering for discussion and decision-making — the app simulates six specialist AI agents analyzing your market-entry opportunity and delivering a complete expansion playbook.

## Why It's Unique

Most market research tools give you data. Majlis Radar gives you a **strategic verdict**. Instead of a chatbot, you get a visual AI council table where six specialist agents — Regulator, Competitor, Customer, Partner, Localization, and Strategy — work together to produce an actionable go-to-market plan.

## Features

- **AI Council Analysis** — Six specialist agents analyze your opportunity simultaneously
- **Market Opportunity Radar** — Visual scoring across 7 strategic dimensions
- **Risk Heatmap** — Risk assessment with severity levels and mitigation strategies
- **Competitor Landscape** — Positioning analysis of 5+ competitors
- **Customer Personas** — Three detailed personas with messaging recommendations
- **Compliance Checklist** — Regulatory requirements with status tracking
- **Localization Playbook** — Cultural adaptation and messaging guidance
- **Partner Map** — Retail, distribution, government, and influencer recommendations
- **30-Day Launch Plan** — Week-by-week actions with milestones
- **Investor Brief Generator** — One-click exportable summary
- **Saved Reports** — Local persistence for all generated analyses

## Tech Stack

- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** with custom theme
- **shadcn/ui** components
- **Recharts** for radar charts and data visualization
- **Framer Motion** for animations
- **Lucide** icons
- **Local Storage** for report persistence

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Enable Real AI Mode

1. Copy `.env.example` to `.env.local`
2. Add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
```

The app works fully without an API key using high-quality mock data.

## Demo Scenario

Click **"Use Demo Example"** on the scan page to auto-fill:

- **Company:** NurGlow Labs
- **Product:** Halal-certified skincare using tropical botanical ingredients
- **Expansion:** Malaysia → United Arab Emirates
- **Industry:** Beauty & Personal Care
- **Budget:** USD 30,000–50,000
- **Timeline:** 90 days

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── scan/page.tsx         # Market scan wizard
│   ├── analyze/page.tsx      # AI council analysis screen
│   ├── report/[id]/page.tsx  # Results dashboard
│   ├── reports/page.tsx      # Saved reports
│   └── api/analyze/route.ts  # Analysis API endpoint
├── components/
│   ├── navbar.tsx            # Navigation bar
│   ├── score-ring.tsx        # Animated score ring
│   ├── radar-chart.tsx       # Recharts radar chart
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── types.ts              # TypeScript type definitions
    ├── agents.ts             # Agent orchestration & storage
    ├── mockData.ts           # Mock data generation
    ├── scoring.ts            # Scoring algorithms
    └── utils.ts              # Utility functions
```

## Future Improvements

- Real-time AI streaming with agent-by-agent updates
- PDF export for reports
- Multi-language support (Arabic, Malay, etc.)
- Team collaboration and shared reports
- Historical data integration for trend analysis
- API marketplace for third-party data sources

## Hackathon Pitch

> "Expanding into a new country is like navigating chaos. You need regulatory insight, competitive intelligence, cultural awareness, and a launch strategy — all at once. Majlis Radar simulates a council of six AI advisors that analyze your expansion opportunity and deliver a complete market-entry playbook in minutes, not months. It's your AI majlis for global growth."
