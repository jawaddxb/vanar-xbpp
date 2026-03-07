import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden" style={{ background: '#e8e9e9' }}>
      {/* Ambient glow */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        <div
          className="w-[600px] h-[600px]"
          style={{ background: 'radial-gradient(circle, rgba(3, 217, 175, 0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <p className={cn(
          "text-2xl md:text-3xl mb-4 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
          The behavior is the standard.
        </p>

        <h2
          className={cn(
            "mb-12 transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{
            fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
            fontSize: 'clamp(36px, 6vw, 72px)',
            lineHeight: 0.92,
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            color: '#03D9AF',
          }}
        >
          BUILD AGENTS WORTH TRUSTING.
        </h2>

        <div className={cn(
          "transition-all duration-700 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Link
            to="/scenarios"
            className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-5"
          >
            Run a simulation
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
