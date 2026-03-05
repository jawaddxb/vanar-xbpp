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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#e8e9e9' }}>
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header - Left aligned */}
        <div className="mb-16">
          <div className="section-label mb-6">WHO THIS IS FOR</div>
          <h2
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
              fontSize: 'clamp(28px, 4vw, 48px)',
              lineHeight: 0.95,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#282B35',
            }}
          >
            BUILT FOR PEOPLE WHO DECIDE
            <br />
            HOW SYSTEMS <span style={{ color: '#03D9AF' }}>BEHAVE.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.title}
                className={cn(
                  "group p-6 transition-all duration-500"
                )}
                style={{
                  transitionDelay: `${300 + index * 100}ms`,
                  background: 'linear-gradient(75.85deg, #ffffff 14.68%, #e9eff0 184.03%)',
                  clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                }}
              >
                <Icon className="h-8 w-8 mb-4 transition-transform group-hover:scale-110" style={{ color: '#03D9AF' }} />
                <h3 className="font-medium mb-2 text-sm" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{persona.title}</h3>
                <p className="text-xs" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>{persona.description}</p>
              </div>
            );
          })}
        </div>

        <div className={cn(
          "transition-all duration-700 delay-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xl md:text-2xl" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            If you are responsible for outcomes —
          </p>
          <p className="text-xl md:text-2xl font-medium mt-2" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>
            this is where you test assumptions before reality does.
          </p>
        </div>
      </div>
    </section>
  );
}
