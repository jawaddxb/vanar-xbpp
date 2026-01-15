import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBPPLabStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { DecisionType } from '@/lib/types';
import { TypewriterText, SplitReveal } from '@/components/effects';

export default function Diff() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scenarioId = searchParams.get('scenario');
  
  const { selectedScenario, diff, loadScenarioData, policyA, policyB } = useBPPLabStore();
  
  // Animation states - more theatrical timing
  const [phase, setPhase] = useState(0);
  // 0: initial
  // 1: dim
  // 2: context revealed
  // 3: split revealed
  // 4: overlay text
  // 5: CTA
  
  useEffect(() => {
    if (!scenarioId) {
      navigate('/scenarios');
      return;
    }
    if (!selectedScenario || selectedScenario.id !== scenarioId) {
      loadScenarioData(scenarioId);
    }
  }, [scenarioId, selectedScenario, loadScenarioData, navigate]);
  
  // Theatrical reveal sequence with dramatic pauses
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),    // Dim
      setTimeout(() => setPhase(2), 2000),   // Context
      setTimeout(() => setPhase(3), 3500),   // Split
      setTimeout(() => setPhase(4), 5500),   // Overlay
      setTimeout(() => setPhase(5), 7500),   // CTA
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  
  if (!selectedScenario || !diff) return null;
  
  const divergence = diff.divergence_points[0];
  if (!divergence) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated dim overlay with vignette */}
      <div
        className={cn(
          "fixed inset-0 z-0 transition-all duration-1500",
          phase >= 1 ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: phase >= 1 
            ? 'radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 50%, hsl(0 0% 0% / 0.9) 100%)'
            : 'transparent'
        }}
      />
      
      {/* Scanning line effect */}
      {phase >= 1 && phase < 3 && (
        <div 
          className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent z-10 animate-pulse"
          style={{
            top: '50%',
            boxShadow: '0 0 20px 5px hsl(var(--primary) / 0.3)'
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Divergence context */}
        <div className={cn(
          "text-center mb-16 max-w-3xl transition-all duration-1000",
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-escalate animate-pulse" />
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Divergence Point
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
            {divergence.event_narrative}
          </h1>
        </div>
        
        {/* Split panel comparison */}
        <div className="w-full max-w-6xl mb-16">
          <SplitReveal
            isRevealed={phase >= 3}
            leftContent={
              <DecisionPanel
                policyName={policyA.name}
                policyHash={policyA.hash}
                decision={divergence.policy_a_decision.decision}
                reasonCodes={divergence.policy_a_decision.reason_codes}
                narrative={divergence.policy_a_decision.narrative}
                variant="a"
                isRevealed={phase >= 3}
              />
            }
            rightContent={
              <DecisionPanel
                policyName={policyB.name}
                policyHash={policyB.hash}
                decision={divergence.policy_b_decision.decision}
                reasonCodes={divergence.policy_b_decision.reason_codes}
                narrative={divergence.policy_b_decision.narrative}
                variant="b"
                isRevealed={phase >= 3}
              />
            }
          />
        </div>
        
        {/* Overlay message - typed out dramatically */}
        <div className={cn(
          "text-center transition-all duration-1000 mb-12",
          phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium">
            {phase >= 4 ? (
              <TypewriterText 
                text="Nothing changed — except the rule."
                highlight="except the rule."
                highlightClassName="text-primary"
                speed={60}
              />
            ) : (
              <span className="opacity-0">Nothing changed — except the rule.</span>
            )}
          </p>
          
          {/* Secondary insight */}
          <div className={cn(
            "mt-6 space-y-2 transition-all duration-700",
            phase >= 5 ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-muted-foreground">
              <span className="text-allow">This policy</span> would have kept going.
            </p>
            <p className="text-muted-foreground">
              <span className="text-escalate">This one</span> asked a human.
            </p>
          </div>
        </div>
        
        {/* CTA */}
        <div className={cn(
          "transition-all duration-700",
          phase >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Button asChild size="lg" className="group text-lg px-10 py-6">
            <Link to={`/summary?scenario=${scenarioId}`}>
              See consequences
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
}

interface DecisionPanelProps {
  policyName: string;
  policyHash: string;
  decision: DecisionType;
  reasonCodes: string[];
  narrative: string;
  variant: 'a' | 'b';
  isRevealed: boolean;
}

function DecisionPanel({ policyName, policyHash, decision, reasonCodes, narrative, variant, isRevealed }: DecisionPanelProps) {
  const decisionConfig: Record<DecisionType, { 
    bg: string; 
    text: string; 
    border: string;
    glow: string;
    badgeBg: string;
    icon: string;
  }> = {
    ALLOW: { 
      bg: 'bg-allow/5', 
      text: 'text-allow', 
      border: 'border-allow/30',
      glow: 'shadow-[0_0_40px_-10px_hsl(var(--decision-allow)/0.4)]',
      badgeBg: 'bg-allow/20',
      icon: '✓'
    },
    BLOCK: { 
      bg: 'bg-block/5', 
      text: 'text-block', 
      border: 'border-block/30',
      glow: 'shadow-[0_0_40px_-10px_hsl(var(--decision-block)/0.4)]',
      badgeBg: 'bg-block/20',
      icon: '✕'
    },
    ESCALATE: { 
      bg: 'bg-escalate/5', 
      text: 'text-escalate', 
      border: 'border-escalate/30',
      glow: 'shadow-[0_0_40px_-10px_hsl(var(--decision-escalate)/0.4)]',
      badgeBg: 'bg-escalate/20',
      icon: '⏸'
    },
  };
  
  const config = decisionConfig[decision];
  
  // Get reason code descriptions
  const getReasonDescription = (code: string): string => {
    const descriptions: Record<string, string> = {
      'EXCEEDS_SINGLE_LIMIT': 'Value exceeds max_single',
      'EXCEEDS_DAILY_LIMIT': 'Would exceed max_daily',
      'HIGH_VALUE': 'Value exceeds require_human_above',
      'NEW_COUNTERPARTY': 'First-time payment recipient',
      'WITHIN_POLICY': 'All checks passed',
      'BURST_DETECTED': 'Unusual transaction burst',
      'LOW_CONFIDENCE': 'Agent confidence below threshold',
      'DRAINER_CONTRACT': 'Known drainer contract detected',
      'ADDRESS_POISONING': 'Address poisoning pattern',
      'FRAGMENTATION_DETECTED': 'Possible split attack',
    };
    return descriptions[code] || code;
  };
  
  return (
    <div className={cn(
      "rounded-xl border p-8 h-full backdrop-blur-sm transition-all duration-700",
      config.border,
      config.bg,
      isRevealed && config.glow
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
            Policy {variant.toUpperCase()}
          </p>
          <h3 className="text-xl md:text-2xl font-medium">{policyName}</h3>
        </div>
        <span className="font-mono text-xs text-muted-foreground/60 bg-muted/30 px-2 py-1 rounded">{policyHash}</span>
      </div>
      
      {/* Decision badge - large and prominent */}
      <div className={cn(
        "inline-flex items-center gap-3 px-6 py-3 rounded-full font-mono font-medium text-2xl mb-6 transition-all duration-500",
        config.badgeBg,
        config.text,
        isRevealed && "animate-scale-in"
      )}>
        <span>{config.icon}</span>
        {decision}
      </div>
      
      {/* Reason codes with descriptions */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          xBPP Reason Codes
        </p>
        <div className="space-y-2">
          {reasonCodes.map((code, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50",
                "transition-all duration-300"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className={cn("font-mono text-xs px-2 py-0.5 rounded", config.badgeBg, config.text)}>
                {code}
              </span>
              <span className="text-xs text-muted-foreground">
                {getReasonDescription(code)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Narrative */}
      <div className={cn("border-l-2 pl-4", config.border)}>
        <p className="text-muted-foreground italic text-lg leading-relaxed">
          "{narrative}"
        </p>
      </div>
    </div>
  );
}
