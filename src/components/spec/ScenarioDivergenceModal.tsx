import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Shield,
  Zap,
  PenTool,
  Clock,
  Layers,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Posture, Category, ReasonCode } from '@/lib/types';
import { 
  evaluateTransaction, 
  getPostureDefaults, 
  ExtendedPolicyConfig,
  EvaluationResult,
  TransactionInput,
  getReasonCodeInfo,
} from '@/lib/xbppEvaluator';

// Define the 9 evaluation phases from xBPP spec
const EVALUATION_PHASES = [
  { id: 1, name: 'Schema Validation', key: 'Phase 1' },
  { id: 2, name: 'Emergency Checks', key: 'Phase 2' },
  { id: 3, name: 'Input Validation', key: 'Phase 3' },
  { id: 4, name: 'Core Limits', key: 'Phase 4' },
  { id: 5, name: 'Duplicate Detection', key: 'Phase 5' },
  { id: 6, name: 'Verification', key: 'Phase 6' },
  { id: 7, name: 'Profile Checks', key: 'Phase 7' },
  { id: 8, name: 'Escalation Triggers', key: 'Phase 8' },
  { id: 9, name: 'Final Decision', key: 'Phase 9' },
];

const POSTURE_COLORS: Record<Posture, { bg: string; text: string; border: string }> = {
  CAUTIOUS: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  BALANCED: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  AGGRESSIVE: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
};

const VERDICT_CONFIG = {
  ALLOW: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  BLOCK: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  ESCALATE: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
};

const categoryIcons: Record<Category, React.ReactNode> = {
  SPEND: <Zap className="h-4 w-4" />,
  SIGN: <PenTool className="h-4 w-4" />,
  DEFENSE: <Shield className="h-4 w-4" />,
};

interface Scenario {
  id: string;
  name: string;
  category: Category;
  narrative?: string;
  xbpp_context?: any;
}


interface ScenarioDivergenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario | null;
  postures: Posture[];
  scenarioToTransactionInput: (scenario: Scenario) => TransactionInput;
}

