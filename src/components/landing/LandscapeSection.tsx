import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { DollarSign, Blocks, ShoppingCart, TrendingUp, Zap, Shield } from 'lucide-react';

const categories = [
  {
    id: 'earners',
    title: 'The Earners',
    subtitle: 'Service Agents',
    icon: DollarSign,
    color: '#10B981',
    description: 'Agents that sell digital resources. Low-risk — they receive money, not spend it.',
    examples: [
      { name: 'AInalyst', stat: '~$350k volume', desc: 'Crypto intelligence on Virtuals' },
      { name: 'Prixe', stat: 'Financial APIs', desc: 'Stock data & reports' },
      { name: 'Weather Bots', stat: '$0.001/call', desc: 'Hyper-local data' },
    ],
    percentage: 90,
  },
  {
    id: 'enablers',
    title: 'The Enablers',
    subtitle: 'Infrastructure',
    icon: Blocks,
    color: '#3B82F6',
    description: 'The Visa/Stripe layer for agents. Handles complex crypto signing.',
    examples: [
      { name: 'Crossmint', stat: 'Enterprise', desc: 'Wallets for Agents' },
      { name: 'Kite AI', stat: 'L1 Chain', desc: 'Agentic Internet layer' },
      { name: 'Questflow', stat: 'Orchestration', desc: 'Multi-agent swarms' },
    ],
    percentage: null,
  },
  {
    id: 'spenders',
    title: 'The Spenders',
    subtitle: 'Autonomous Buyers',
    icon: ShoppingCart,
    color: '#F59E0B',
    description: 'The smallest group. Why? Because xBPP doesn\'t exist yet.',
    examples: [
      { name: 'Virtuals', stat: 'Walled Gardens', desc: 'Gaming economies only' },
      { name: 'XMTP Demos', stat: 'Hackathons', desc: 'Not production-ready' },
    ],
    percentage: 10,
    blocked: true,
  },
];

const trends = [
  {
    icon: TrendingUp,
    title: 'DeFi as an API',
    description: 'Agents treating protocols as paid services, not UIs.',
  },
  {
    icon: Zap,
    title: 'Pay-Per-Inference',
    description: 'Death of SaaS. Pay 0.0004 USDC for exactly 500 tokens.',
  },
  {
    icon: Shield,
    title: 'The Trust Wall',
    description: '"Agents can pay, but should they?" — The hype hits reality.',
    highlight: true,
  },
];

