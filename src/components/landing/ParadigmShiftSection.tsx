import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';

const comparisons = [
  {
    aspect: 'Control',
    before: 'Hard-coded if (amount > 100) inside the bot',
    after: 'External Policy file: max_single: 100',
  },
  {
    aspect: 'Update',
    before: 'Redeploy the entire agent to change a limit',
    after: 'Update the Policy; agent obeys instantly',
  },
  {
    aspect: 'Audit',
    before: '"Check the logs and hope"',
    after: 'Cryptographic Verdict attached to every transaction',
  },
  {
    aspect: 'Liability',
    before: 'Developer is blamed for bugs',
    after: 'Protocol enforces the Policy, capping loss',
  },
];

export function ParadigmShiftSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeRow, setActiveRow] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          comparisons.forEach((_, index) => {
            setTimeout(() => {
              setActiveRow(index);
            }, 300 + index * 250);
          });
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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#EDEDEA' }}>
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={cn(
            "section-label justify-center mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            THE PARADIGM SHIFT
          </div>
          <h2
            className={cn(
              "transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
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
            HOW XBPP CHANGES <span style={{ color: '#3ECFA5' }}>EVERYTHING</span>
          </h2>
        </div>

        {/* Comparison Table */}
        <div className={cn(
          "transition-all duration-500 delay-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          {/* Header Row */}
          <div className="grid grid-cols-[120px_1fr_40px_1fr] md:grid-cols-[140px_1fr_60px_1fr] gap-2 md:gap-4 mb-4 px-4">
            <div className="text-sm font-mono uppercase" style={{ color: '#9E9E98' }} />
            <div className="text-sm font-mono uppercase tracking-wider" style={{ color: '#F87171' }}>Current State</div>
            <div />
            <div className="text-sm font-mono uppercase tracking-wider" style={{ color: '#4ADE80' }}>With xBPP</div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {comparisons.map(({ aspect, before, after }, index) => (
              <div
                key={aspect}
                className={cn(
                  "grid grid-cols-[120px_1fr_40px_1fr] md:grid-cols-[140px_1fr_60px_1fr] gap-2 md:gap-4 items-center p-4 rounded-xl transition-all duration-500",
                  index <= activeRow
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ background: 'white', border: '1px solid #E2E2DE' }}
              >
                {/* Aspect Label */}
                <div className="text-sm font-medium" style={{ color: '#1E2D2D' }}>{aspect}</div>

                {/* Before */}
                <div
                  className={cn(
                    "p-3 rounded-lg transition-all duration-300",
                    index <= activeRow ? "opacity-100" : "opacity-0"
                  )}
                  style={{ background: 'rgba(248, 113, 113, 0.08)', border: '1px solid rgba(248, 113, 113, 0.2)' }}
                >
                  <p className="text-sm font-mono" style={{ color: '#6B6B67' }}>{before}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight
                    className={cn(
                      "h-5 w-5 transition-all duration-500",
                      index <= activeRow ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    )}
                    style={{ color: '#3ECFA5' }}
                  />
                </div>

                {/* After */}
                <div
                  className={cn(
                    "p-3 rounded-lg transition-all duration-300 delay-200",
                    index <= activeRow ? "opacity-100" : "opacity-0"
                  )}
                  style={{ background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.2)' }}
                >
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#4ADE80' }} />
                    <p className="text-sm font-mono" style={{ color: '#1E2D2D' }}>{after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
