import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Shield, CheckCircle, XCircle, AlertCircle, TrendingUp, FileJson } from 'lucide-react';

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
  { type: 'ALLOW', description: 'Proceed with the payment', icon: CheckCircle, color: 'allow' },
  { type: 'BLOCK', description: 'Stop; this violates policy', icon: XCircle, color: 'block' },
  { type: 'ESCALATE', description: 'Ask a human to approve', icon: AlertCircle, color: 'escalate' },
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
    <section ref={sectionRef} className="flex flex-col items-center justify-center px-6 py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={cn(
            "text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The Architecture
          </p>
          <h2 className={cn(
            "text-4xl md:text-5xl font-medium tracking-tight mb-4 transition-all duration-500 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The Architecture of Trust
          </h2>
          <p className={cn(
            "text-xl text-muted-foreground transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            A standardized middleware layer between <span className="text-foreground">Agent</span> and <span className="text-foreground">World</span>
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="mb-16">
          {/* Visual Flow */}
          <div className={cn(
            "p-6 rounded-xl border border-border bg-card/50 mb-8 transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="p-4 rounded-lg bg-muted/50 border border-border flex-1 w-full md:w-auto">
                <p className="text-xs font-mono text-muted-foreground mb-2">YOUR APPLICATION</p>
                <p className="font-medium">Agent wants to pay $50 to 0xABC...</p>
              </div>
              <div className="text-2xl text-muted-foreground">→</div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex-1 w-full md:w-auto">
                <p className="text-xs font-mono text-primary mb-2">XBPP INTERPRETER</p>
                <p className="font-medium">Action + Policy → Verdict</p>
              </div>
              <div className="text-2xl text-muted-foreground">→</div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border flex-1 w-full md:w-auto">
                <p className="text-xs font-mono text-muted-foreground mb-2">RESULT</p>
                <p className="font-mono font-bold">ALLOW | BLOCK | ESCALATE</p>
              </div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              
              return (
                <div
                  key={step.number}
                  className={cn(
                    "p-6 rounded-xl border transition-all duration-500",
                    isActive 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-border/30 bg-card/30 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                      isActive ? "bg-primary/20 border border-primary/50" : "bg-muted/50 border border-border/50"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">Step {step.number}</p>
                      <h3 className="text-xl font-medium">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{step.description}</p>
                  <p className="text-sm font-mono text-foreground/80 italic">{step.example}</p>
                </div>
              );
            })}
          </div>

          {/* Connecting Arrow */}
          <div className={cn(
            "flex justify-center mb-8 transition-all duration-500",
            showVerdicts ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex flex-col items-center">
              <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-primary" />
              <div className="text-xs font-mono text-muted-foreground py-2">Verdict</div>
              <div className="w-px h-8 bg-gradient-to-b from-primary to-primary/50" />
            </div>
          </div>

          {/* Verdicts */}
          <div className={cn(
            "grid md:grid-cols-3 gap-4 transition-all duration-700",
            showVerdicts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {verdicts.map(({ type, description, icon: Icon, color }, index) => (
              <div
                key={type}
                className={cn(
                  "p-5 rounded-xl border text-center transition-all duration-500",
                  `border-${color}/30 bg-${color}/5`
                )}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  borderColor: `hsl(var(--${color}) / 0.3)`,
                  backgroundColor: `hsl(var(--${color}) / 0.05)`,
                }}
              >
                <Icon 
                  className="h-8 w-8 mx-auto mb-3" 
                  style={{ color: `hsl(var(--${color}))` }}
                />
                <p className="text-lg font-mono font-medium mb-1" style={{ color: `hsl(var(--${color}))` }}>
                  {type}
                </p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Concepts Table */}
        <div className={cn(
          "mb-16 transition-all duration-700",
          showConcepts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center gap-3 mb-6">
            <FileJson className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Key Concepts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Concept</th>
                  <th className="text-left py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">What It Is</th>
                  <th className="text-left py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keyConcepts.map(({ concept, description, example }) => (
                  <tr key={concept}>
                    <td className="py-3 pr-4 font-mono text-primary">{concept}</td>
                    <td className="py-3 pr-4">{description}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{example}</td>
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
          <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Graduated Autonomy</h3>
                <p className="text-muted-foreground">Trust builds over time — automatically</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 rounded-lg bg-card/50 border border-border/50">
                <p className="text-sm font-mono text-escalate mb-2">Cautious Posture</p>
                <p className="text-foreground font-medium">$10 limit, full human oversight</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-allow/30">
                <p className="text-sm font-mono text-allow mb-2">Aggressive Posture</p>
                <p className="text-foreground font-medium">$10k limit, autonomous execution</p>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground mt-6">
              Graduate between postures as trust builds — <span className="text-foreground">without rewriting a single line of code</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}