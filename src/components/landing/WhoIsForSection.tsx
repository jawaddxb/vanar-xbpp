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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#EDEDEA' }}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-6">WHO THIS IS FOR</div>
          <h2
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(32px, 6vw, 52px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#1E2D2D',
            }}
          >
            BUILT FOR PEOPLE WHO DECIDE
            <br />
            HOW SYSTEMS <span style={{ color: '#3ECFA5' }}>BEHAVE.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.title}
                className={cn(
                  "group p-6 rounded-xl ferron-card hover:shadow-md transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Icon className="h-8 w-8 mb-4 transition-transform group-hover:scale-110" style={{ color: '#3ECFA5' }} />
                <h3 className="font-medium mb-2 text-sm" style={{ color: '#1E2D2D' }}>{persona.title}</h3>
                <p className="text-xs" style={{ color: '#6B6B67' }}>{persona.description}</p>
              </div>
            );
          })}
        </div>

        <div className={cn(
          "text-center transition-all duration-700 delay-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xl md:text-2xl" style={{ color: '#6B6B67' }}>
            If you are responsible for outcomes —
          </p>
          <p className="text-xl md:text-2xl font-medium mt-2" style={{ color: '#1E2D2D' }}>
            this is where you test assumptions before reality does.
          </p>
        </div>
      </div>
    </section>
  );
}
