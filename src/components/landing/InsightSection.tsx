import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function InsightSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShowFinal(true), 1200);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Blue glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={cn(
          "w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl transition-opacity duration-1000",
          isVisible ? "opacity-100" : "opacity-0"
        )} />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main insight */}
        <div className="mb-12">
          <h2 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Behavior isn't intelligence.
          </h2>
          <p 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Behavior is policy.
          </p>
        </div>

        {/* Explanation */}
        <p 
          className={cn(
            "text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12 transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Two agents with identical intelligence can behave radically differently
          based on a single rule change.
        </p>

        {/* Visual split representation */}
        <div 
          className={cn(
            "flex items-center justify-center gap-8 mb-12 transition-all duration-700 delay-700",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-allow/20 border border-allow/40 flex items-center justify-center">
              <span className="text-allow font-mono text-xs">ALLOW</span>
            </div>
            <span className="text-xs text-muted-foreground">Policy A</span>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-allow/40 via-border to-block/40" />
          <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center">
            <span className="text-xs font-mono">≠</span>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-allow/40 via-border to-block/40" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-block/20 border border-block/40 flex items-center justify-center">
              <span className="text-block font-mono text-xs">BLOCK</span>
            </div>
            <span className="text-xs text-muted-foreground">Policy B</span>
          </div>
        </div>

        {/* Call to action insight */}
        <p 
          className={cn(
            "text-lg text-muted-foreground mb-4 transition-all duration-700 delay-900",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          Until you can see that difference, you can't reason about autonomy.
        </p>
        
        {/* Final statement with dramatic pause */}
        <p 
          className={cn(
            "text-2xl md:text-3xl font-medium transition-all duration-1000",
            showFinal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          POLICYLAB exists to make that difference{' '}
          <span className="text-primary">unavoidable</span>.
        </p>
      </div>
    </section>
  );
}
