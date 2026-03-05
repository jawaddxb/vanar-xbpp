import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Shield, CheckCircle, XCircle, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Intent',
    description: 'Agent generates an action request',
    example: '"Pay $50 USDC to 0xABC on Base"',
    icon: MessageSquare,
  },
  {
    number: 2,
    title: 'Interpret',
    description: 'xBPP checks against active Policy',
    example: 'Constraints evaluated in real-time',
    icon: Shield,
  },
];

const verdicts = [
  { type: 'ALLOW', description: 'Proceed with the payment', icon: CheckCircle, color: '#4ADE80' },
  { type: 'BLOCK', description: 'Stop; this violates policy', icon: XCircle, color: '#F87171' },
  { type: 'ESCALATE', description: 'Ask a human to approve', icon: AlertCircle, color: '#FACC15' },
];

const keyConcepts = [
  { concept: 'Action', description: 'A proposed payment to evaluate', example: '"Pay $50 USDC to 0xABC"' },
  { concept: 'Policy', description: 'Rules defining what\'s allowed', example: '"Max $100/tx, $1000/day"' },
  { concept: 'Verdict', description: 'The evaluation result', example: 'ALLOW, BLOCK, or ESCALATE' },
  { concept: 'State', description: 'Running totals and history', example: '"$340 spent today"' },
  { concept: 'Posture', description: 'Default risk tolerance', example: 'AGGRESSIVE, BALANCED, CAUTIOUS' },
];

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [showVerdicts, setShowVerdicts] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          steps.forEach((_, index) => {
            setTimeout(() => setActiveStep(index), 300 + index * 400);
          });
          setTimeout(() => setShowVerdicts(true), 1200);
          setTimeout(() => setShowConcepts(true), 2000);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden"
      style={{ background: '#1A1A1A' }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Pill Badge */}
          <div className={cn(
            "inline-flex items-center mb-8 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="pill-badge">
              HOW IT ALL CONNECTS
            </div>
          </div>

          {/* Headline - Bebas Neue white with teal accent */}
          <h2
            className={cn(
              "mb-6 transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(40px, 8vw, 72px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: 'white',
            }}
          >
            TRUST IS THE <span style={{ color: '#3ECFA5' }}>PRODUCT.</span>
          </h2>

          <p className={cn(
            "text-xl max-w-2xl mx-auto transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: 'rgba(255,255,255,0.6)' }}>
            A standardized middleware layer between <span style={{ color: 'white' }}>Agent</span> and <span style={{ color: 'white' }}>World</span>
          </p>
        </div>

        {/* Flow Diagram */}
        <div className={cn(
          "p-6 md:p-8 rounded-2xl mb-12 transition-all duration-500 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="p-4 rounded-xl flex-1 w-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>YOUR APPLICATION</p>
              <p className="font-medium text-white">Agent wants to pay $50 to 0xABC...</p>
            </div>
            <ArrowRight className="h-6 w-6 shrink-0" style={{ color: '#3ECFA5' }} />
            <div className="p-4 rounded-xl flex-1 w-full" style={{ background: 'rgba(62, 207, 165, 0.1)', border: '1px solid rgba(62, 207, 165, 0.3)' }}>
              <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: '#3ECFA5' }}>XBPP INTERPRETER</p>
              <p className="font-medium text-white">Action + Policy → Verdict</p>
            </div>
            <ArrowRight className="h-6 w-6 shrink-0" style={{ color: '#3ECFA5' }} />
            <div className="p-4 rounded-xl flex-1 w-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>RESULT</p>
              <p className="font-mono font-bold text-white">ALLOW | BLOCK | ESCALATE</p>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= activeStep;

            return (
              <div
                key={step.number}
                className={cn(
                  "p-6 rounded-xl transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-30"
                )}
                style={{
                  background: isActive ? 'rgba(62, 207, 165, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? 'rgba(62, 207, 165, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: isActive ? 'rgba(62, 207, 165, 0.2)' : 'rgba(255,255,255,0.1)',
                      border: `1px solid ${isActive ? 'rgba(62, 207, 165, 0.5)' : 'rgba(255,255,255,0.2)'}`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: isActive ? '#3ECFA5' : 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <div>
                    <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>Step {step.number}</p>
                    <h3 className="text-xl font-medium text-white">{step.title}</h3>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)' }} className="mb-2">{step.description}</p>
                <p className="text-sm font-mono italic" style={{ color: 'rgba(255,255,255,0.8)' }}>{step.example}</p>
              </div>
            );
          })}
        </div>

        {/* Verdict Arrow */}
        <div className={cn(
          "flex justify-center mb-8 transition-all duration-500",
          showVerdicts ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex flex-col items-center">
            <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(62,207,165,0.5), #3ECFA5)' }} />
            <div className="text-xs font-mono py-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Verdict</div>
            <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #3ECFA5, rgba(62,207,165,0.5))' }} />
          </div>
        </div>

        {/* Verdicts */}
        <div className={cn(
          "grid md:grid-cols-3 gap-4 mb-16 transition-all duration-700",
          showVerdicts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {verdicts.map(({ type, description, icon: Icon, color }, index) => (
            <div
              key={type}
              className="p-5 rounded-xl text-center transition-all duration-500"
              style={{
                transitionDelay: `${index * 100}ms`,
                background: `${color}10`,
                border: `1px solid ${color}40`,
              }}
            >
              <Icon className="h-8 w-8 mx-auto mb-3" style={{ color }} />
              <p className="text-lg font-mono font-medium mb-1" style={{ color }}>
                {type}
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{description}</p>
            </div>
          ))}
        </div>

        {/* Key Concepts */}
        <div className={cn(
          "mb-16 transition-all duration-700",
          showConcepts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: '#3ECFA5' }} />
            Key Concepts
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th className="text-left py-3 pr-4 font-mono text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Concept</th>
                  <th className="text-left py-3 pr-4 font-mono text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>What It Is</th>
                  <th className="text-left py-3 font-mono text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Example</th>
                </tr>
              </thead>
              <tbody>
                {keyConcepts.map(({ concept, description, example }) => (
                  <tr key={concept} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-3 pr-4 font-mono" style={{ color: '#3ECFA5' }}>{concept}</td>
                    <td className="py-3 pr-4 text-white">{description}</td>
                    <td className="py-3 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Graduated Autonomy */}
        <div className={cn(
          "transition-all duration-700",
          showConcepts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="p-8 rounded-2xl" style={{ background: 'rgba(62, 207, 165, 0.1)', border: '1px solid rgba(62, 207, 165, 0.3)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(62, 207, 165, 0.2)', border: '1px solid rgba(62, 207, 165, 0.5)' }}>
                <TrendingUp className="h-6 w-6" style={{ color: '#3ECFA5' }} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">Graduated Autonomy</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Trust builds over time — automatically</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                <p className="text-sm font-mono mb-2" style={{ color: '#FACC15' }}>Cautious Posture</p>
                <p className="font-medium text-white">$10 limit, full human oversight</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                <p className="text-sm font-mono mb-2" style={{ color: '#4ADE80' }}>Aggressive Posture</p>
                <p className="font-medium text-white">$10k limit, autonomous execution</p>
              </div>
            </div>

            <p className="text-center mt-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Graduate between postures as trust builds — <span className="text-white">without rewriting a single line of code</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
