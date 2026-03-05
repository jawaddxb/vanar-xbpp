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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#EDEDEA' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={cn(
            "section-label justify-center mb-6 transition-all duration-500",
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
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(40px, 8vw, 72px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#1E2D2D',
            }}
          >
            <span style={{ color: '#3ECFA5' }}>XBPP</span>: EXECUTION BOUNDARY
            <br />PERMISSION PROTOCOL
          </h2>

          <p className={cn(
            "text-xl md:text-2xl max-w-2xl mx-auto transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: '#6B6B67' }}>
            The open standard for <span style={{ color: '#1E2D2D', fontWeight: 500 }}>Agentic Governance</span>.
          </p>
        </div>

        {/* Core Question */}
        <div className={cn(
          "text-center mb-12 transition-all duration-500 delay-250",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-block p-6 rounded-xl" style={{ background: 'rgba(62, 207, 165, 0.08)', border: '1px solid rgba(62, 207, 165, 0.3)' }}>
            <p className="text-sm font-mono uppercase tracking-wider mb-2" style={{ color: '#3ECFA5' }}>The core question</p>
            <p className="text-xl md:text-2xl font-medium" style={{ color: '#1E2D2D' }}>
              "Should this agent be allowed to spend this money?"
            </p>
          </div>
        </div>

        {/* Programmable CFO */}
        <div className={cn(
          "text-center mb-12 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="text-lg" style={{ color: '#6B6B67' }}>
            Think of xBPP as a <span style={{ color: '#3ECFA5', fontWeight: 500 }}>programmable CFO</span> for your AI agents.
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
              className="ferron-card text-center"
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(62, 207, 165, 0.1)', border: '1px solid rgba(62, 207, 165, 0.3)' }}
              >
                <Icon className="h-7 w-7" style={{ color: '#3ECFA5' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#1E2D2D' }}>{title}</h3>
              <p className="text-sm" style={{ color: '#6B6B67' }}>{description}</p>
            </div>
          ))}
        </div>

        {/* What xBPP Does NOT Do */}
        <div className={cn(
          "mb-16 transition-all duration-700 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h3 className="text-lg font-medium text-center mb-6" style={{ color: '#1E2D2D' }}>
            What xBPP Does <span style={{ color: '#F87171' }}>NOT</span> Do
          </h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {whatItDoesNot.map(({ action, explanation }) => (
              <div
                key={action}
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{ background: 'white', border: '1px solid #E2E2DE' }}
              >
                <XCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#F87171' }} />
                <div>
                  <p className="font-medium" style={{ color: '#1E2D2D' }}>{action}</p>
                  <p className="text-sm" style={{ color: '#6B6B67' }}>{explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POLICYLAB Connection */}
        <div className={cn(
          "text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-block p-8 rounded-2xl corner-card">
            <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#3ECFA5' }}>Where xBPP comes alive</p>
            <h3 className="text-2xl md:text-3xl font-medium mb-4" style={{ color: '#1E2D2D' }}>
              Vanar xBPP is a <span style={{ color: '#3ECFA5' }}>theatre of consequences</span>.
            </h3>
            <p className="max-w-xl mx-auto" style={{ color: '#6B6B67' }}>
              Watch identical agents, identical worlds — with one rule changed.
              See exactly where behavior diverges. Understand what policies actually do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
