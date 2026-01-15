import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
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
      <div className={cn(
        "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <p className={cn(
          "text-2xl md:text-3xl text-muted-foreground mb-4 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          The behavior is the standard.
        </p>
        <h2 className={cn(
          "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-primary mb-12 transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Trust is the product.
        </h2>

        <div className={cn(
          "transition-all duration-700 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Button asChild size="lg" className="group text-xl px-10 py-7 relative overflow-hidden">
            <Link to="/scenarios">
              <span className="relative z-10 flex items-center">
                Run a simulation
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-lg ring-2 ring-primary/50 ring-offset-2 ring-offset-background opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
