import { useEffect, useRef, useState } from 'react';
import { Brain, Wallet, Database, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const capabilities = [
  { icon: Brain, label: 'reason' },
  { icon: Wallet, label: 'transact' },
  { icon: Database, label: 'store memory' },
  { icon: Zap, label: 'act at machine speed' },
];

const questions = [
  'When should an agent stop?',
  'When should it ask a human?',
  'What risk is it allowed to take?',
  'What does "safe" actually mean?',
];

export function ProblemSection() {
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          questions.forEach((_, index) => {
            setTimeout(() => {
              setVisibleQuestions(prev => [...prev, index]);
            }, index * 400);
          });
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
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
      {/* Subtle red undertone */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-block/[0.02] to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
            Autonomy without constraints
            <br />
            <span className="text-muted-foreground">isn't autonomy.</span>
          </h2>
          <p className="text-3xl md:text-4xl text-block/80 font-medium mt-6">
            It's guesswork.
          </p>
        </div>

        {/* Capabilities */}
        <div className="mb-16">
          <p className="text-center text-muted-foreground mb-8 text-lg">Agents can:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {capabilities.map(({ icon: Icon, label }, index) => (
              <div
                key={label}
                className="flex items-center gap-3 px-5 py-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="mb-16">
          <p className="text-center text-muted-foreground mb-8 text-lg">
            But without declared behavioral constraints, you can't answer basic questions:
          </p>
          <div className="space-y-4 max-w-xl mx-auto">
            {questions.map((question, index) => (
              <div
                key={question}
                className={cn(
                  "flex items-center gap-4 transition-all duration-500",
                  visibleQuestions.includes(index) 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 -translate-x-4"
                )}
              >
                <div className="w-2 h-2 rounded-full bg-escalate shrink-0" />
                <span className="text-lg md:text-xl font-medium">{question}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="text-center">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Most systems bury these answers in prompts, heuristics, or code paths.
          </p>
          <p className="text-xl md:text-2xl text-foreground mt-4 font-medium">
            That makes outcomes unpredictable — and trust impossible.
          </p>
        </div>
      </div>
    </section>
  );
}
