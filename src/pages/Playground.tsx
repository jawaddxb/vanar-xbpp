import { SEOHead } from '@/components/seo';
import { useState, useEffect } from 'react';
import { Play, Settings, Zap, CheckCircle2, XCircle, AlertCircle, ChevronRight, RotateCcw, Plus, Bot, Plane, Code, TrendingUp, Headphones, ShoppingCart, Search, Cpu, Users } from 'lucide-react';
import { AnimatedBackground } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PolicyConfig } from '@/lib/types';
import { EvaluationVisualizer } from '@/components/playground';

const agentTemplates = [
  { id: 'travel', name: 'Travel Assistant', icon: Plane, maxSingle: 800, maxDaily: 2000, description: 'Books flights, hotels, rentals' },
  { id: 'developer', name: 'Developer Agent', icon: Code, maxSingle: 100, maxDaily: 500, description: 'Provisions cloud resources' },
  { id: 'trading', name: 'Trading Agent', icon: TrendingUp, maxSingle: 5000, maxDaily: 50000, description: 'Executes DeFi trades' },
  { id: 'support', name: 'Customer Service', icon: Headphones, maxSingle: 50, maxDaily: 500, description: 'Issues refunds' },
  { id: 'procurement', name: 'Procurement', icon: ShoppingCart, maxSingle: 1000, maxDaily: 10000, description: 'Orders supplies' },
  { id: 'research', name: 'Research Agent', icon: Search, maxSingle: 10, maxDaily: 100, description: 'Pays for data/APIs' },
  { id: 'iot', name: 'IoT Fleet', icon: Cpu, maxSingle: 1, maxDaily: 10, description: 'Micro-wallet devices' },
  { id: 'orchestrator', name: 'Orchestrator', icon: Users, maxSingle: 20, maxDaily: 200, description: 'Hires sub-agents' },
];

const evaluationPhases = [
  { id: 'validation', name: 'Validation', description: 'Schema & format checks' },
  { id: 'emergency', name: 'Emergency', description: 'Kill switch & sanctions' },
  { id: 'input', name: 'Input Validation', description: 'Amount & currency checks' },
  { id: 'core-limits', name: 'Core Limits', description: 'Budget enforcement' },
  { id: 'duplicate', name: 'Duplicate', description: 'Replay detection' },
  { id: 'verification', name: 'Verification', description: 'Counterparty checks' },
  { id: 'profile', name: 'Profile', description: 'Chain & rate rules' },
  { id: 'escalation', name: 'Escalation', description: 'Human review triggers' },
  { id: 'final', name: 'Final Decision', description: 'Verdict generation' },
];

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  counterparty: string;
  isNew: boolean;
  confidence: number;
  timestamp: Date;
}

