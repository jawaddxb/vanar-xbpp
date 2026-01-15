import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Globe } from 'lucide-react';

export function WhyNowSection() {
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
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm font-mono tracking-widest text-primary uppercase mb-4">The Vision</p>
          <h2 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            In the near future, no autonomous agent
            <br />
            will execute without a <span className="text-primary">signed Verdict</span>.
          </h2>
        </div>

        <div className={cn(
          "flex justify-center gap-8 mb-12 transition-all duration-700 delay-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-border/50 bg-card/30">
            <Lock className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">SSL</p>
              <p className="font-medium">Standard for moving data</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-primary/30 bg-primary/5">
            <Globe className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-primary">xBPP</p>
              <p className="font-medium">Standard for moving value</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xl text-muted-foreground mb-4">
            xBPP transforms the "Wild West" of on-chain agents into a
          </p>
          <p className="text-2xl md:text-3xl font-medium">
            reliable, <span className="text-allow">insurable</span>, and <span className="text-primary">scalable</span> economy.
          </p>
        </div>
      </div>
    </section>
  );
}
