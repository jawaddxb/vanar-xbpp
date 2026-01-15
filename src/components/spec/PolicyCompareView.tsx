import { X, ArrowRight, ArrowUp, ArrowDown, Minus, Zap, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavedPolicy, Posture, PolicyConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PolicyCompareViewProps {
  policyA: SavedPolicy;
  policyB: SavedPolicy;
  onClose: () => void;
}

const getPostureConfig = (posture: Posture) => {
  switch (posture) {
    case 'AGGRESSIVE':
      return { icon: Zap, color: 'text-escalate', bg: 'bg-escalate/10', label: 'Aggressive' };
    case 'BALANCED':
      return { icon: Shield, color: 'text-primary', bg: 'bg-primary/10', label: 'Balanced' };
    case 'CAUTIOUS':
      return { icon: AlertTriangle, color: 'text-allow', bg: 'bg-allow/10', label: 'Cautious' };
  }
};

interface DiffIndicatorProps {
  valueA: number | string | boolean;
  valueB: number | string | boolean;
  type?: 'money' | 'percent' | 'text' | 'boolean';
}

function DiffIndicator({ valueA, valueB, type = 'text' }: DiffIndicatorProps) {
  if (valueA === valueB) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
  
  if (type === 'money' || type === 'percent') {
    const numA = typeof valueA === 'number' ? valueA : 0;
    const numB = typeof valueB === 'number' ? valueB : 0;
    return numB > numA 
      ? <ArrowUp className="h-4 w-4 text-allow" />
      : <ArrowDown className="h-4 w-4 text-block" />;
  }
  
  return <ArrowRight className="h-4 w-4 text-escalate" />;
}

function formatValue(value: number | string | boolean, type: 'money' | 'percent' | 'text' | 'boolean'): string {
  if (type === 'money') return `$${(value as number).toLocaleString()}`;
  if (type === 'percent') return `${((value as number) * 100).toFixed(0)}%`;
  if (type === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

interface CompareRowProps {
  label: string;
  valueA: number | string | boolean;
  valueB: number | string | boolean;
  type?: 'money' | 'percent' | 'text' | 'boolean';
}

function CompareRow({ label, valueA, valueB, type = 'text' }: CompareRowProps) {
  const isDifferent = valueA !== valueB;
  
  return (
    <div className={cn(
      "grid grid-cols-[1fr,auto,1fr] gap-4 py-3 border-b border-border items-center",
      isDifferent && "bg-primary/5"
    )}>
      <div className="text-right">
        <span className={cn(
          "font-mono text-sm",
          isDifferent ? "text-foreground" : "text-muted-foreground"
        )}>
          {formatValue(valueA, type)}
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <DiffIndicator valueA={valueA} valueB={valueB} type={type} />
      </div>
      <div className="text-left">
        <span className={cn(
          "font-mono text-sm",
          isDifferent ? "text-foreground" : "text-muted-foreground"
        )}>
          {formatValue(valueB, type)}
        </span>
      </div>
    </div>
  );
}

export function PolicyCompareView({ policyA, policyB, onClose }: PolicyCompareViewProps) {
  const postureA = getPostureConfig(policyA.config.posture);
  const postureB = getPostureConfig(policyB.config.posture);
  const IconA = postureA.icon;
  const IconB = postureB.icon;

  const configA = policyA.config;
  const configB = policyB.config;

  // Count differences
  const differences = Object.keys(configA).filter(key => {
    return configA[key as keyof PolicyConfig] !== configB[key as keyof PolicyConfig];
  }).length;

  return (
    <div className="space-y-4">
      {/* Header with policy names */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Policy Comparison</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-1" />
          Close
        </Button>
      </div>

      {/* Diff summary */}
      <div className="p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-sm">
          <span className="font-mono text-primary">{differences}</span>{' '}
          <span className="text-muted-foreground">
            {differences === 1 ? 'difference' : 'differences'} between policies
          </span>
        </p>
      </div>

      {/* Policy headers */}
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4">
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <h4 className="font-medium truncate mb-1">{policyA.name}</h4>
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono",
            postureA.bg, postureA.color
          )}>
            <IconA className="h-3 w-3" />
            {postureA.label}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-muted-foreground">vs</span>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <h4 className="font-medium truncate mb-1">{policyB.name}</h4>
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono",
            postureB.bg, postureB.color
          )}>
            <IconB className="h-3 w-3" />
            {postureB.label}
          </span>
        </div>
      </div>

      {/* Comparison table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <CompareRow label="Posture" valueA={configA.posture} valueB={configB.posture} />
        <CompareRow label="Max Single" valueA={configA.maxSingle} valueB={configB.maxSingle} type="money" />
        <CompareRow label="Max Daily" valueA={configA.maxDaily} valueB={configB.maxDaily} type="money" />
        <CompareRow label="Max Weekly" valueA={configA.maxWeekly} valueB={configB.maxWeekly} type="money" />
        <CompareRow label="Human Above" valueA={configA.requireHumanAbove} valueB={configB.requireHumanAbove} type="money" />
        <CompareRow label="New Counterparty" valueA={configA.newCounterpartyAction} valueB={configB.newCounterpartyAction} />
        <CompareRow label="Require Verified" valueA={configA.requireVerified} valueB={configB.requireVerified} type="boolean" />
        <CompareRow label="Burst Detection" valueA={configA.burstDetection} valueB={configB.burstDetection} type="boolean" />
        <CompareRow label="Min Confidence" valueA={configA.minConfidence} valueB={configB.minConfidence} type="percent" />
        <CompareRow label="Log Level" valueA={configA.logLevel} valueB={configB.logLevel} />
      </div>
    </div>
  );
}
