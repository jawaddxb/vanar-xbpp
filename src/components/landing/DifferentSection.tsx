import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const features = [
  { left: 'Formal, deterministic interpretation', right: 'Human-readable scenarios' },
  { left: 'Clear divergence moments', right: 'No hype, no optimization theatre' },
];

export function DifferentSection() {
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
    <section ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">What Makes It Different</p>
          <h2 
            className={cn(
              "text-4xl md:text-5xl font-medium tracking-tight transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-muted-foreground">Cold logic.</span>
            {' '}
            <span className="text-primary">Warm presentation.</span>
          </h2>
        </div>

        {/* Two columns */}
        <div 
          className={cn(
            "grid md:grid-cols-2 gap-8 mb-16 transition-all duration-700 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Left column */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 py-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">{feature.left}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 py-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">{feature.right}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div 
          className={cn(
            "text-center transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-lg text-muted-foreground">The system stays serious.</p>
          <p className="text-xl font-medium mt-2">The consequences stay human.</p>
        </div>
      </div>
    </section>
  );
}
