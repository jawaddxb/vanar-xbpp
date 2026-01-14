import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Wallet, PenTool, Sparkles } from 'lucide-react';
import { scenarios } from '@/lib/data/scenarios';
import { Category, RiskLevel } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatedBackground, GlowCard } from '@/components/effects';

const categoryIcons: Record<Category, React.ReactNode> = {
  SPEND: <Wallet className="h-4 w-4" />,
  SIGN: <PenTool className="h-4 w-4" />,
  DEFENSE: <Shield className="h-4 w-4" />,
};

const categoryColors: Record<Category, string> = {
  SPEND: 'bg-primary/10 text-primary border-primary/20',
  SIGN: 'bg-escalate/10 text-escalate border-escalate/20',
  DEFENSE: 'bg-block/10 text-block border-block/20',
};

const riskConfig: Record<RiskLevel, { bg: string; text: string; pulse: boolean }> = {
  LOW: { bg: 'bg-allow/15', text: 'text-allow', pulse: false },
  MEDIUM: { bg: 'bg-escalate/15', text: 'text-escalate', pulse: false },
  HIGH: { bg: 'bg-block/15', text: 'text-block', pulse: true },
};

export default function Scenarios() {
  return (
    <div className="min-h-screen py-20 px-6 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-20">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-mono tracking-widest text-muted-foreground uppercase hover:text-primary transition-colors mb-8 animate-fade-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            POLICYLAB
          </Link>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-medium mt-6 mb-6 animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            Choose a scenario
          </h1>
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            Each scenario presents a decision point where policy constraints diverge.
            <br />
            <span className="text-foreground/80">Same situation. Different outcomes.</span>
          </p>
        </header>
        
        {/* Scenario Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {scenarios.map((scenario, index) => {
            const risk = riskConfig[scenario.risk_level];
            const category = categoryColors[scenario.category];
            
            return (
              <Link
                key={scenario.id}
                to={`/compare?scenario=${scenario.id}`}
                className="group block animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <GlowCard 
                  className={cn(
                    "h-full p-8 relative overflow-hidden",
                    "hover:translate-y-[-2px] hover:bg-card/80"
                  )}
                  glowColor="primary"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Top row: Category + Risk */}
                  <div className="flex items-center justify-between mb-6 relative">
                    <span className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider",
                      category
                    )}>
                      {categoryIcons[scenario.category]}
                      {scenario.category}
                    </span>
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider relative",
                      risk.bg,
                      risk.text
                    )}>
                      {risk.pulse && (
                        <span className="absolute inset-0 rounded-full bg-block/20 animate-pulse" />
                      )}
                      <span className="relative">{scenario.risk_level} RISK</span>
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-medium mb-4 group-hover:text-primary transition-colors relative">
                    {scenario.name}
                  </h2>
                  
                  {/* Narrative */}
                  <p className="text-muted-foreground text-base leading-relaxed mb-8 relative">
                    "{scenario.narrative}"
                  </p>
                  
                  {/* CTA */}
                  <div className="flex items-center text-sm text-primary font-medium relative">
                    <Sparkles className="mr-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      Use this scenario
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                  
                  {/* Event count indicator */}
                  <div className="absolute bottom-8 right-8 text-xs font-mono text-muted-foreground/50">
                    {scenario.event_stream.length} events
                  </div>
                </GlowCard>
              </Link>
            );
          })}
        </div>
        
        {/* Bottom hint */}
        <p className="text-center text-sm text-muted-foreground/60 mt-16 font-mono animate-fade-in" style={{ animationDelay: '600ms' }}>
          Click a scenario to compare policies
        </p>
      </div>
    </div>
  );
}
