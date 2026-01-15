import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Globe, Building2, Cpu, CreditCard, Landmark } from 'lucide-react';

const ecosystemPlayers = [
  {
    name: 'Crossmint',
    icon: Building2,
    action: 'Building wallets for agents',
    color: 'text-blue-400',
  },
  {
    name: 'Kite AI',
    icon: Cpu,
    action: 'Building the Agentic Internet layer',
    color: 'text-emerald-400',
  },
  {
    name: 'Visa',
    icon: CreditCard,
    action: 'Researching Trusted Agent Registries',
    color: 'text-violet-400',
  },
  {
    name: 'Coinbase',
    icon: Landmark,
    action: 'Exploring agent authentication standards',
    color: 'text-amber-400',
  },
];

export function WhyNowSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShowPlayers(true), 600);
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
    <section ref={sectionRef} className="py-20 md:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm font-mono tracking-widest text-primary uppercase mb-4">The Vision</p>
          <h2 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            In the near future, no autonomous agent
            <br />
            will execute without a <span className="text-primary">signed Verdict</span>.
          </h2>
        </div>

        {/* Ecosystem Players */}
        <div className={cn(
          "mb-12 transition-all duration-700 delay-200",
          showPlayers ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-center text-sm font-mono text-muted-foreground mb-6 uppercase tracking-wider">
            The industry is already building toward this future
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ecosystemPlayers.map((player, index) => (
              <div
                key={player.name}
                className={cn(
                  "p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm",
                  "hover:border-border hover:bg-card/50 transition-all duration-300"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <player.icon className={cn("w-4 h-4", player.color)} />
                  <span className="font-medium text-foreground text-sm">{player.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{player.action}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4 italic">
            They're all waiting for the same thing: <span className="text-foreground not-italic font-medium">a standard for safe spending.</span>
          </p>
        </div>

        <div className={cn(
          "flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-12 transition-all duration-700 delay-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-border/50 bg-card/30">
            <Lock className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">SSL</p>
              <p className="font-medium">Standard for moving data</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-primary/30 bg-primary/5">
            <Globe className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-primary">xBPP</p>
              <p className="font-medium">Standard for moving value</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xl text-muted-foreground mb-4">
            xBPP transforms the "Wild West" of on-chain agents into a
          </p>
          <p className="text-2xl md:text-3xl font-medium">
            reliable, <span className="text-allow">insurable</span>, and <span className="text-primary">scalable</span> economy.
          </p>
        </div>
      </div>
    </section>
  );
}
