import { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePolicyLabStore } from '@/lib/store';
import { getScenarioById } from '@/lib/data/scenarios';
import { permissivePolicy, restrictivePolicy } from '@/lib/data/policies';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatedBackground, GlowCard } from '@/components/effects';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scenarioId = searchParams.get('scenario');
  const { setSelectedScenario, loadScenarioData } = usePolicyLabStore();
  
  const [expandedA, setExpandedA] = useState(false);
  const [expandedB, setExpandedB] = useState(false);
  
  const scenario = scenarioId ? getScenarioById(scenarioId) : null;
  
  useEffect(() => {
    if (!scenarioId) {
      navigate('/scenarios');
    } else {
      setSelectedScenario(scenarioId);
    }
  }, [scenarioId, navigate, setSelectedScenario]);
  
  if (!scenario) return null;
  
  const handleRunComparison = () => {
    loadScenarioData(scenario.id);
    navigate(`/run?scenario=${scenario.id}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="text-sm font-mono text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Comparing policies for
              </p>
              <h1 className="text-4xl md:text-5xl font-medium">{scenario.name}</h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">{scenario.description}</p>
            </div>
          </div>
        </header>
        
        {/* VS Divider */}
        <div className="hidden md:flex items-center justify-center mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-allow/30 to-allow/50" />
          <div className="px-6 py-3 rounded-full border border-border bg-card/50 backdrop-blur-sm mx-4">
            <span className="text-sm font-mono text-muted-foreground">VS</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-escalate/30 to-escalate/50" />
        </div>
        
        {/* Policy Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Policy A - Permissive */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <PolicyPanel
              policy={permissivePolicy}
              expanded={expandedA}
              onToggleExpand={() => setExpandedA(!expandedA)}
              variant="permissive"
            />
          </div>
          
          {/* Policy B - Restrictive */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <PolicyPanel
              policy={restrictivePolicy}
              expanded={expandedB}
              onToggleExpand={() => setExpandedB(!expandedB)}
              variant="restrictive"
            />
          </div>
        </div>
        
        {/* Run CTA */}
        <div className="flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button size="lg" onClick={handleRunComparison} className="group text-lg px-10 py-6 relative overflow-hidden">
            <span className="relative z-10 flex items-center">
              Run comparison
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <p className="text-sm text-muted-foreground/60 font-mono">
            Watch both policies evaluate the same scenario
          </p>
        </div>
      </div>
    </div>
  );
}

interface PolicyPanelProps {
  policy: typeof permissivePolicy;
  expanded: boolean;
  onToggleExpand: () => void;
  variant: 'permissive' | 'restrictive';
}

function PolicyPanel({ policy, expanded, onToggleExpand, variant }: PolicyPanelProps) {
  const [copied, setCopied] = useState(false);
  
  const uniqueConstraints = policy.constraints.filter(c => !c.isShared);
  const sharedConstraints = policy.constraints.filter(c => c.isShared);
  
  const handleCopyHash = () => {
    navigator.clipboard.writeText(policy.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const isPermissive = variant === 'permissive';
  const accentColor = isPermissive ? 'allow' : 'escalate';
  
  return (
    <GlowCard 
      className="p-8 h-full" 
      glowColor={isPermissive ? 'allow' : 'escalate'}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3",
            isPermissive 
              ? 'bg-allow/10 text-allow border border-allow/20' 
              : 'bg-escalate/10 text-escalate border border-escalate/20'
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isPermissive ? 'bg-allow' : 'bg-escalate'
            )} />
            {policy.type}
          </span>
          <h3 className="text-2xl font-medium">{policy.name}</h3>
        </div>
        <button
          onClick={handleCopyHash}
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="opacity-60 group-hover:opacity-100">{policy.hash}</span>
          {copied ? (
            <Check className="h-3 w-3 text-allow" />
          ) : (
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>
      
      {/* Posture */}
      <div className={cn(
        "p-4 rounded-lg mb-8 border-l-2",
        isPermissive ? 'bg-allow/5 border-allow/50' : 'bg-escalate/5 border-escalate/50'
      )}>
        <p className="text-muted-foreground italic text-lg">
          "{policy.posture_summary}"
        </p>
      </div>
      
      {/* Unique Constraints (highlighted) */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <span className={cn(
            "w-1 h-1 rounded-full",
            isPermissive ? 'bg-allow' : 'bg-escalate'
          )} />
          Key Constraints
        </p>
        {uniqueConstraints.map(constraint => (
          <div
            key={constraint.id}
            className={cn(
              "p-4 rounded-lg border transition-colors",
              isPermissive 
                ? 'bg-allow/5 border-allow/20 hover:border-allow/40' 
                : 'bg-escalate/5 border-escalate/20 hover:border-escalate/40'
            )}
          >
            <p className="font-medium">{constraint.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{constraint.description}</p>
          </div>
        ))}
      </div>
      
      {/* Shared Constraints (muted) */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider opacity-50">
          Shared Constraints
        </p>
        <div className="grid grid-cols-2 gap-2">
          {sharedConstraints.map(constraint => (
            <div
              key={constraint.id}
              className="p-2 rounded bg-muted/20 opacity-50 hover:opacity-70 transition-opacity"
            >
              <p className="text-xs truncate">{constraint.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* JSON Toggle */}
      <button
        onClick={onToggleExpand}
        className="flex items-center gap-2 mt-8 text-xs text-muted-foreground hover:text-foreground transition-colors group"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        <span className="group-hover:underline">{expanded ? 'Hide' : 'View'} policy JSON</span>
      </button>
      
      {expanded && (
        <pre className="mt-4 p-4 rounded-lg bg-background/80 text-xs font-mono overflow-x-auto border border-border max-h-64 overflow-y-auto">
          <code className="text-muted-foreground">
            {JSON.stringify(policy.raw_json, null, 2)}
          </code>
        </pre>
      )}
    </GlowCard>
  );
}
