import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Wallet, PenTool, Shield } from 'lucide-react';

const actions = [
  { icon: Wallet, label: 'They spend money.' },
  { icon: PenTool, label: 'They sign things.' },
  { icon: Shield, label: 'They respond to threats.' },
];

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
    <section ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">Why Now</p>
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Autonomous systems are no longer theoretical.
          </h2>
        </div>

        {/* Actions */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-6 mb-12 transition-all duration-700 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {actions.map(({ icon: Icon, label }, index) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-3 rounded-lg border border-border/50 bg-card/30"
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Pivot */}
        <div 
          className={cn(
            "text-center space-y-4 transition-all duration-700 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-xl text-muted-foreground">
            The question isn't <span className="text-foreground">if</span> they act —
          </p>
          <p className="text-2xl md:text-3xl font-medium">
            it's <span className="text-primary">under what constraints</span>.
          </p>
          <p className="text-xl text-foreground pt-4">
            POLICYLAB exists because that question finally matters.
          </p>
        </div>
      </div>
    </section>
  );
}
