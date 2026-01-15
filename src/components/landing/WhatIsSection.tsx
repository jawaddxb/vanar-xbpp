import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FileJson, Globe, Eye } from 'lucide-react';

const features = [
  {
    icon: FileJson,
    title: 'Declarative Policies',
    description: 'Define behavior in external policy files, not buried in code.',
  },
  {
    icon: Globe,
    title: 'Open Standard',
    description: 'Interoperable across agents, platforms, and jurisdictions.',
  },
  {
    icon: Eye,
    title: 'Transparent Verdicts',
    description: 'Every decision is deterministic, auditable, and provable.',
  },
];

export function WhatIsSection() {
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
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={cn(
            "text-sm font-mono tracking-widest text-primary uppercase mb-4 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The Solution
          </p>
          <h2 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 transition-all duration-500 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <span className="text-primary">xBPP</span>: Behavioral Policy Protocol
          </h2>
          <p className={cn(
            "text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The open standard for <span className="text-foreground font-medium">Agentic Governance</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className={cn(
          "grid md:grid-cols-3 gap-6 mb-16 transition-all duration-700 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm text-center"
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          ))}
        </div>

        {/* POLICYLAB Connection */}
        <div className={cn(
          "text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-block p-8 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <p className="text-sm font-mono tracking-widest text-primary uppercase mb-3">Where xBPP comes alive</p>
            <h3 className="text-2xl md:text-3xl font-medium mb-4">
              POLICYLAB is a <span className="text-primary">theatre of consequences</span>.
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Watch identical agents, identical worlds — with one rule changed. 
              See exactly where behavior diverges. Understand what policies actually do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
