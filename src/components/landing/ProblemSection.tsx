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
    <section ref={sectionRef} className="flex flex-col items-center justify-center px-6 py-20 md:py-28 relative">
      {/* Subtle warning undertone */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-escalate/[0.02] to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={cn(
            "text-sm font-mono tracking-widest text-escalate uppercase mb-4 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The Problem
          </p>
          <h2 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 transition-all duration-500 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The Agentic Gap
          </h2>
          <p className={cn(
            "text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            We solved <span className="text-foreground font-medium">Capability</span> — the ability to act.
            <br />
            We haven't solved <span className="text-escalate font-medium">Liability</span> — the safety of the action.
          </p>
        </div>

        {/* Dangers */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-250",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="text-center text-muted-foreground mb-6 text-lg">
            Capability without constraint is <span className="text-block">dangerous</span>:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {dangers.map(({ icon: Icon, text }, index) => (
              <div
                key={text}
                className={cn(
                  "p-4 rounded-xl border border-block/20 bg-block/5 flex items-start gap-3 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Icon className="h-5 w-5 text-block shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Control Methods */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="text-center text-muted-foreground mb-6 text-lg">
            Currently, there are only <span className="text-foreground">two ways</span> to control an agent:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {controlMethods.map(({ icon: Icon, label, example, problems }, index) => (
              <div
                key={label}
                className={cn(
                  "relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">{label}</h3>
                </div>
                <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <code className="text-sm font-mono text-muted-foreground">{example}</code>
                </div>
                <div className="flex flex-wrap gap-2">
                  {problems.map((problem) => (
                    <span 
                      key={problem}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-block/10 text-block border border-block/20"
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
          <p className="text-center text-muted-foreground mb-4 text-lg">
            Traditional solutions don't work:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {traditionalProblems.map(({ label, problem }) => (
              <div key={label} className="px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-foreground font-medium">{label}</span>
                <span className="text-muted-foreground"> {problem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Gap Definition */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-block p-8 rounded-2xl border border-escalate/30 bg-escalate/5 backdrop-blur-sm">
            <p className="text-lg text-muted-foreground mb-2">This creates</p>
            <p className="text-2xl md:text-3xl font-medium text-foreground">
              The <span className="text-escalate">Agentic Gap</span>
            </p>
            <p className="text-lg text-muted-foreground mt-3 max-w-xl">
              The massive divide between what agents <span className="text-foreground">can do</span> and what businesses <span className="text-foreground">dare let them do</span>.
            </p>
          </div>
        </div>

        {/* Pilot Purgatory */}
        <div className={cn(
          "transition-all duration-700 delay-200",
          showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 border border-border/50">
              <Laptop className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-2">The Result</p>
              <h3 className="text-2xl font-medium mb-2">
                <span className="text-escalate">"Pilot Purgatory"</span>
              </h3>
              <p className="text-muted-foreground max-w-lg">
                Thousands of high-capability agents sitting on local laptops, <span className="text-foreground">forbidden from touching real money</span> because the liability risk is infinite.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}