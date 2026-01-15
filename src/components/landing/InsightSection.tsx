import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Shield } from 'lucide-react';

export function InsightSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showMetaphor, setShowMetaphor] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShowMetaphor(true), 1000);
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
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main Insight */}
        <div className="text-center mb-20">
          <p className={cn(
            "text-sm font-mono tracking-widest text-primary uppercase mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The Insight
          </p>
          
          <h2 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <span className="text-muted-foreground">Behavior</span> isn't a bug to fix.
            <br />
            <span className="text-foreground">It's a policy to declare.</span>
          </h2>
          
          <p className={cn(
            "text-xl md:text-2xl text-muted-foreground mt-8 max-w-2xl mx-auto transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            xBPP introduces a <span className="text-foreground font-medium">Programmable Super-Ego</span> — an external layer that governs behavior without touching the agent's code.
          </p>
        </div>

        {/* Engine/Transmission Metaphor */}
        <div className={cn(
          "transition-all duration-700",
          showMetaphor ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="grid md:grid-cols-3 gap-4 items-center max-w-3xl mx-auto">
            {/* x402 - The Engine */}
            <div className="flex flex-col items-center p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm font-mono text-primary mb-1">x402</p>
              <p className="text-lg font-medium text-foreground">The Engine</p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Lets an agent spend
              </p>
            </div>

            {/* Arrow/Connection */}
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-px bg-gradient-to-r from-primary/50 to-allow/50" />
                <div className="w-3 h-3 rounded-full bg-allow/50 animate-pulse" />
                <div className="w-12 h-px bg-gradient-to-r from-allow/50 to-allow" />
              </div>
            </div>

            {/* xBPP - The Transmission */}
            <div className="flex flex-col items-center p-6 rounded-xl border border-allow/30 bg-allow/5 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-full bg-allow/10 border border-allow/30 flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-allow" />
              </div>
              <p className="text-sm font-mono text-allow mb-1">xBPP</p>
              <p className="text-lg font-medium text-foreground">The Transmission</p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Ensures it doesn't drive off a cliff
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className={cn(
            "text-center mt-12 transition-all duration-700 delay-300",
            showMetaphor ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-lg text-muted-foreground">
              xBPP separates the <span className="text-foreground font-medium">Business Logic</span> (the policy) 
              from the <span className="text-foreground font-medium">Agent Logic</span> (the code).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
