import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plane, Code, TrendingUp, Headphones, ShoppingCart, Cpu, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const useCases = [
  {
    id: 'travel',
    icon: Plane,
    title: 'Travel Assistant',
    risk: 'Over-booking premium flights',
    before: 'Agent books $8,000 business class "because availability was low"',
    after: 'Policy caps single bookings at $800, escalates anything higher',
    color: '#3B82F6',
  },
  {
    id: 'developer',
    icon: Code,
    title: 'GPU Developer Agent',
    risk: 'Runaway cloud bills',
    before: 'Agent spins up $12,000/day in GPU instances for a "quick test"',
    after: 'Burst detection triggers at 10x baseline, requires approval',
    color: '#8B5CF6',
  },
  {
    id: 'trading',
    icon: TrendingUp,
    title: 'DeFi Trading Agent',
    risk: 'Flash loan exploits',
    before: 'Agent approves signing a malicious contract drainer',
    after: 'Address poisoning detection blocks unknown contracts',
    color: '#10B981',
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Customer Service',
    risk: 'Refund fraud',
    before: 'Agent issues $500 refund to social-engineered request',
    after: 'Daily refund cap + verification for amounts over $50',
    color: '#F97316',
  },
  {
    id: 'procurement',
    icon: ShoppingCart,
    title: 'Procurement Agent',
    risk: 'Duplicate orders',
    before: 'Agent reorders $10,000 of supplies due to API retry bug',
    after: 'Duplicate detection within 60-second window blocks replays',
    color: '#EC4899',
  },
  {
    id: 'iot',
    icon: Cpu,
    title: 'IoT Fleet',
    risk: 'Micro-transaction floods',
    before: '10,000 devices each spending $1 = $10,000 surprise bill',
    after: 'Fleet-level daily cap of $10 total, per-device limit of $0.01',
    color: '#06B6D4',
  },
  {
    id: 'orchestrator',
    icon: Users,
    title: 'Agent Orchestrator',
    risk: 'Agent hiring agents',
    before: 'Orchestrator hires 50 sub-agents, each hiring more',
    after: 'Chain depth limit of 2, aggregate budget inheritance',
    color: '#EAB308',
  },
  {
    id: 'research',
    icon: Search,
    title: 'Research Agent',
    risk: 'API cost explosion',
    before: 'Agent calls expensive API 10,000 times in a loop',
    after: 'Rate limiting + cost-per-call tracking blocks runaway usage',
    color: '#EF4444',
  },
];

export function UseCaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % useCases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeCase = useCases[activeIndex];
  const Icon = activeCase.icon;

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#e8e9e9' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header - Left aligned */}
        <div className="mb-12">
          <div className={cn(
            "section-label mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            USE CASES
          </div>
          <h2
            className={cn(
              "mb-4 transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              lineHeight: 0.95,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#282B35',
            }}
          >
            SEE XBPP IN <span style={{ color: '#03D9AF' }}>ACTION</span>
          </h2>
          <p className={cn(
            "text-lg max-w-2xl transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            Real scenarios. Real risks. Real protection.
          </p>
        </div>

        {/* Carousel */}
        <div className={cn(
          "transition-all duration-700 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Icon Selector */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {useCases.map((useCase, index) => {
              const CaseIcon = useCase.icon;
              return (
                <button
                  key={useCase.id}
                  onClick={() => setActiveIndex(index)}
                  className="p-3 transition-all duration-300"
                  style={{
                    background: index === activeIndex ? 'rgba(3, 217, 175, 0.1)' : 'white',
                    border: `1px solid ${index === activeIndex ? 'rgba(3, 217, 175, 0.5)' : '#CAD0DA'}`,
                    transform: index === activeIndex ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <CaseIcon className="h-5 w-5" style={{ color: index === activeIndex ? useCase.color : '#6B6F7D' }} />
                </button>
              );
            })}
          </div>

          {/* Active Case Display */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {/* Before Card */}
            <div
              className="p-6 relative overflow-hidden"
              style={{
                background: 'rgba(248, 113, 113, 0.08)',
                clipPath: 'polygon(24px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 24px)',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, #F87171, rgba(248, 113, 113, 0.5))' }} />
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-1 text-xs font-mono uppercase" style={{ background: 'rgba(248, 113, 113, 0.15)', color: '#F87171' }}>
                  Without xBPP
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-6 w-6" style={{ color: activeCase.color }} />
                <h3 className="font-medium text-lg" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{activeCase.title}</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
                <span className="font-medium" style={{ color: '#F87171' }}>Risk:</span> {activeCase.risk}
              </p>
              <p style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{activeCase.before}</p>
            </div>

            {/* After Card */}
            <div
              className="p-6 relative overflow-hidden"
              style={{
                background: 'rgba(74, 222, 128, 0.08)',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 24px 100%, 0% calc(100% - 24px))',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, #4ADE80, rgba(74, 222, 128, 0.5))' }} />
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-1 text-xs font-mono uppercase" style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80' }}>
                  With xBPP
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-6 w-6" style={{ color: activeCase.color }} />
                <h3 className="font-medium text-lg" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{activeCase.title}</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
                <span className="font-medium" style={{ color: '#4ADE80' }}>Protection:</span> Policy-enforced limits
              </p>
              <p style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{activeCase.after}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + useCases.length) % useCases.length)}
              className="p-2 transition-colors"
              style={{ background: 'white', border: '1px solid #CAD0DA', color: '#6B6F7D' }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {useCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className="h-2 transition-all duration-300"
                  style={{
                    width: index === activeIndex ? '24px' : '8px',
                    background: index === activeIndex ? '#03D9AF' : '#CAD0DA',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % useCases.length)}
              className="p-2 transition-colors"
              style={{ background: 'white', border: '1px solid #CAD0DA', color: '#6B6F7D' }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              to="/learn/by-example"
              className="btn-ghost inline-flex items-center gap-2 group"
            >
              Explore all use cases
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
