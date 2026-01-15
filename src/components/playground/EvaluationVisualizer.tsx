import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Play, RotateCcw, Zap, Shield, Eye, DollarSign, Copy, UserCheck, Gauge, Bell, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EvaluationPhase {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const evaluationPhases: EvaluationPhase[] = [
  { id: 'validation', name: 'Validation', description: 'Schema & format checks', icon: CheckCircle2 },
  { id: 'emergency', name: 'Emergency', description: 'Kill switch & sanctions', icon: Shield },
  { id: 'input', name: 'Input Validation', description: 'Amount & currency checks', icon: Eye },
  { id: 'core-limits', name: 'Core Limits', description: 'Budget enforcement', icon: DollarSign },
  { id: 'duplicate', name: 'Duplicate', description: 'Replay detection', icon: Copy },
  { id: 'verification', name: 'Verification', description: 'Counterparty checks', icon: UserCheck },
  { id: 'profile', name: 'Profile', description: 'Chain & rate rules', icon: Gauge },
  { id: 'escalation', name: 'Escalation', description: 'Human review triggers', icon: Bell },
  { id: 'final', name: 'Final Decision', description: 'Verdict generation', icon: Scale },
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

interface EvaluationState {
  currentPhase: number;
  results: Record<string, 'pass' | 'fail' | 'pending' | 'skip'>;
  verdict: 'ALLOW' | 'BLOCK' | 'ESCALATE' | null;
  reasons: string[];
}

interface Props {
  selectedTx: Transaction | null;
  evaluationState: EvaluationState;
  isEvaluating: boolean;
  onReset: () => void;
}

export function EvaluationVisualizer({ selectedTx, evaluationState, isEvaluating, onReset }: Props) {
  const getVerdictColor = (verdict: string | null) => {
    if (verdict === 'ALLOW') return 'text-allow';
    if (verdict === 'BLOCK') return 'text-block';
    if (verdict === 'ESCALATE') return 'text-escalate';
    return 'text-muted-foreground';
  };

  const getPhaseColor = (status: 'pass' | 'fail' | 'pending' | 'skip' | undefined, isActive: boolean) => {
    if (isActive) return 'border-primary bg-primary/20';
    if (status === 'pass') return 'border-allow/50 bg-allow/10';
    if (status === 'fail') return 'border-block/50 bg-block/10';
    if (status === 'skip') return 'border-muted-foreground/30 bg-muted/30';
    return 'border-border/50 bg-muted/20';
  };

  const getPhaseIconColor = (status: 'pass' | 'fail' | 'pending' | 'skip' | undefined, isActive: boolean) => {
    if (isActive) return 'text-primary';
    if (status === 'pass') return 'text-allow';
    if (status === 'fail') return 'text-block';
    return 'text-muted-foreground/50';
  };

  if (!selectedTx) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6"
        >
          <Play className="h-10 w-10 text-primary/60" />
        </motion.div>
        <p className="text-lg text-muted-foreground mb-2">Select a transaction</p>
        <p className="text-sm text-muted-foreground/60">Watch the 9-phase evaluation unfold</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Evaluating Transaction</span>
          {isEvaluating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-mono font-bold">${selectedTx.amount}</span>
          <span className="text-muted-foreground">{selectedTx.currency}</span>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-mono">{selectedTx.counterparty}</span>
          <Badge variant="outline" className={selectedTx.isNew ? 'border-escalate/50 text-escalate' : 'border-allow/50 text-allow'}>
            {selectedTx.isNew ? 'New' : 'Known'}
          </Badge>
        </div>
      </motion.div>

      {/* Phase Pipeline Visualization */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-[22px] top-[24px] bottom-[24px] w-0.5 bg-border/30" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute left-[22px] top-[24px] w-0.5 bg-gradient-to-b from-primary to-primary/50"
          initial={{ height: 0 }}
          animate={{ 
            height: evaluationState.currentPhase >= 0 
              ? `${Math.min(100, ((evaluationState.currentPhase + 1) / evaluationPhases.length) * 100)}%`
              : 0 
          }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="space-y-2">
          {evaluationPhases.map((phase, index) => {
            const status = evaluationState.results[phase.id];
            const isActive = evaluationState.currentPhase === index;
            const isPast = evaluationState.currentPhase > index;
            const isFuture = evaluationState.currentPhase < index;
            const PhaseIcon = phase.icon;
            
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0.5, x: -10 }}
                animate={{ 
                  opacity: isFuture && evaluationState.currentPhase >= 0 ? 0.4 : 1,
                  x: 0,
                  scale: isActive ? 1.02 : 1
                }}
                transition={{ 
                  duration: 0.3,
                  delay: isPast ? 0 : index * 0.05
                }}
                className={cn(
                  "relative flex items-center gap-4 p-3 rounded-xl border transition-all",
                  getPhaseColor(status, isActive)
                )}
              >
                {/* Phase Icon */}
                <motion.div 
                  className={cn(
                    "relative z-10 w-11 h-11 rounded-xl flex items-center justify-center border",
                    isActive ? "bg-primary/20 border-primary" :
                    status === 'pass' ? "bg-allow/20 border-allow/50" :
                    status === 'fail' ? "bg-block/20 border-block/50" :
                    "bg-muted/50 border-border"
                  )}
                  animate={isActive ? { 
                    boxShadow: ['0 0 0 0 rgba(var(--primary), 0)', '0 0 0 8px rgba(var(--primary), 0.1)', '0 0 0 0 rgba(var(--primary), 0)']
                  } : {}}
                  transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                >
                  {isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <PhaseIcon className="h-5 w-5 text-primary" />
                    </motion.div>
                  ) : status === 'pass' ? (
                    <CheckCircle2 className="h-5 w-5 text-allow" />
                  ) : status === 'fail' ? (
                    <XCircle className="h-5 w-5 text-block" />
                  ) : (
                    <PhaseIcon className={cn("h-5 w-5", getPhaseIconColor(status, isActive))} />
                  )}
                </motion.div>

                {/* Phase Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{phase.name}</span>
                    <span className="text-xs text-muted-foreground/60 font-mono">#{index + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{phase.description}</p>
                </div>

                {/* Status Badge */}
                <AnimatePresence mode="wait">
                  {isPast && status && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs font-mono",
                          status === 'pass' && "border-allow/50 text-allow bg-allow/10",
                          status === 'fail' && "border-block/50 text-block bg-block/10",
                          status === 'skip' && "border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        {status === 'pass' ? '✓ PASS' : status === 'fail' ? '✗ FAIL' : 'SKIP'}
                      </Badge>
                    </motion.div>
                  )}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 text-xs">
                        CHECKING...
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Final Verdict */}
      <AnimatePresence>
        {evaluationState.verdict && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={cn(
              "p-6 rounded-2xl border-2 text-center",
              evaluationState.verdict === 'ALLOW' && "bg-gradient-to-br from-allow/20 to-allow/5 border-allow",
              evaluationState.verdict === 'BLOCK' && "bg-gradient-to-br from-block/20 to-block/5 border-block",
              evaluationState.verdict === 'ESCALATE' && "bg-gradient-to-br from-escalate/20 to-escalate/5 border-escalate"
            )}
          >
            <motion.p 
              className={cn("text-4xl font-mono font-bold tracking-tight", getVerdictColor(evaluationState.verdict))}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              {evaluationState.verdict}
            </motion.p>
            
            {evaluationState.reasons.length > 0 && (
              <motion.div 
                className="mt-4 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {evaluationState.reasons.map((reason, i) => (
                  <motion.div
                    key={reason}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <Badge variant="outline" className="font-mono text-xs bg-background/50">
                      {reason}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Evaluate Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
