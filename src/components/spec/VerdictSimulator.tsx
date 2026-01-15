import { useState, useMemo } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, DollarSign, User, Zap, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PolicyConfig, Posture, DecisionType, ReasonCode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VerdictSimulatorProps {
  config: PolicyConfig;
}

interface SimulationResult {
  verdict: DecisionType;
  reasonCodes: ReasonCode[];
  explanation: string;
}

const getPostureConfig = (posture: Posture) => {
  switch (posture) {
    case 'AGGRESSIVE':
      return { icon: Zap, color: 'text-escalate', bg: 'bg-escalate/10' };
    case 'BALANCED':
      return { icon: Shield, color: 'text-primary', bg: 'bg-primary/10' };
    case 'CAUTIOUS':
      return { icon: AlertTriangle, color: 'text-allow', bg: 'bg-allow/10' };
  }
};

function evaluatePolicy(
  config: PolicyConfig,
  amount: number,
  isNewCounterparty: boolean,
  isVerified: boolean,
  dailySpent: number,
  confidence: number
): SimulationResult {
  const reasonCodes: ReasonCode[] = [];
  let verdict: DecisionType = 'ALLOW';
  const explanations: string[] = [];

  // Check single transaction limit
  if (amount > config.maxSingle) {
    reasonCodes.push('EXCEEDS_SINGLE_LIMIT');
    verdict = 'BLOCK';
    explanations.push(`Amount $${amount.toLocaleString()} exceeds max single limit of $${config.maxSingle.toLocaleString()}`);
  }

  // Check daily limit
  if (dailySpent + amount > config.maxDaily) {
    reasonCodes.push('EXCEEDS_DAILY_LIMIT');
    verdict = 'BLOCK';
    explanations.push(`Would exceed daily limit of $${config.maxDaily.toLocaleString()}`);
  }

  // Check human approval threshold (only if not already blocked)
  if (verdict === 'ALLOW' && amount > config.requireHumanAbove) {
    reasonCodes.push('HIGH_VALUE');
    verdict = 'ESCALATE';
    explanations.push(`Amount exceeds human approval threshold of $${config.requireHumanAbove.toLocaleString()}`);
  }

  // Check new counterparty
  if (isNewCounterparty && verdict === 'ALLOW') {
    reasonCodes.push('NEW_COUNTERPARTY');
    if (config.newCounterpartyAction === 'BLOCK') {
      verdict = 'BLOCK';
      explanations.push('New counterparties are blocked');
    } else if (config.newCounterpartyAction === 'ESCALATE') {
      verdict = 'ESCALATE';
      explanations.push('New counterparty requires human approval');
    }
  }

  // Check verification requirement
  if (config.requireVerified && !isVerified && verdict === 'ALLOW') {
    reasonCodes.push('UNVERIFIED_MERCHANT');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      explanations.push('Unverified recipient blocked (CAUTIOUS posture)');
    } else {
      verdict = 'ESCALATE';
      explanations.push('Unverified recipient requires approval');
    }
  }

  // Check confidence
  if (confidence < config.minConfidence && verdict === 'ALLOW') {
    reasonCodes.push('LOW_CONFIDENCE');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      explanations.push(`Confidence ${(confidence * 100).toFixed(0)}% below minimum ${(config.minConfidence * 100).toFixed(0)}%`);
    } else if (config.posture === 'BALANCED') {
      verdict = 'ESCALATE';
      explanations.push(`Low confidence requires human review`);
    }
  }

  // If no issues, allow
  if (reasonCodes.length === 0) {
    explanations.push('Transaction passes all policy checks');
  }

  return {
    verdict,
    reasonCodes,
    explanation: explanations.join('. '),
  };
}