export function LandscapeSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShowCategories(true), 400);
          setTimeout(() => setShowTrends(true), 800);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: '#EDEDEA' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(62, 207, 165, 0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span
            className="inline-block px-3 py-1 text-xs font-mono rounded-full mb-4"
            style={{ background: 'rgba(62, 207, 165, 0.1)', color: '#3ECFA5' }}
          >
            The x402 Ecosystem — January 2026
          </span>
          <h2
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(36px, 7vw, 60px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#1E2D2D',
            }}
          >
            HIGH GROWTH. <span style={{ color: '#3ECFA5' }}>LOW GOVERNANCE.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mt-4" style={{ color: '#6B6B67' }}>
            x402 has moved from "experimental" to "early adoption." But the market is lopsided.
          </p>
        </div>

        {/* 90/10 Split Visualization */}
        <div className={cn(
          "mb-16 transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="relative h-16 rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2E2DE' }}>
            {/* 90% Bar */}
            <div
              className="absolute inset-y-0 left-0 flex items-center justify-start pl-6 transition-all duration-1000 ease-out"
              style={{ width: isVisible ? '90%' : '0%', background: 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))' }}
            >
              <span className="font-mono font-bold text-lg" style={{ color: '#10B981' }}>90%</span>
              <span className="ml-2 text-sm hidden sm:inline" style={{ color: '#10B981' }}>Agents Selling (Safe)</span>
            </div>

            {/* 10% Bar with pulse */}
            <div
              className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 transition-all duration-1000 ease-out delay-300"
              style={{ width: isVisible ? '10%' : '0%', background: 'linear-gradient(to left, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))' }}
            >
              <span className="font-mono font-bold text-lg animate-pulse" style={{ color: '#F59E0B' }}>10%</span>
            </div>

            {/* Divider */}
            <div
              className="absolute inset-y-0 w-px transition-all duration-1000 ease-out"
              style={{ left: isVisible ? '90%' : '0%', background: '#E2E2DE' }}
            />
          </div>

          <div className="flex justify-between mt-3 text-xs font-mono" style={{ color: '#9E9E98' }}>
            <span>← Earners (Low Risk)</span>
            <span style={{ color: '#F59E0B' }}>Spenders (High Risk) →</span>
          </div>
        </div>

        {/* The Big Three Categories */}
        <div className={cn(
          "grid md:grid-cols-3 gap-6 mb-16 transition-all duration-700",
          showCategories ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={cn(
                "relative p-6 rounded-2xl transition-all duration-500"
              )}
              style={{
                transitionDelay: `${index * 100}ms`,
                background: `${category.color}10`,
                border: `1px solid ${category.color}30`,
                boxShadow: category.blocked ? `0 0 0 1px ${category.color}40` : 'none',
              }}
            >
              {/* Blocked indicator */}
              {category.blocked && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full"
                  style={{ background: `${category.color}20`, border: `1px solid ${category.color}40` }}
                >
                  <span className="text-xs font-mono" style={{ color: category.color }}>BLOCKED BY TRUST GAP</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ background: `${category.color}15` }}>
                  <category.icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: '#1E2D2D' }}>{category.title}</h3>
                  <span className="text-xs" style={{ color: '#6B6B67' }}>{category.subtitle}</span>
                </div>
                {category.percentage && (
                  <span className="ml-auto font-mono font-bold" style={{ color: category.color }}>
                    {category.percentage}%
                  </span>
                )}
              </div>

              <p className="text-sm mb-4" style={{ color: '#6B6B67' }}>
                {category.description}
              </p>

              <div className="space-y-2">
                {category.examples.map((example) => (
                  <div
                    key={example.name}
                    className="flex items-center justify-between py-2 px-3 rounded-lg"
                    style={{ background: 'white', border: '1px solid #E2E2DE' }}
                  >
                    <div>
                      <span className="text-sm font-medium" style={{ color: '#1E2D2D' }}>{example.name}</span>
                      <span className="text-xs ml-2" style={{ color: '#6B6B67' }}>{example.desc}</span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: category.color }}>{example.stat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trends */}
        <div className={cn(
          "mb-12 transition-all duration-700",
          showTrends ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="text-center text-sm font-mono mb-6" style={{ color: '#9E9E98' }}>
            CURRENT TRENDS
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {trends.map((trend, index) => (
              <div
                key={trend.title}
                className="flex items-center gap-3 px-4 py-3 rounded-xl ferron-card"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  ...(trend.highlight && { background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }),
                }}
              >
                <trend.icon className="w-4 h-4" style={{ color: trend.highlight ? '#F59E0B' : '#3ECFA5' }} />
                <div>
                  <span className="font-medium text-sm" style={{ color: '#1E2D2D' }}>{trend.title}</span>
                  <p className="text-xs" style={{ color: '#6B6B67' }}>{trend.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Punchline */}
        <div className={cn(
          "text-center max-w-3xl mx-auto transition-all duration-700",
          showTrends ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <blockquote className="text-lg md:text-xl italic mb-6" style={{ color: '#6B6B67' }}>
            "The market is desperate for the 'Buyer Side' to grow — but it won't happen until a CFO can say:{' '}
            <span style={{ color: '#1E2D2D', fontWeight: 500, fontStyle: 'normal' }}>
              'I know for a fact this agent won't drain our wallet.'"
            </span>
          </blockquote>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(62, 207, 165, 0.1)', border: '1px solid rgba(62, 207, 165, 0.3)' }}>
            <span className="font-medium" style={{ color: '#3ECFA5' }}>xBPP is the safety catch that unlocks the Spenders.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
