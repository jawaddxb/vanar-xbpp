import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Shield } from 'lucide-react';

export function InsightSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showMetaphor, setShowMetaphor] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShowMetaphor(true), 1000);
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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden" style={{ background: '#EDEDEA' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(62, 207, 165, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main Insight */}
        <div className="text-center mb-20">
          <div className={cn(
            "section-label justify-center mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            THE INSIGHT
          </div>

          <h2
            className={cn(
              "mb-8 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(36px, 7vw, 64px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#6B6B67' }}>Behavior</span> isn't a bug to fix.
            <br />
            <span style={{ color: '#1E2D2D' }}>It's a policy to </span>
            <span style={{ color: '#3ECFA5' }}>declare.</span>
          </h2>

          <p className={cn(
            "text-xl md:text-2xl max-w-2xl mx-auto transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: '#6B6B67' }}>
            xBPP introduces a <span style={{ color: '#3ECFA5', fontWeight: 500 }}>Programmable Super-Ego</span> — an external layer that governs behavior without touching the agent's code.
          </p>
        </div>

        {/* Engine/Transmission Metaphor */}
        <div className={cn(
          "transition-all duration-700",
          showMetaphor ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="grid md:grid-cols-3 gap-4 items-center max-w-3xl mx-auto">
            {/* x402 - The Engine */}
            <div className="flex flex-col items-center p-6 rounded-xl ferron-card text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(62, 207, 165, 0.1)', border: '1px solid rgba(62, 207, 165, 0.3)' }}
              >
                <Zap className="h-7 w-7" style={{ color: '#3ECFA5' }} />
              </div>
              <p className="text-sm font-mono mb-1" style={{ color: '#3ECFA5' }}>x402</p>
              <p className="text-lg font-medium" style={{ color: '#1E2D2D' }}>The Engine</p>
              <p className="text-sm mt-2" style={{ color: '#6B6B67' }}>
                Lets an agent spend
              </p>
            </div>

            {/* Arrow/Connection */}
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, rgba(62,207,165,0.3), rgba(74,222,128,0.5))' }} />
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#4ADE80' }} />
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, rgba(74,222,128,0.5), #4ADE80)' }} />
              </div>
            </div>

            {/* xBPP - The Transmission */}
            <div className="flex flex-col items-center p-6 rounded-xl text-center" style={{ background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)' }}
              >
                <Shield className="h-7 w-7" style={{ color: '#4ADE80' }} />
              </div>
              <p className="text-sm font-mono mb-1" style={{ color: '#4ADE80' }}>xBPP</p>
              <p className="text-lg font-medium" style={{ color: '#1E2D2D' }}>The Transmission</p>
              <p className="text-sm mt-2" style={{ color: '#6B6B67' }}>
                Ensures it doesn't drive off a cliff
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className={cn(
            "text-center mt-12 transition-all duration-700 delay-300",
            showMetaphor ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-lg" style={{ color: '#6B6B67' }}>
              xBPP separates the <span style={{ color: '#1E2D2D', fontWeight: 500 }}>Business Logic</span> (the policy)
              from the <span style={{ color: '#1E2D2D', fontWeight: 500 }}>Agent Logic</span> (the code).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