export function VerdictSimulator({ config }: VerdictSimulatorProps) {
  const [amount, setAmount] = useState('250');
  const [isNewCounterparty, setIsNewCounterparty] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [dailySpent, setDailySpent] = useState('0');
  const [confidence, setConfidence] = useState('0.85');
  const [hasRun, setHasRun] = useState(false);

  const result = useMemo(() => {
    if (!hasRun) return null;
    return evaluatePolicy(
      config,
      parseFloat(amount) || 0,
      isNewCounterparty,
      isVerified,
      parseFloat(dailySpent) || 0,
      parseFloat(confidence) || 0.85
    );
  }, [config, amount, isNewCounterparty, isVerified, dailySpent, confidence, hasRun]);

  const handleRun = () => {
    setHasRun(true);
  };

  const postureConfig = getPostureConfig(config.posture);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Testing against policy with:</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className={cn("px-2 py-0.5 rounded font-mono", postureConfig.bg, postureConfig.color)}>
            {config.posture}
          </span>
          <span className="text-muted-foreground">Max: <span className="text-foreground font-mono">${config.maxSingle.toLocaleString()}</span></span>
          <span className="text-muted-foreground">Daily: <span className="text-foreground font-mono">${config.maxDaily.toLocaleString()}</span></span>
          <span className="text-muted-foreground">Human above: <span className="text-foreground font-mono">${config.requireHumanAbove.toLocaleString()}</span></span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Transaction Details</h4>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Transaction Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setHasRun(false); }}
                className="bg-muted/30 font-mono"
                placeholder="250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailySpent" className="text-sm">Already Spent Today</Label>
              <Input
                id="dailySpent"
                type="number"
                value={dailySpent}
                onChange={(e) => { setDailySpent(e.target.value); setHasRun(false); }}
                className="bg-muted/30 font-mono"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidence" className="text-sm">Agent Confidence (0-1)</Label>
              <Input
                id="confidence"
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={confidence}
                onChange={(e) => { setConfidence(e.target.value); setHasRun(false); }}
                className="bg-muted/30 font-mono"
                placeholder="0.85"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <Label htmlFor="newCounterparty" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                New Counterparty
              </Label>
              <Switch
                id="newCounterparty"
                checked={isNewCounterparty}
                onCheckedChange={(v) => { setIsNewCounterparty(v); setHasRun(false); }}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <Label htmlFor="verified" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Verified Recipient
              </Label>
              <Switch
                id="verified"
                checked={isVerified}
                onCheckedChange={(v) => { setIsVerified(v); setHasRun(false); }}
              />
            </div>
          </div>

          <Button onClick={handleRun} className="w-full" size="lg">
            <Play className="h-4 w-4 mr-2" />
            Evaluate Transaction
          </Button>
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Verdict</h4>
          
          {!hasRun ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground text-sm">Click "Evaluate" to see the verdict</p>
            </div>
          ) : result && (
            <div className="space-y-4">
              {/* Verdict Display */}
              <div className={cn(
                "p-6 rounded-xl border-2 text-center",
                result.verdict === 'ALLOW' && "bg-allow/10 border-allow/50",
                result.verdict === 'BLOCK' && "bg-block/10 border-block/50",
                result.verdict === 'ESCALATE' && "bg-escalate/10 border-escalate/50"
              )}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  {result.verdict === 'ALLOW' && <CheckCircle className="h-8 w-8 text-allow" />}
                  {result.verdict === 'BLOCK' && <XCircle className="h-8 w-8 text-block" />}
                  {result.verdict === 'ESCALATE' && <AlertCircle className="h-8 w-8 text-escalate" />}
                  <span className={cn(
                    "text-3xl font-mono font-bold",
                    result.verdict === 'ALLOW' && "text-allow",
                    result.verdict === 'BLOCK' && "text-block",
                    result.verdict === 'ESCALATE' && "text-escalate"
                  )}>
                    {result.verdict}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              </div>

              {/* Reason Codes */}
              {result.reasonCodes.length > 0 && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Reason Codes</p>
                  <div className="flex flex-wrap gap-2">
                    {result.reasonCodes.map((code) => (
                      <span
                        key={code}
                        className={cn(
                          "px-2 py-1 rounded text-xs font-mono",
                          result.verdict === 'ALLOW' && "bg-allow/20 text-allow",
                          result.verdict === 'BLOCK' && "bg-block/20 text-block",
                          result.verdict === 'ESCALATE' && "bg-escalate/20 text-escalate"
                        )}
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
