import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Layers, GitCompare, Play, Eye } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Pick a scenario',
    description: 'A familiar situation with real stakes.',
    examples: ['A new vendor.', 'A convincing signature.', 'A slow financial drain.', 'A poisoned address.'],
    icon: Layers,
  },
  {
    number: 2,
    title: 'Compare policies',
    description: 'Two sets of constraints.',
    examples: ['Same world. Same events.', 'One rule changes.'],
    icon: GitCompare,
  },
  {
    number: 3,
    title: 'Watch behavior unfold',
    description: 'The agent acts. Or stops. Or escalates.',
    examples: ['The timeline pauses when outcomes diverge.'],
    icon: Play,
  },
  {
    number: 4,
    title: 'See the consequence',
    description: 'Not a score. Not a judgment.',
    examples: ['Just the result of the rule.'],
    icon: Eye,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, index) => {
            setTimeout(() => {
              setActiveStep(index);
            }, index * 400);
          });
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
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
            Four steps to insight
          </h2>
        </div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 h-px bg-border hidden lg:block" />
          <div 
            className="absolute top-12 left-0 h-px bg-primary transition-all duration-1000 hidden lg:block"
            style={{ width: `${Math.min((activeStep + 1) * 25, 100)}%` }}
          />

          {/* Steps grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              
              return (
                <div
                  key={step.number}
                  className={cn(
                    "relative transition-all duration-500",
                    isActive ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4"
                  )}
                >
                  {/* Step number */}
                  <div className="flex items-center justify-center mb-6">
                    <div className={cn(
                      "w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative",
                      isActive 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-card"
                    )}>
                      <Icon className={cn(
                        "h-8 w-8 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <span className="text-xs font-mono text-muted-foreground mb-2 block">
                      Step {step.number}
                    </span>
                    <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="space-y-1">
                      {step.examples.map((example, i) => (
                        <p key={i} className="text-sm text-muted-foreground/70 italic">
                          {example}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
