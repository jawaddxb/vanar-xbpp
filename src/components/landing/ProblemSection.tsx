import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Code2, AlertTriangle, Laptop, CreditCard, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlMethods = [
  {
    icon: MessageSquare,
    label: 'Prompt Engineering',
    example: '"Please don\'t spend more than $100"',
    problems: ['Fragile', 'Non-deterministic', 'Injection attacks'],
  },
  {
    icon: Code2,
    label: 'Hard-Coded Logic',
    example: 'if (amount > 100) { reject(); }',
    problems: ['Unscalable', 'Rigid silos', 'Breaks across jurisdictions'],
  },
];

const dangers = [
  { icon: CreditCard, text: 'An agent with access to a credit card could drain it in seconds' },
  { icon: ShieldAlert, text: 'A compromised agent could send funds to attackers' },
  { icon: Zap, text: 'Even well-intentioned agents make mistakes' },
];

const traditionalProblems = [
  { label: 'Manual approval', problem: 'destroys the value of automation' },
  { label: 'Fixed limits', problem: 'are too blunt ($100 blocks both legitimate and fraud)' },
  { label: 'No limits', problem: '= unacceptable risk' },
];

export function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShowResult(true), 1200);
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
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - Left aligned */}
        <div className="mb-16">
          <div className={cn(
            "section-label mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: '#F87171' }}>
            <span style={{ color: '#F87171' }}>THE PROBLEM</span>
          </div>

          <h2
            className={cn(
              "mb-6 transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 0.95,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#282B35',
            }}
          >
            THE AGENTIC <span style={{ color: '#F87171' }}>GAP</span>
          </h2>

          <p className={cn(
            "text-xl md:text-2xl max-w-3xl transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            We solved <span style={{ color: '#282B35', fontWeight: 500 }}>Capability</span> — the ability to act.
            <br />
            We haven't solved <span style={{ color: '#F87171', fontWeight: 500 }}>Liability</span> — the safety of the action.
          </p>
        </div>

        {/* Dangers */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-250",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="mb-6 text-lg" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            Capability without constraint is <span style={{ color: '#F87171', fontWeight: 500 }}>dangerous</span>:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {dangers.map(({ icon: Icon, text }, index) => (
              <div
                key={text}
                className={cn(
                  "p-5 flex items-start gap-3 transition-all duration-500 vanar-card"
                )}
                style={{
                  transitionDelay: `${300 + index * 100}ms`,
                  background: 'rgba(248, 113, 113, 0.08)',
                  clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)',
                }}
              >
                <Icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#F87171' }} />
                <p className="text-sm" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Control Methods */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="mb-6 text-lg" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            Currently, there are only <span style={{ color: '#282B35', fontWeight: 500 }}>two ways</span> to control an agent:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {controlMethods.map(({ icon: Icon, label, example, problems }, index) => (
              <div
                key={label}
                className={cn(
                  "transition-all duration-500"
                )}
                style={{
                  transitionDelay: `${400 + index * 150}ms`,
                  background: 'linear-gradient(75.85deg, #ffffff 14.68%, #e9eff0 184.03%)',
                  clipPath: 'polygon(32px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 32px)',
                  padding: '28px 32px',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(40, 43, 53, 0.05)' }}>
                    <Icon className="h-5 w-5" style={{ color: '#6B6F7D' }} />
                  </div>
                  <h3 className="text-lg font-medium" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>{label}</h3>
                </div>
                <div className="mb-4 p-3" style={{ background: '#F5F5F3', border: '1px solid #CAD0DA' }}>
                  <code className="text-sm font-mono" style={{ color: '#6B6F7D' }}>{example}</code>
                </div>
                <div className="flex flex-wrap gap-2">
                  {problems.map((problem) => (
                    <span
                      key={problem}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
                      style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#F87171', border: '1px solid rgba(248, 113, 113, 0.2)' }}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {problem}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traditional Solutions */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="mb-4 text-lg" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            Traditional solutions don't work:
          </p>
          <div className="flex flex-wrap gap-3">
            {traditionalProblems.map(({ label, problem }) => (
              <div key={label} className="px-4 py-2" style={{ background: 'white', border: '1px solid #CAD0DA' }}>
                <span style={{ color: '#282B35', fontWeight: 500 }}>{label}</span>
                <span style={{ color: '#6B6F7D' }}> {problem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Gap Definition */}
        <div className={cn(
          "mb-16 transition-all duration-700",
          showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-block p-8 corner-card">
            <p className="text-lg mb-2" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>This creates</p>
            <p className="text-2xl md:text-3xl font-medium" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>
              The <span style={{ color: '#F87171' }}>Agentic Gap</span>
            </p>
            <p className="text-lg mt-3 max-w-xl" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
              The massive divide between what agents <span style={{ color: '#282B35', fontWeight: 500 }}>can do</span> and what businesses <span style={{ color: '#282B35', fontWeight: 500 }}>dare let them do</span>.
            </p>
          </div>
        </div>

        {/* Pilot Purgatory */}
        <div className={cn(
          "transition-all duration-700 delay-200",
          showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div
            className="flex flex-col md:flex-row items-center gap-6 p-8"
            style={{
              background: 'linear-gradient(75.85deg, #ffffff 14.68%, #e9eff0 184.03%)',
              clipPath: 'polygon(40px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40px)',
            }}
          >
            <div className="flex items-center justify-center w-16 h-16" style={{ background: 'rgba(40, 43, 53, 0.05)', border: '1px solid #CAD0DA' }}>
              <Laptop className="h-8 w-8" style={{ color: '#6B6F7D' }} />
            </div>
            <div className="md:text-left">
              <p className="text-sm font-mono tracking-widest uppercase mb-2" style={{ color: '#6B6F7D' }}>The Result</p>
              <h3 className="text-2xl font-medium mb-2" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>
                <span style={{ color: '#FACC15' }}>"Pilot Purgatory"</span>
              </h3>
              <p className="max-w-lg" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
                Thousands of high-capability agents sitting on local laptops, <span style={{ color: '#282B35', fontWeight: 500 }}>forbidden from touching real money</span> because the liability risk is infinite.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
