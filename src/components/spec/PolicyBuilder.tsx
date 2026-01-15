import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, RotateCcw, Sparkles, Shield, Zap, AlertTriangle, Play, Library, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Posture, XBPPPolicy, PolicyConfig, SavedPolicy } from '@/lib/types';
import { usePolicyLabStore } from '@/lib/store';
import { getSavedPolicies, savePolicy, generatePolicyId } from '@/lib/policyStorage';
import { PolicyLibraryDrawer } from './PolicyLibraryDrawer';
import { SavePolicyDialog } from './SavePolicyDialog';

const presets: Record<string, Partial<PolicyConfig>> = {
  starter: {
    posture: 'BALANCED',
    maxSingle: 100,
    maxDaily: 1000,
    maxWeekly: 5000,
    requireHumanAbove: 500,
    newCounterpartyAction: 'ESCALATE',
    requireVerified: false,
    burstDetection: false,
    minConfidence: 0.7,
    logLevel: 'STANDARD',
  },
  team: {
    posture: 'BALANCED',
    maxSingle: 500,
    maxDaily: 5000,
    maxWeekly: 20000,
    requireHumanAbove: 1000,
    newCounterpartyAction: 'ESCALATE',
    requireVerified: false,
    burstDetection: true,
    minConfidence: 0.8,
    logLevel: 'STANDARD',
  },
  enterprise: {
    posture: 'CAUTIOUS',
    maxSingle: 1000,
    maxDaily: 10000,
    maxWeekly: 50000,
    requireHumanAbove: 500,
    newCounterpartyAction: 'BLOCK',
    requireVerified: true,
    burstDetection: true,
    minConfidence: 0.9,
    logLevel: 'VERBOSE',
  },
  automation: {
    posture: 'AGGRESSIVE',
    maxSingle: 500,
    maxDaily: 50000,
    maxWeekly: 250000,
    requireHumanAbove: 2500,
    newCounterpartyAction: 'ALLOW',
    requireVerified: false,
    burstDetection: false,
    minConfidence: 0.5,
    logLevel: 'MINIMAL',
  },
};

const defaultConfig: PolicyConfig = {
  posture: 'BALANCED',
  maxSingle: 100,
  maxDaily: 1000,
  maxWeekly: 5000,
  requireHumanAbove: 500,
  newCounterpartyAction: 'ESCALATE',
  requireVerified: false,
  burstDetection: false,
  minConfidence: 0.7,
  logLevel: 'STANDARD',
};

