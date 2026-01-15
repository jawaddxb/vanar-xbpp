import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Code, Shield, Building2, Blocks, Brain } from 'lucide-react';

const personas = [
  { icon: Code, title: 'Base Developers', description: 'Building autonomous agents on-chain' },
  { icon: Shield, title: 'Enterprise CTOs', description: 'Governing agent fleets at scale' },
  { icon: Blocks, title: 'Protocol Builders', description: 'Designing the rules of interaction' },
  { icon: Building2, title: 'Security Architects', description: 'Protecting systems from misuse' },
  { icon: Brain, title: 'AI Systems Leads', description: 'Directing intelligent systems' },
];

export function WhoIsForSection() {
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
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">Who This Is For</p>
          <h2 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Built for people who decide
            <br />
            how systems behave.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.title}
                className={cn(
                  "group p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Icon className="h-8 w-8 text-primary mb-4 transition-transform group-hover:scale-110" />
                <h3 className="font-medium mb-2 text-sm">{persona.title}</h3>
                <p className="text-xs text-muted-foreground">{persona.description}</p>
              </div>
            );
          })}
        </div>

        <div className={cn(
          "text-center transition-all duration-700 delay-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xl md:text-2xl text-muted-foreground">
            If you are responsible for outcomes —
          </p>
          <p className="text-xl md:text-2xl font-medium mt-2">
            this is where you test assumptions before reality does.
          </p>
        </div>
      </div>
    </section>
  );
}
