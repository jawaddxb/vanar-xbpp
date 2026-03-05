import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle2, XCircle, ArrowRight, Bot, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockPhases = [
  { name: 'Validation', status: 'pass' },
  { name: 'Emergency', status: 'pass' },
  { name: 'Input', status: 'pass' },
  { name: 'Limits', status: 'pass' },
  { name: 'Duplicate', status: 'pass' },
  { name: 'Verify', status: 'fail' },
  { name: 'Profile', status: 'skip' },
  { name: 'Escalate', status: 'skip' },
  { name: 'Final', status: 'block' },
];

export function PlaygroundPreview() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedPhase, setAnimatedPhase] = useState(-1);
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

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedPhase(prev => {
            if (prev >= mockPhases.length - 1) {
              clearInterval(interval);
              return prev;
            }
            return prev + 1;
          });
        }, 200);
        return () => clearInterval(interval);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const getStatusIcon = (status: string, index: number) => {
    if (index > animatedPhase) {
      return <div className="w-3 h-3 rounded-full" style={{ border: '1px solid #E2E2DE' }} />;
    }
    if (status === 'pass') return <CheckCircle2 className="w-3 h-3" style={{ color: '#4ADE80' }} />;
    if (status === 'fail' || status === 'block') return <XCircle className="w-3 h-3" style={{ color: '#F87171' }} />;
    if (status === 'skip') return <div className="w-3 h-3 rounded-full" style={{ background: '#E2E2DE' }} />;
    return null;
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden" style={{ background: '#EDEDEA' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(62, 207, 165, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={cn(
            "section-label justify-center mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            INTERACTIVE DEMO
          </div>
          <h2
            className={cn(
              "mb-4 transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(36px, 7vw, 60px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#1E2D2D',
            }}
          >
            TRY THE <span style={{ color: '#3ECFA5' }}>PLAYGROUND</span>
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: '#6B6B67' }}>
            Configure an agent. Inject transactions. Watch the 9-phase evaluation.
          </p>
        </div>

        {/* Preview Card */}
        <div className={cn(
          "max-w-4xl mx-auto transition-all duration-700 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2E2DE' }}>
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: '#F5F5F3', borderBottom: '1px solid #E2E2DE' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#F87171' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#FACC15' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#4ADE80' }} />
                </div>
                <span className="text-sm font-mono" style={{ color: '#6B6B67' }}>xBPP Playground</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6B67' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ADE80' }} />
                Live
              </div>
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-3 gap-0" style={{ borderTop: 'none' }}>
              {/* Agent Panel */}
              <div className="p-6" style={{ borderRight: '1px solid #E2E2DE' }}>
                <div className="flex items-center gap-2 mb-4 text-sm font-medium" style={{ color: '#6B6B67' }}>
                  <Bot className="h-4 w-4" style={{ color: '#3ECFA5' }} />
                  Agent Config
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ background: '#F5F5F3', border: '1px solid #E2E2DE' }}>
                    <p className="text-xs mb-1" style={{ color: '#9E9E98' }}>Template</p>
                    <p className="text-sm font-medium" style={{ color: '#1E2D2D' }}>Trading Agent</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: '#F5F5F3', border: '1px solid #E2E2DE' }}>
                    <p className="text-xs mb-1" style={{ color: '#9E9E98' }}>Max Single</p>
                    <p className="text-sm font-mono font-medium" style={{ color: '#1E2D2D' }}>$5,000</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: '#F5F5F3', border: '1px solid #E2E2DE' }}>
                    <p className="text-xs mb-1" style={{ color: '#9E9E98' }}>Posture</p>
                    <p className="text-sm font-medium" style={{ color: '#FACC15' }}>CAUTIOUS</p>
                  </div>
                </div>
              </div>

              {/* Transaction Panel */}
              <div className="p-6" style={{ borderRight: '1px solid #E2E2DE' }}>
                <div className="flex items-center gap-2 mb-4 text-sm font-medium" style={{ color: '#6B6B67' }}>
                  <Zap className="h-4 w-4" style={{ color: '#3ECFA5' }} />
                  Transaction
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(62, 207, 165, 0.08)', border: '1px solid rgba(62, 207, 165, 0.3)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-2xl font-bold" style={{ color: '#1E2D2D' }}>$7,500</span>
                    <span className="px-2 py-1 text-xs rounded" style={{ background: 'rgba(250, 204, 21, 0.2)', color: '#F59E0B' }}>New</span>
                  </div>
                  <p className="text-sm font-mono mb-1" style={{ color: '#6B6B67' }}>
                    0xDEF...456
                  </p>
                  <p className="text-xs" style={{ color: '#9E9E98' }}>
                    Confidence: 78%
                  </p>
                </div>
              </div>

              {/* Evaluation Panel */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-sm font-medium" style={{ color: '#6B6B67' }}>
                  <Play className="h-4 w-4" style={{ color: '#3ECFA5' }} />
                  9-Phase Check
                </div>
                <div className="space-y-2">
                  {mockPhases.map((phase, index) => (
                    <div
                      key={phase.name}
                      className={cn(
                        "flex items-center gap-2 text-sm transition-all duration-200",
                        index <= animatedPhase ? "opacity-100" : "opacity-40"
                      )}
                    >
                      {getStatusIcon(phase.status, index)}
                      <span className="text-xs" style={{ color: index <= animatedPhase ? '#1E2D2D' : '#9E9E98' }}>
                        {phase.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Verdict */}
                {animatedPhase >= mockPhases.length - 1 && (
                  <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(248, 113, 113, 0.08)', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                    <p className="text-xs mb-1" style={{ color: '#9E9E98' }}>Verdict</p>
                    <p className="font-mono font-bold" style={{ color: '#F87171' }}>BLOCK</p>
                    <p className="text-xs mt-1" style={{ color: '#9E9E98' }}>NEW_COUNTERPARTY, EXCEEDS_LIMIT</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              to="/playground"
              className="btn-teal inline-flex items-center gap-2 group"
            >
              Open Full Playground
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
