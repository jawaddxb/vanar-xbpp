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
    <section ref={sectionRef} className="py-20 md:py-24 px-6 lg:px-12 relative" style={{ background: '#EDEDEA' }}>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-6">WHAT MAKES IT DIFFERENT</div>
          <h2
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(36px, 7vw, 60px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#6B6B67' }}>Cold logic.</span>
            {' '}
            <span style={{ color: '#3ECFA5' }}>Warm presentation.</span>
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
              <div key={index} className="flex items-center gap-3 py-3 px-4 rounded-lg ferron-card">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(62, 207, 165, 0.1)' }}>
                  <Check className="h-4 w-4" style={{ color: '#3ECFA5' }} />
                </div>
                <span style={{ color: '#1E2D2D' }}>{feature.left}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 py-3 px-4 rounded-lg ferron-card">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(62, 207, 165, 0.1)' }}>
                  <Check className="h-4 w-4" style={{ color: '#3ECFA5' }} />
                </div>
                <span style={{ color: '#1E2D2D' }}>{feature.right}</span>
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
          <p className="text-lg" style={{ color: '#6B6B67' }}>The system stays serious.</p>
          <p className="text-xl font-medium mt-2" style={{ color: '#1E2D2D' }}>The consequences stay human.</p>
        </div>
      </div>
    </section>
  );
}
