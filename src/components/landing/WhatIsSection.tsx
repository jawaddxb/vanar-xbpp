import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const notItems = [
  'a training environment',
  'a prompt lab',
  'a personality engine',
  'a dashboard',
];

export function WhatIsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [crossedItems, setCrossedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          notItems.forEach((_, index) => {
            setTimeout(() => {
              setCrossedItems(prev => [...prev, index]);
            }, 800 + index * 200);
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
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">What PolicyLab Is</p>
          <h2 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            A demonstration platform
            <br />
            <span className="text-primary">for behavior under constraint.</span>
          </h2>
        </div>

        {/* Not list */}
        <div 
          className={cn(
            "mb-16 transition-all duration-700 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-center text-muted-foreground mb-6 text-lg">POLICYLAB is not:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {notItems.map((item, index) => (
              <div
                key={item}
                className={cn(
                  "relative px-4 py-2 rounded-lg border border-border/50 bg-card/30 transition-all duration-300",
                  crossedItems.includes(index) && "border-block/30 bg-block/5"
                )}
              >
                <span className={cn(
                  "font-mono text-sm transition-all duration-300",
                  crossedItems.includes(index) && "text-muted-foreground/50 line-through"
                )}>
                  {item}
                </span>
                {crossedItems.includes(index) && (
                  <X className="absolute -top-1 -right-1 h-4 w-4 text-block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Theatre of consequences */}
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-700 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-3xl md:text-4xl font-medium mb-2">
            It is a{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">theatre of consequences</span>
              <span className="absolute inset-0 bg-primary/10 blur-lg -z-0" />
            </span>
            .
          </p>
        </div>

        {/* Description */}
        <div 
          className={cn(
            "text-center space-y-6 transition-all duration-700 delay-800",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-lg text-muted-foreground">You choose:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-5 py-3 rounded-lg border border-primary/30 bg-primary/5">
              <span className="font-mono text-sm text-primary">a real-world scenario</span>
            </div>
            <div className="px-5 py-3 rounded-lg border border-primary/30 bg-primary/5">
              <span className="font-mono text-sm text-primary">two different policies</span>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-foreground leading-relaxed max-w-2xl mx-auto pt-4">
            POLICYLAB shows you — step by step —
            <br />
            how the same agent behaves under each.
          </p>
          
          <div className="pt-6 space-y-2">
            <p className="text-lg text-muted-foreground">Nothing hypothetical.</p>
            <p className="text-lg text-muted-foreground">Nothing optimized.</p>
            <p className="text-xl font-medium text-foreground">Just outcomes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