export function PolicyBuilder() {
  const navigate = useNavigate();
  const { setCustomPolicy } = usePolicyLabStore();
  const [config, setConfig] = useState<PolicyConfig>(defaultConfig);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>('starter');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getSavedPolicies().length);
  }, [libraryOpen, saveDialogOpen]);

  // Generate the xBPP policy object
  const xbppPolicy = useMemo((): XBPPPolicy => {
    const policy: XBPPPolicy = {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: config.posture,
      limits: {
        max_single: config.maxSingle,
        max_daily: config.maxDaily,
        max_weekly: config.maxWeekly,
        require_human_above: config.requireHumanAbove,
      },
      verification: 'BUILT_IN',
    };

    // Add counterparty rules if not default
    if (config.newCounterpartyAction !== 'ALLOW' || config.requireVerified) {
      policy.counterparty_rules = {
        new_counterparty_action: config.newCounterpartyAction,
        require_verified: config.requireVerified,
      };
    }

    // Add rate limits if burst detection enabled
    if (config.burstDetection) {
      policy.rate_limits = {
        burst_detection: true,
        max_per_minute: 10,
        max_per_hour: 100,
      };
    }

    // Add confidence rules if not default
    if (config.minConfidence !== 0.7) {
      policy.confidence_rules = {
        min_confidence: config.minConfidence,
      };
    }

    // Add audit config if not standard
    if (config.logLevel !== 'STANDARD') {
      policy.audit = {
        log_level: config.logLevel,
        retention_days: config.logLevel === 'VERBOSE' ? 2555 : 90,
      };
    }

    return policy;
  }, [config]);

  const generatedPolicy = useMemo(() => {
    return JSON.stringify(xbppPolicy, null, 2);
  }, [xbppPolicy]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPolicy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreset = (preset: string) => {
    setActivePreset(preset);
    setConfig({ ...defaultConfig, ...presets[preset] });
  };

  const handleReset = () => {
    setActivePreset('starter');
    setConfig(defaultConfig);
  };

  const handleTestPolicy = () => {
    setCustomPolicy(xbppPolicy);
    navigate('/scenarios');
  };

  const handleLoadPolicy = (loadedConfig: PolicyConfig) => {
    setConfig(loadedConfig);
    setActivePreset(null);
  };

  const handleSavePolicy = (name: string, description?: string) => {
    const policy: SavedPolicy = {
      id: generatePolicyId(),
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      config,
    };
    savePolicy(policy);
    setSaveDialogOpen(false);
  };

  const updateConfig = <K extends keyof PolicyConfig>(key: K, value: PolicyConfig[K]) => {
    setActivePreset(null);
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const getPostureConfig = (posture: Posture) => {
    switch (posture) {
      case 'AGGRESSIVE':
        return { icon: Zap, color: 'text-escalate', bg: 'bg-escalate/10', border: 'border-escalate/30', label: 'Speed First' };
      case 'BALANCED':
        return { icon: Shield, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', label: 'Balanced' };
      case 'CAUTIOUS':
        return { icon: AlertTriangle, color: 'text-allow', bg: 'bg-allow/10', border: 'border-allow/30', label: 'Safety First' };
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="space-y-6">
        {/* Presets */}
        <div className="space-y-3">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Quick Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(presets).map(([key]) => (
              <button
                key={key}
                onClick={() => handlePreset(key)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                  activePreset === key
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : "bg-muted/30 border-border hover:bg-muted/50"
                )}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Posture Selection */}
        <div className="space-y-3">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Posture</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['AGGRESSIVE', 'BALANCED', 'CAUTIOUS'] as Posture[]).map(posture => {
              const cfg = getPostureConfig(posture);
              const Icon = cfg.icon;
              return (
                <button
                  key={posture}
                  onClick={() => updateConfig('posture', posture)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                    config.posture === posture
                      ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Limits */}
        <div className="space-y-4">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Spending Limits</Label>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Max Single Transaction</span>
                <span className="font-mono text-primary">${config.maxSingle.toLocaleString()}</span>
              </div>
              <Slider
                value={[config.maxSingle]}
                onValueChange={([v]) => updateConfig('maxSingle', v)}
                min={10}
                max={10000}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Max Daily</span>
                <span className="font-mono text-primary">${config.maxDaily.toLocaleString()}</span>
              </div>
              <Slider
                value={[config.maxDaily]}
                onValueChange={([v]) => updateConfig('maxDaily', v)}
                min={100}
                max={100000}
                step={100}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Max Weekly</span>
                <span className="font-mono text-primary">${config.maxWeekly.toLocaleString()}</span>
              </div>
              <Slider
                value={[config.maxWeekly]}
                onValueChange={([v]) => updateConfig('maxWeekly', v)}
                min={500}
                max={500000}
                step={500}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Human Approval Above</span>
                <span className="font-mono text-escalate">${config.requireHumanAbove.toLocaleString()}</span>
              </div>
              <Slider
                value={[config.requireHumanAbove]}
                onValueChange={([v]) => updateConfig('requireHumanAbove', v)}
                min={50}
                max={10000}
                step={50}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Counterparty Rules */}
        <div className="space-y-3">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Counterparty Rules</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm">New Counterparty Action</span>
              <div className="flex gap-1">
                {(['ALLOW', 'ESCALATE', 'BLOCK'] as const).map(action => (
                  <button
                    key={action}
                    onClick={() => updateConfig('newCounterpartyAction', action)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-mono transition-all",
                      config.newCounterpartyAction === action
                        ? action === 'ALLOW' ? 'bg-allow/20 text-allow'
                          : action === 'ESCALATE' ? 'bg-escalate/20 text-escalate'
                          : 'bg-block/20 text-block'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm">Require Verified Recipients</span>
              <Switch
                checked={config.requireVerified}
                onCheckedChange={(v) => updateConfig('requireVerified', v)}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-3">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Security & Monitoring</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm">Burst Detection</span>
              <Switch
                checked={config.burstDetection}
                onCheckedChange={(v) => updateConfig('burstDetection', v)}
              />
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex justify-between text-sm">
                <span>Min Confidence</span>
                <span className="font-mono text-primary">{(config.minConfidence * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={[config.minConfidence * 100]}
                onValueChange={([v]) => updateConfig('minConfidence', v / 100)}
                min={50}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm">Log Level</span>
              <div className="flex gap-1">
                {(['MINIMAL', 'STANDARD', 'VERBOSE'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => updateConfig('logLevel', level)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-mono transition-all",
                      config.logLevel === level
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated JSON */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-primary" />
            Generated xBPP Policy
          </Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLibraryOpen(true)} 
              className="h-8 px-2 relative"
            >
              <Library className="h-3 w-3 mr-1" />
              Library
              {savedCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {savedCount}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSaveDialogOpen(true)} 
              className="h-8 px-2"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2">
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 px-3">
              {copied ? <Check className="h-3 w-3 mr-1 text-allow" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <pre className="p-4 rounded-lg bg-background border border-border overflow-x-auto text-sm font-mono h-[520px] overflow-y-auto">
            <code className="text-muted-foreground">
              {generatedPolicy}
            </code>
          </pre>
          
          {/* Live indicator */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1 rounded bg-primary/10 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary">Live</span>
          </div>
        </div>

        {/* Policy Summary */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">This policy says:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• No single payment over <span className="text-foreground font-mono">${config.maxSingle.toLocaleString()}</span></li>
            <li>• No more than <span className="text-foreground font-mono">${config.maxDaily.toLocaleString()}</span> per day</li>
            <li>• Human approval for anything over <span className="text-foreground font-mono">${config.requireHumanAbove.toLocaleString()}</span></li>
            <li>• New vendors: <span className={cn(
              "font-mono",
              config.newCounterpartyAction === 'ALLOW' ? 'text-allow' :
              config.newCounterpartyAction === 'ESCALATE' ? 'text-escalate' : 'text-block'
            )}>{config.newCounterpartyAction}</span></li>
            {config.burstDetection && <li>• <span className="text-foreground">Burst detection</span> enabled</li>}
            {config.requireVerified && <li>• Only <span className="text-foreground">verified recipients</span></li>}
          </ul>
        </div>

        {/* Test This Policy Button */}
        <Button 
          onClick={handleTestPolicy} 
          className="w-full group text-base py-6 relative overflow-hidden"
          size="lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Play className="h-5 w-5" />
            Test This Policy
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Run your custom policy against real-world scenarios
        </p>
      </div>

      <PolicyLibraryDrawer
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onLoadPolicy={handleLoadPolicy}
      />

      <SavePolicyDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSavePolicy}
        config={config}
      />
    </div>
  );
}
