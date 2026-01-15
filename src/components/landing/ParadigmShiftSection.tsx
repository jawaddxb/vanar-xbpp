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
          // Animate rows one by one
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
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={cn(
            "text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The Paradigm Shift
          </p>
          <h2 className={cn(
            "text-4xl md:text-5xl font-medium tracking-tight transition-all duration-500 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            How xBPP Changes Everything
          </h2>
        </div>

        {/* Comparison Table */}
        <div className={cn(
          "transition-all duration-500 delay-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          {/* Header Row */}
          <div className="grid grid-cols-[120px_1fr_40px_1fr] md:grid-cols-[140px_1fr_60px_1fr] gap-2 md:gap-4 mb-4 px-4">
            <div className="text-sm font-mono text-muted-foreground uppercase" />
            <div className="text-sm font-mono text-block uppercase tracking-wider">Current State</div>
            <div />
            <div className="text-sm font-mono text-allow uppercase tracking-wider">With xBPP</div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {comparisons.map(({ aspect, before, after }, index) => (
              <div
                key={aspect}
                className={cn(
                  "grid grid-cols-[120px_1fr_40px_1fr] md:grid-cols-[140px_1fr_60px_1fr] gap-2 md:gap-4 items-center p-4 rounded-xl border transition-all duration-500",
                  index <= activeRow 
                    ? "border-border/50 bg-card/50 opacity-100 translate-y-0" 
                    : "border-transparent bg-transparent opacity-0 translate-y-4"
                )}
              >
                {/* Aspect Label */}
                <div className="text-sm font-medium text-foreground">{aspect}</div>
                
                {/* Before */}
                <div className={cn(
                  "p-3 rounded-lg bg-block/5 border border-block/20 transition-all duration-300",
                  index <= activeRow ? "opacity-100" : "opacity-0"
                )}>
                  <p className="text-sm text-muted-foreground font-mono">{before}</p>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className={cn(
                    "h-5 w-5 text-primary transition-all duration-500",
                    index <= activeRow ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  )} />
                </div>
                
                {/* After */}
                <div className={cn(
                  "p-3 rounded-lg bg-allow/5 border border-allow/20 transition-all duration-300 delay-200",
                  index <= activeRow ? "opacity-100" : "opacity-0"
                )}>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-allow mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground font-mono">{after}</p>
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
