import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function TheMomentSection() {
  const [phase, setPhase] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Dramatic reveal sequence
          setTimeout(() => setPhase(1), 300);
          setTimeout(() => setPhase(2), 1500);
          setTimeout(() => setPhase(3), 2500);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-6 py-24 relative transition-colors duration-1000",
        phase >= 1 ? "bg-background" : "bg-card/50"
      )}
    >
      {/* Dim overlay */}
      <div className={cn(
        "absolute inset-0 bg-background/60 transition-opacity duration-1000 pointer-events-none",
        phase >= 1 ? "opacity-100" : "opacity-0"
      )} />

      {/* Particle burst effect */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500",
        phase >= 2 ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl animate-pulse-subtle" />
      </div>
      
      {/* Left panel hint */}
      <div className={cn(
        "absolute left-8 top-1/2 -translate-y-1/2 w-32 h-64 rounded-lg border border-allow/30 bg-allow/5 transition-all duration-700",
        phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}>
        <div className="absolute top-4 left-4 right-4 h-2 rounded-full bg-allow/30" />
        <div className="absolute bottom-4 left-4 text-xs font-mono text-allow/60">ALLOW</div>
      </div>
      
      {/* Right panel hint */}
      <div className={cn(
        "absolute right-8 top-1/2 -translate-y-1/2 w-32 h-64 rounded-lg border border-block/30 bg-block/5 transition-all duration-700 delay-100",
        phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )}>
        <div className="absolute top-4 left-4 right-4 h-2 rounded-full bg-block/30" />
        <div className="absolute bottom-4 right-4 text-xs font-mono text-block/60">BLOCK</div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main line */}
        <h2 
          className={cn(
            "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight transition-all duration-1000",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Nothing changed —
          <br />
          <span className="text-primary">except the rule.</span>
        </h2>
        
        {/* Follow-up */}
        <p 
          className={cn(
            "text-2xl md:text-3xl text-muted-foreground mt-8 transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          That's when it clicks.
        </p>
      </div>

      {/* Decorative elements */}
      <div className={cn(
        "absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 transition-opacity duration-500",
        phase >= 3 ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-border" />
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-border" />
      </div>
    </section>
  );
}
