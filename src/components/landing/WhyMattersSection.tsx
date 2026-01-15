import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Rocket, Shield, Globe, FileCheck, Code, Star } from 'lucide-react';

const developerBenefits = [
  {
    icon: Rocket,
    title: 'Build Faster',
    description: 'Stop writing compliance code. Import @vanar/xbpp and wrap your client. Get rate limiting, budget caps, and threat detection for free.',
  },
  {
    icon: Star,
    title: 'Monetize Trust',
    description: 'An agent with a verifiable, public xBPP Policy is 10x more likely to be hired than a "black box" agent.',
  },
];

const ctoBenefits = [
  {
    icon: Shield,
    title: 'Capped Liability',
    description: 'Mathematically prove that an agent cannot spend more than $X or interact with sanctioned addresses.',
  },
  {
    icon: Globe,
    title: 'Global Compliance',
    description: 'Swap policies based on jurisdiction. US to Germany? Switch from policy-us-v1 to policy-eu-v1 instantly.',
  },
  {
    icon: FileCheck,
    title: 'Audit Trail',
    description: 'Every decision is hashed and logged. Know not just what the agent spent, but why it was allowed.',
  },
];

export function WhyMattersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
        <div className="text-center mb-16">
          <p className={cn(
            "text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Why This Matters Now
          </p>
          <h2 className={cn(
            "text-4xl md:text-5xl font-medium tracking-tight transition-all duration-500 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Built for Builders. Trusted by Enterprises.
          </h2>
        </div>

        {/* Two Audience Columns */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* For Base Developers */}
          <div className={cn(
            "transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-medium">For Base Developers</h3>
              </div>
              
              <div className="space-y-6">
                {developerBenefits.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-card/50 border border-border/50 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code snippet */}
              <div className="mt-6 p-4 rounded-lg bg-card/80 border border-border/50">
                <code className="text-xs font-mono text-muted-foreground">
                  <span className="text-primary">import</span> {"{ wrap }"} <span className="text-primary">from</span> <span className="text-allow">'@vanar/xbpp'</span>;
                  <br />
                  <span className="text-muted-foreground/60">// That's it. You're compliant.</span>
                </code>
              </div>
            </div>
          </div>

          {/* For Enterprise CTOs */}
          <div className={cn(
            "transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="p-8 rounded-2xl border border-allow/30 bg-allow/5 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-allow/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-allow" />
                </div>
                <h3 className="text-2xl font-medium">For Enterprise CTOs</h3>
              </div>
              
              <div className="space-y-6">
                {ctoBenefits.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-card/50 border border-border/50 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-allow" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