export default function Playground() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('travel');
  const [config, setConfig] = useState<PolicyConfig>({
    posture: 'BALANCED',
    maxSingle: 800,
    maxDaily: 2000,
    maxWeekly: 10000,
    requireHumanAbove: 500,
    newCounterpartyAction: 'ESCALATE',
    requireVerified: false,
    burstDetection: false,
    minConfidence: 0.7,
    logLevel: 'STANDARD',
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 150, currency: 'USD', counterparty: '0xABC...123', isNew: false, confidence: 0.95, timestamp: new Date() },
    { id: '2', amount: 450, currency: 'USD', counterparty: '0xDEF...456', isNew: true, confidence: 0.82, timestamp: new Date() },
    { id: '3', amount: 1200, currency: 'USD', counterparty: '0xGHI...789', isNew: false, confidence: 0.91, timestamp: new Date() },
  ]);
  
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [evaluationState, setEvaluationState] = useState<{
    currentPhase: number;
    results: Record<string, 'pass' | 'fail' | 'pending' | 'skip'>;
    verdict: 'ALLOW' | 'BLOCK' | 'ESCALATE' | null;
    reasons: string[];
  }>({
    currentPhase: -1,
    results: {},
    verdict: null,
    reasons: [],
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [dailySpent, setDailySpent] = useState(0);

  // Update config when template changes
  useEffect(() => {
    const template = agentTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      setConfig(prev => ({
        ...prev,
        maxSingle: template.maxSingle,
        maxDaily: template.maxDaily,
      }));
    }
  }, [selectedTemplate]);

  const resetDaily = () => setDailySpent(0);

  const runEvaluation = async (tx: Transaction) => {
    setSelectedTx(tx);
    setIsEvaluating(true);
    setEvaluationState({ currentPhase: 0, results: {}, verdict: null, reasons: [] });

    const results: Record<string, 'pass' | 'fail' | 'pending' | 'skip'> = {};
    const reasons: string[] = [];
    let blocked = false;
    let escalated = false;

    for (let i = 0; i < evaluationPhases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 280));
      const phase = evaluationPhases[i];
      setEvaluationState(prev => ({ ...prev, currentPhase: i }));

      // Skip remaining phases if already blocked
      if (blocked && phase.id !== 'final') {
        results[phase.id] = 'skip';
        setEvaluationState(prev => ({ ...prev, results: { ...results } }));
        continue;
      }

      if (phase.id === 'validation') {
        results[phase.id] = 'pass';
      } else if (phase.id === 'emergency') {
        results[phase.id] = 'pass';
      } else if (phase.id === 'input') {
        if (tx.amount <= 0) {
          results[phase.id] = 'fail';
          reasons.push('INVALID_VALUE');
          blocked = true;
        } else {
          results[phase.id] = 'pass';
        }
      } else if (phase.id === 'core-limits') {
        if (tx.amount > config.maxSingle) {
          results[phase.id] = 'fail';
          reasons.push('EXCEEDS_SINGLE_LIMIT');
          blocked = true;
        } else if (dailySpent + tx.amount > config.maxDaily) {
          results[phase.id] = 'fail';
          reasons.push('EXCEEDS_DAILY_LIMIT');
          blocked = true;
        } else {
          results[phase.id] = 'pass';
        }
      } else if (phase.id === 'duplicate') {
        results[phase.id] = 'pass';
      } else if (phase.id === 'verification') {
        if (tx.isNew && config.newCounterpartyAction === 'BLOCK') {
          results[phase.id] = 'fail';
          reasons.push('NEW_COUNTERPARTY');
          blocked = true;
        } else if (tx.isNew && config.newCounterpartyAction === 'ESCALATE') {
          results[phase.id] = 'pass';
          reasons.push('NEW_COUNTERPARTY_REVIEW');
          escalated = true;
        } else if (config.requireVerified && tx.confidence < 0.8) {
          results[phase.id] = 'pass';
          reasons.push('VERIFICATION_REQUIRED');
          escalated = true;
        } else {
          results[phase.id] = 'pass';
        }
      } else if (phase.id === 'profile') {
        if (tx.confidence < config.minConfidence) {
          results[phase.id] = 'pass';
          reasons.push('LOW_CONFIDENCE');
          escalated = true;
        } else if (config.burstDetection && tx.amount > config.maxDaily * 0.8) {
          results[phase.id] = 'pass';
          reasons.push('BURST_DETECTED');
          escalated = true;
        } else {
          results[phase.id] = 'pass';
        }
      } else if (phase.id === 'escalation') {
        if (tx.amount > config.requireHumanAbove && !blocked && !escalated) {
          results[phase.id] = 'pass';
          reasons.push('HIGH_VALUE');
          escalated = true;
        } else {
          results[phase.id] = 'pass';
        }
      } else if (phase.id === 'final') {
        results[phase.id] = 'pass';
      }

      setEvaluationState(prev => ({ ...prev, results: { ...results }, reasons: [...reasons] }));
    }

    const verdict: 'ALLOW' | 'BLOCK' | 'ESCALATE' = blocked ? 'BLOCK' : escalated ? 'ESCALATE' : 'ALLOW';
    if (verdict === 'ALLOW') {
      setDailySpent(prev => prev + tx.amount);
    }
    setEvaluationState(prev => ({ ...prev, currentPhase: evaluationPhases.length, verdict }));
    setIsEvaluating(false);
  };

  const addTransaction = () => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: Math.floor(Math.random() * 2000) + 50,
      currency: 'USD',
      counterparty: `0x${Math.random().toString(16).slice(2, 5).toUpperCase()}...${Math.random().toString(16).slice(2, 5).toUpperCase()}`,
      isNew: Math.random() > 0.5,
      confidence: Math.random() * 0.4 + 0.6,
      timestamp: new Date(),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const getVerdictColor = (verdict: string | null) => {
    if (verdict === 'ALLOW') return 'text-allow';
    if (verdict === 'BLOCK') return 'text-block';
    if (verdict === 'ESCALATE') return 'text-escalate';
    return 'text-muted-foreground';
  };

  const getPhaseIcon = (status: 'pass' | 'fail' | 'pending' | 'skip' | undefined) => {
    if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-allow" />;
    if (status === 'fail') return <XCircle className="h-4 w-4 text-block" />;
    if (status === 'skip') return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
    return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 animate-pulse" />;
  };

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <SEOHead title="xBPP Playground — Build and Test Agent Payment Policies" description="Interactive playground to build, test, and simulate AI agent payment policies. See live verdicts: ALLOW, BLOCK, ESCALATE." path="/playground" />
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-[1600px] mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-2" style={{ fontFamily: "'Akira Expanded', 'Arial Black', sans-serif", color: '#282B35' }}>Interactive Playground</h1>
          <p className="text-muted-foreground">
            Configure an agent, inject transactions, and watch the 9-phase xBPP evaluation in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr_400px] gap-6">
          {/* Left Panel: Agent Builder */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5 text-primary" />
                <h2 className="font-medium">Agent Builder</h2>
              </div>

              {/* Template Selector */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Agent Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-[100]">
                    {agentTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <template.icon className="h-4 w-4" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {agentTemplates.find(t => t.id === selectedTemplate)?.description}
                </p>
              </div>

              {/* Posture */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Posture</label>
                <Select value={config.posture} onValueChange={(v: any) => setConfig(prev => ({ ...prev, posture: v }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-[100]">
                    <SelectItem value="CAUTIOUS">Cautious</SelectItem>
                    <SelectItem value="BALANCED">Balanced</SelectItem>
                    <SelectItem value="AGGRESSIVE">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Limits */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Max Single</span>
                    <span className="font-mono">${config.maxSingle}</span>
                  </div>
                  <Slider
                    value={[config.maxSingle]}
                    min={10}
                    max={10000}
                    step={10}
                    onValueChange={([v]) => setConfig(prev => ({ ...prev, maxSingle: v }))}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Max Daily</span>
                    <span className="font-mono">${config.maxDaily}</span>
                  </div>
                  <Slider
                    value={[config.maxDaily]}
                    min={100}
                    max={100000}
                    step={100}
                    onValueChange={([v]) => setConfig(prev => ({ ...prev, maxDaily: v }))}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Ask Human Above</span>
                    <span className="font-mono">${config.requireHumanAbove}</span>
                  </div>
                  <Slider
                    value={[config.requireHumanAbove]}
                    min={50}
                    max={5000}
                    step={50}
                    onValueChange={([v]) => setConfig(prev => ({ ...prev, requireHumanAbove: v }))}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Min Confidence</span>
                    <span className="font-mono">{(config.minConfidence * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[config.minConfidence * 100]}
                    min={50}
                    max={100}
                    step={5}
                    onValueChange={([v]) => setConfig(prev => ({ ...prev, minConfidence: v / 100 }))}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require Verified</span>
                  <Switch
                    checked={config.requireVerified}
                    onCheckedChange={v => setConfig(prev => ({ ...prev, requireVerified: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Burst Detection</span>
                  <Switch
                    checked={config.burstDetection}
                    onCheckedChange={v => setConfig(prev => ({ ...prev, burstDetection: v }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel: Transaction Stream */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="font-medium">Transaction Stream</h2>
                </div>
                <Button size="sm" variant="outline" onClick={addTransaction}>
                  <Plus className="h-4 w-4 mr-1" />
                  Inject
                </Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all cursor-pointer",
                      selectedTx?.id === tx.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 bg-muted/30 hover:bg-muted/50"
                    )}
                    onClick={() => runEvaluation(tx)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-lg">${tx.amount}</span>
                      <Badge variant="outline" className={tx.isNew ? 'border-escalate text-escalate' : ''}>
                        {tx.isNew ? 'New' : 'Known'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-mono">{tx.counterparty}</span>
                      <span>Confidence: {(tx.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Click a transaction to run the 9-phase evaluation
                </p>
              </div>
            </div>

            {/* Daily Budget */}
            <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Budget</span>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={resetDaily}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((dailySpent / config.maxDaily) * 100, 100)}%`,
                    background: dailySpent > config.maxDaily ? '#ef4444' : '#03D9AF',
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                ${dailySpent.toLocaleString()} spent / ${config.maxDaily.toLocaleString()} limit
              </p>
            </div>

            {/* Quick JSON Preview */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-xs font-mono text-muted-foreground mb-2">POLICY CONFIG</p>
              <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`{
  "posture": "${config.posture}",
  "max_single": ${config.maxSingle},
  "max_daily": ${config.maxDaily},
  "require_human_above": ${config.requireHumanAbove},
  "min_confidence": ${config.minConfidence}
}`}
              </pre>
            </div>
          </div>

          {/* Right Panel: Evaluation Visualizer */}
          <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-medium">9-Phase Evaluation</h2>
            </div>

            <EvaluationVisualizer 
              selectedTx={selectedTx}
              evaluationState={evaluationState}
              isEvaluating={isEvaluating}
              onReset={() => {
                setSelectedTx(null);
                setEvaluationState({
                  currentPhase: -1,
                  results: {},
                  verdict: null,
                  reasons: [],
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}