export function ScenarioDivergenceModal({
  isOpen,
  onClose,
  scenario,
  postures,
  scenarioToTransactionInput,
}: ScenarioDivergenceModalProps) {
  // Run full evaluation for each posture
  const evaluations = useMemo(() => {
    if (!scenario || postures.length === 0) return [];

    return postures.map((posture) => {
      const postureDefaults = getPostureDefaults(posture);
      const limits = posture === 'CAUTIOUS'
        ? { maxSingle: 1000, maxDaily: 5000, maxWeekly: 20000, requireHumanAbove: 500 }
        : posture === 'BALANCED'
        ? { maxSingle: 5000, maxDaily: 25000, maxWeekly: 100000, requireHumanAbove: 2500 }
        : { maxSingle: 25000, maxDaily: 100000, maxWeekly: 500000, requireHumanAbove: 10000 };

      const config: ExtendedPolicyConfig = {
        posture,
        ...limits,
        newCounterpartyAction: posture === 'CAUTIOUS' ? 'BLOCK' : posture === 'BALANCED' ? 'ESCALATE' : 'ALLOW',
        requireVerified: posture !== 'AGGRESSIVE',
        burstDetection: posture !== 'AGGRESSIVE',
        minConfidence: postureDefaults.minConfidence,
        logLevel: 'STANDARD',
        ...postureDefaults,
      };

      const input = scenarioToTransactionInput(scenario);
      const result = evaluateTransaction(input, config);

      return { posture, result, config, input };
    });
  }, [scenario, postures, scenarioToTransactionInput]);

  // Determine which phase terminated evaluation for each posture
  const getTerminatingPhase = (result: EvaluationResult): number => {
    const phaseMatch = result.phase.match(/Phase (\d+)/);
    return phaseMatch ? parseInt(phaseMatch[1], 10) : 9;
  };

  // Get all unique reason codes across evaluations
  const allReasonCodes = useMemo(() => {
    const codes = new Set<ReasonCode>();
    evaluations.forEach(e => e.result.reasonCodes.forEach(c => codes.add(c)));
    return Array.from(codes);
  }, [evaluations]);

  // Check if there's divergence
  const hasDivergence = useMemo(() => {
    const verdicts = evaluations.map(e => e.result.verdict);
    return new Set(verdicts).size > 1;
  }, [evaluations]);

  if (!scenario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                {categoryIcons[scenario.category]}
                <span>{scenario.category}</span>
                {hasDivergence && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="text-red-400 border-red-500/30 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Divergent Outcomes
                    </Badge>
                  </>
                )}
              </div>
              <DialogTitle className="text-xl font-bold">
                {scenario.name}
              </DialogTitle>
              {scenario.narrative && (
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {scenario.narrative}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Verdict Summary Row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${evaluations.length}, 1fr)` }}>
              {evaluations.map(({ posture, result }) => {
                const VerdictIcon = VERDICT_CONFIG[result.verdict].icon;
                return (
                  <motion.div
                    key={posture}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "rounded-lg border-2 p-4 text-center",
                      POSTURE_COLORS[posture].bg,
                      POSTURE_COLORS[posture].border
                    )}
                  >
                    <Badge 
                      variant="outline" 
                      className={cn("mb-3 font-mono", POSTURE_COLORS[posture].text, POSTURE_COLORS[posture].border)}
                    >
                      {posture}
                    </Badge>
                    <div className={cn(
                      "flex items-center justify-center gap-2 text-2xl font-bold",
                      VERDICT_CONFIG[result.verdict].color
                    )}>
                      <VerdictIcon className="h-6 w-6" />
                      {result.verdict}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Terminated at {result.phase}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Phase-by-Phase Comparison */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                9-Phase Evaluation Sequence
              </h3>
              
              <div className="space-y-2">
                {EVALUATION_PHASES.map((phase, phaseIdx) => {
                  // Determine status for each posture at this phase
                  const phaseStatuses = evaluations.map(({ posture, result }) => {
                    const terminatingPhase = getTerminatingPhase(result);
                    const isPassed = phase.id < terminatingPhase || (phase.id === terminatingPhase && result.verdict === 'ALLOW');
                    const isCurrent = phase.id === terminatingPhase;
                    
                    // Get checks relevant to this phase
                    const phaseChecks = result.checksPerformed.filter(c => {
                      // Map checks to phases (simplified)
                      const checkPhaseMap: Record<string, number[]> = {
                        'kill_switch': [2],
                        'confidence_range': [3],
                        'value_valid': [3],
                        'single_limit': [4],
                        'daily_limit': [4],
                        'weekly_limit': [7],
                        'monthly_limit': [7],
                        'rate_limits': [7],
                        'burst_detection': [7],
                        'gas_buffer': [7],
                        'chain_check': [7],
                        'cross_chain': [7],
                        'bridge_check': [7],
                        'counterparty_check': [7],
                        'agent_to_agent': [7],
                        'contract_age': [7],
                        'security_threats': [7],
                        'recurring_check': [7],
                        'fragmentation': [7],
                        'confidence_check': [7],
                        'escalation_trigger': [8],
                      };
                      return checkPhaseMap[c]?.includes(phase.id);
                    });

                    const passedChecks = phaseChecks.filter(c => result.checksPassed.includes(c));
                    const failedChecks = phaseChecks.filter(c => result.checksFailed.includes(c));

                    return {
                      posture,
                      passed: isPassed || (isCurrent && result.verdict !== 'BLOCK'),
                      isTerminating: isCurrent && result.verdict !== 'ALLOW',
                      verdict: isCurrent ? result.verdict : null,
                      checksPerformed: phaseChecks.length,
                      checksPassed: passedChecks.length,
                      checksFailed: failedChecks.length,
                      failedCheckNames: failedChecks,
                    };
                  });

                  const hasAnyActivity = phaseStatuses.some(s => s.checksPerformed > 0 || s.isTerminating);

                  return (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: phaseIdx * 0.05 }}
                      className={cn(
                        "grid gap-3 p-3 rounded-lg border",
                        hasAnyActivity ? "border-border/50 bg-muted/20" : "border-border/20"
                      )}
                      style={{ gridTemplateColumns: `140px repeat(${evaluations.length}, 1fr)` }}
                    >
                      {/* Phase Label */}
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          hasAnyActivity ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {phase.id}
                        </div>
                        <span className={cn(
                          "text-sm font-medium truncate",
                          !hasAnyActivity && "text-muted-foreground"
                        )}>
                          {phase.name}
                        </span>
                      </div>

                      {/* Posture Results */}
                      {phaseStatuses.map((status, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {status.isTerminating ? (
                            <div className={cn(
                              "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium",
                              VERDICT_CONFIG[status.verdict!].bg,
                              VERDICT_CONFIG[status.verdict!].color
                            )}>
                              {status.verdict === 'BLOCK' && <XCircle className="h-3.5 w-3.5" />}
                              {status.verdict === 'ESCALATE' && <AlertTriangle className="h-3.5 w-3.5" />}
                              <span>Terminated</span>
                            </div>
                          ) : status.checksPerformed > 0 ? (
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex items-center gap-1 text-green-400">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>{status.checksPassed}</span>
                              </div>
                              {status.checksFailed > 0 && (
                                <div className="flex items-center gap-1 text-red-400">
                                  <XCircle className="h-3 w-3" />
                                  <span>{status.checksFailed}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">—</span>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Reason Codes Comparison */}
            {allReasonCodes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Reason Codes Triggered
                </h3>
                
                <div className="space-y-2">
                  {allReasonCodes.map(code => {
                    const codeInfo = getReasonCodeInfo(code);
                    return (
                      <div 
                        key={code}
                        className="grid gap-3 p-3 rounded-lg border border-border/50 bg-muted/20"
                        style={{ gridTemplateColumns: `200px 1fr repeat(${evaluations.length}, 80px)` }}
                      >
                        <div>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {code}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {codeInfo?.description || 'Unknown reason code'}
                        </div>
                        {evaluations.map(({ posture, result }) => (
                          <div key={posture} className="flex justify-center">
                            {result.reasonCodes.includes(code) ? (
                              <CheckCircle2 className="h-4 w-4 text-amber-400" />
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Explanation Comparison */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Evaluation Explanations
              </h3>
              
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${evaluations.length}, 1fr)` }}>
                {evaluations.map(({ posture, result }) => (
                  <div 
                    key={posture}
                    className={cn(
                      "rounded-lg border p-4 space-y-3",
                      POSTURE_COLORS[posture].border,
                      "bg-card"
                    )}
                  >
                    <Badge 
                      variant="outline" 
                      className={cn("font-mono", POSTURE_COLORS[posture].text, POSTURE_COLORS[posture].border)}
                    >
                      {posture}
                    </Badge>
                    
                    <div className="space-y-2">
                      {result.explanation.split('. ').filter(Boolean).map((exp, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Input Context */}
            {evaluations.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Transaction Context
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Amount', value: `$${evaluations[0].input.amount.toLocaleString()}` },
                      { label: 'Confidence', value: `${(evaluations[0].input.confidence * 100).toFixed(0)}%` },
                      { label: 'Chain', value: evaluations[0].input.chain },
                      { label: 'Daily Spent', value: `$${evaluations[0].input.dailySpent.toLocaleString()}` },
                      { label: 'New Counterparty', value: evaluations[0].input.isNewCounterparty ? 'Yes' : 'No' },
                      { label: 'Verified', value: evaluations[0].input.isVerified ? 'Yes' : 'No' },
                      { label: 'Gas Estimate', value: `$${evaluations[0].input.gasEstimate}` },
                      { label: 'Actions/Min', value: evaluations[0].input.actionsThisMinute.toString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="font-mono text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
