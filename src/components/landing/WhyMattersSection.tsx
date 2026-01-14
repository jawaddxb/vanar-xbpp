import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

const consequences = [
  'teams can\'t compare systems',
  'audits are meaningless',
  'security becomes reactive',
  '"safe" is a vibe, not a definition',
];

export function WhyMattersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleConsequences, setVisibleConsequences] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          consequences.forEach((_, index) => {
            setTimeout(() => {
              setVisibleConsequences(prev => [...prev, index]);
            }, 600 + index * 200);
          });
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
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">Why This Matters</p>
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            You cannot scale autonomy
            <br />
            without a shared behavioral language.
          </h2>
        </div>

        {/* Consequences */}
        <div 
          className={cn(
            "mb-16 transition-all duration-700 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-center text-muted-foreground mb-8 text-lg">Without it:</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {consequences.map((consequence, index) => (
              <div
                key={consequence}
                className={cn(
                  "flex items-center gap-3 px-5 py-4 rounded-lg border transition-all duration-500",
                  visibleConsequences.includes(index) 
                    ? "opacity-100 translate-y-0 border-escalate/30 bg-escalate/5" 
                    : "opacity-0 translate-y-4 border-border"
                )}
              >
                <AlertTriangle className="h-4 w-4 text-escalate shrink-0" />
                <span className="text-muted-foreground">{consequence}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div 
          className={cn(
            "text-center transition-all duration-700 delay-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-2xl md:text-3xl font-medium">
            POLICYLAB is where that language becomes{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary underline decoration-primary/30 underline-offset-4">legible</span>
            </span>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
