import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function TheMomentSection() {
  const [phase, setPhase] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setPhase(1), 300);
          setTimeout(() => setPhase(2), 1500);
          setTimeout(() => setPhase(3), 2500);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-6 lg:px-12 relative"
      style={{ background: '#EDEDEA' }}
    >
      {/* Particle burst effect */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500",
        phase >= 2 ? "opacity-100" : "opacity-0"
      )}>
        <div
          className="w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(62, 207, 165, 0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      {/* Left panel hint */}
      <div className={cn(
        "absolute left-8 top-1/2 -translate-y-1/2 w-32 h-64 rounded-lg hidden lg:block transition-all duration-700",
        phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )} style={{ background: 'rgba(74, 222, 128, 0.05)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
        <div className="absolute top-4 left-4 right-4 h-2 rounded-full" style={{ background: 'rgba(74, 222, 128, 0.3)' }} />
        <div className="absolute bottom-4 left-4 text-xs font-mono" style={{ color: 'rgba(74, 222, 128, 0.6)' }}>ALLOW</div>
      </div>

      {/* Right panel hint */}
      <div className={cn(
        "absolute right-8 top-1/2 -translate-y-1/2 w-32 h-64 rounded-lg hidden lg:block transition-all duration-700 delay-100",
        phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )} style={{ background: 'rgba(248, 113, 113, 0.05)', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
        <div className="absolute top-4 left-4 right-4 h-2 rounded-full" style={{ background: 'rgba(248, 113, 113, 0.3)' }} />
        <div className="absolute bottom-4 right-4 text-xs font-mono" style={{ color: 'rgba(248, 113, 113, 0.6)' }}>BLOCK</div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main line */}
        <h2
          className={cn(
            "transition-all duration-1000",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 'clamp(40px, 8vw, 80px)',
            lineHeight: 0.95,
            fontStyle: 'italic',
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            color: '#1E2D2D',
          }}
        >
          Nothing changed —
          <br />
          <span style={{ color: '#3ECFA5' }}>except the rule.</span>
        </h2>

        {/* Follow-up */}
        <p
          className={cn(
            "text-2xl md:text-3xl mt-8 transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ color: '#6B6B67' }}
        >
          That's when it clicks.
        </p>
      </div>

      {/* Decorative elements */}
      <div className={cn(
        "absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 transition-opacity duration-500",
        phase >= 3 ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, #E2E2DE)' }} />
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3ECFA5' }} />
        <div className="w-16 h-px" style={{ background: 'linear-gradient(to left, transparent, #E2E2DE)' }} />
      </div>
    </section>
  );
}
