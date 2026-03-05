import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FileJson, Globe, Eye, XCircle } from 'lucide-react';

const features = [
  {
    icon: FileJson,
    title: 'Declarative Policies',
    description: 'Define behavior in external policy files, not buried in code.',
  },
  {
    icon: Globe,
    title: 'Open Standard',
    description: 'Interoperable across agents, platforms, and jurisdictions.',
  },
  {
    icon: Eye,
    title: 'Transparent Verdicts',
    description: 'Every decision is deterministic, auditable, and provable.',
  },
];

const whatItDoesNot = [
  { action: 'Execute payments', explanation: "That's x402's job" },
  { action: 'Custody funds', explanation: 'xBPP is policy, not a wallet' },
  { action: 'Guarantee counterparty behavior', explanation: "Can't prevent a vendor from being malicious" },
  { action: 'Replace legal contracts', explanation: 'xBPP is technical enforcement, not legal agreement' },
];

export function WhatIsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#e8e9e9' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - Left aligned */}
        <div className="mb-16">
          <div className={cn(
            "section-label mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            THE SOLUTION
          </div>

          <h2
            className={cn(
              "mb-6 transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 0.95,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#282B35',
            }}
          >
            <span style={{ color: '#03D9AF' }}>XBPP</span>: EXECUTION BOUNDARY
            <br />PERMISSION PROTOCOL
          </h2>

          <p className={cn(
            "text-xl md:text-2xl max-w-2xl transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            The open standard for <span style={{ color: '#282B35', fontWeight: 500 }}>Agentic Governance</span>.
          </p>
        </div>

        {/* Core Question */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-250",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div
            className="inline-block p-6"
            style={{
              background: 'rgba(3, 217, 175, 0.08)',
              border: '1px solid rgba(3, 217, 175, 0.3)',
              clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)',
            }}
          >
            <p className="text-sm font-mono uppercase tracking-wider mb-2" style={{ color: '#03D9AF' }}>The core question</p>
            <p className="text-xl md:text-2xl font-medium" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>
              "Should this agent be allowed to spend this money?"
            </p>
          </div>
        </div>

        {/* Programmable CFO */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="text-lg" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            Think of xBPP as a <span style={{ color: '#03D9AF', fontWeight: 500 }}>programmable CFO</span> for your AI agents.
            <br />
            You set the rules once (budgets, approved vendors, risk tolerance), and xBPP enforces them on every transaction.
          </p>
        </div>

        {/* Features Grid */}
        <div className={cn(
          "grid md:grid-cols-3 gap-6 mb-16 transition-all duration-700 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              style={{
                transitionDelay: `${400 + index * 100}ms`,
                background: 'linear-gradient(75.85deg, #ffffff 14.68%, #e9eff0 184.03%)',
                clipPath: 'polygon(28px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 28px)',
                padding: '28px 32px',
              }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center mb-4"
                style={{ background: 'rgba(3, 217, 175, 0.1)', border: '1px solid rgba(3, 217, 175, 0.3)' }}
              >
                <Icon className="h-7 w-7" style={{ color: '#03D9AF' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{title}</h3>
              <p className="text-sm" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>{description}</p>
            </div>
          ))}
        </div>

        {/* What xBPP Does NOT Do */}
        <div className={cn(
          "mb-16 transition-all duration-700 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h3 className="text-lg font-medium mb-6" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>
            What xBPP Does <span style={{ color: '#F87171' }}>NOT</span> Do
          </h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            {whatItDoesNot.map(({ action, explanation }) => (
              <div
                key={action}
                className="flex items-start gap-3 p-4"
                style={{ background: 'white', border: '1px solid #CAD0DA' }}
              >
                <XCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#F87171' }} />
                <div>
                  <p className="font-medium" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{action}</p>
                  <p className="text-sm" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>{explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POLICYLAB Connection */}
        <div className={cn(
          "transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-block p-8 corner-card">
            <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#03D9AF' }}>Where xBPP comes alive</p>
            <h3 className="text-2xl md:text-3xl font-medium mb-4" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>
              Vanar xBPP is a <span style={{ color: '#03D9AF' }}>theatre of consequences</span>.
            </h3>
            <p className="max-w-xl" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
              Watch identical agents, identical worlds — with one rule changed.
              See exactly where behavior diverges. Understand what policies actually do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
