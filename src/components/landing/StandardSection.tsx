import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  'Declarative policies',
  'Deterministic interpretation',
  'Explicit reason codes',
  'Auditable outcomes',
];

export function StandardSection() {
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
      {/* Document aesthetic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">The Standard</p>
          <h2 
            className={cn(
              "text-3xl md:text-4xl font-medium tracking-tight transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Built on an open behavioral standard.
          </h2>
        </div>

        {/* Features in code style */}
        <div 
          className={cn(
            "max-w-md mx-auto mb-12 transition-all duration-700 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="rounded-lg border border-border bg-card/50 p-6 font-mono text-sm">
            <div className="text-muted-foreground mb-3">// Policy features</div>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 py-1">
                <span className="text-primary">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kicker and CTA */}
        <div 
          className={cn(
            "text-center transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-lg text-muted-foreground mb-2">The rules are boring.</p>
          <p className="text-xl font-medium mb-8">The results are not.</p>
          
          <Button asChild variant="outline" className="group">
            <Link to="/spec">
              <FileText className="mr-2 h-4 w-4" />
              View the standard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
