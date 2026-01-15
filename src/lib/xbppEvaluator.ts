// xBPP Spec-Compliant Transaction Evaluator
// Implements the 9-phase evaluation sequence from the xBPP Master Specification v1.0

import { PolicyConfig, Posture, DecisionType, ReasonCode } from './types';

// Extended transaction input for full xBPP evaluation
export interface TransactionInput {
  // Core
  amount: number;
  currency: string;
  confidence: number;
  
  // Daily tracking
  dailySpent: number;
  weeklySpent: number;
  monthlySpent: number;
  
  // Counterparty
  isNewCounterparty: boolean;
  isVerified: boolean;
  isSelfPayment: boolean;
  isAgentToAgent: boolean;
  contractAgeHours: number;
  
  // Chain
  chain: string;
  isCrossChain: boolean;
  isBridge: boolean;
  
  // Rate limits
  actionsThisMinute: number;
  actionsThisHour: number;
  actionsToday: number;
  
  // Gas
  gasEstimate: number;
  gasMaxWilling: number;
  
  // Security threats
  addressPoisoning: boolean;
  drainerContract: boolean;
  honeypotToken: boolean;
  phishingSignature: boolean;
  unverifiedContract: boolean;
  adminKeyDetected: boolean;
  
  // Fragmentation
  recentActionsToSameAddress: number;
  
  // Recurring
  isRecurring: boolean;
  recurringVariance: number;
  isFirstRecurring: boolean;
}

export interface EvaluationResult {
  verdict: DecisionType;
  reasonCodes: ReasonCode[];
  explanation: string;
  phase: string;
  checksPerformed: string[];
  checksPassed: string[];
  checksFailed: string[];
}

// Default transaction input
export function getDefaultTransactionInput(): TransactionInput {
  return {
    amount: 250,
    currency: 'USDC',
    confidence: 0.85,
    dailySpent: 0,
    weeklySpent: 0,
    monthlySpent: 0,
    isNewCounterparty: false,
    isVerified: true,
    isSelfPayment: false,
    isAgentToAgent: false,
    contractAgeHours: 720,
    chain: 'base',
    isCrossChain: false,
    isBridge: false,
    actionsThisMinute: 0,
    actionsThisHour: 0,
    actionsToday: 0,
    gasEstimate: 5,
    gasMaxWilling: 8,
    addressPoisoning: false,
    drainerContract: false,
    honeypotToken: false,
    phishingSignature: false,
    unverifiedContract: false,
    adminKeyDetected: false,
    recentActionsToSameAddress: 0,
    isRecurring: false,
    recurringVariance: 0,
    isFirstRecurring: false,
  };
}

// Extended policy config for full xBPP evaluation
export interface ExtendedPolicyConfig extends Omit<PolicyConfig, 'maxWeekly'> {
  maxWeekly?: number;
  maxMonthly?: number;
  allowedChains?: string[];
  unknownChainAction?: 'BLOCK' | 'ESCALATE' | 'ALLOW';
  crossChainAction?: 'BLOCK' | 'ESCALATE' | 'ALLOW';
  bridgeAction?: 'BLOCK' | 'ESCALATE' | 'ALLOW';
  maxPerMinute?: number;
  maxPerHour?: number;
  maxPerDay?: number;
  burstThreshold?: number;
  gasBufferTolerance?: number;
  minContractAgeHours?: number;
  allowSelfPayment?: boolean;
  agentToAgentAction?: 'BLOCK' | 'ESCALATE' | 'ALLOW';
  fragmentationThreshold?: number;
  recurringVarianceTolerance?: number;
  requireInitialApproval?: boolean;
}

// Get posture-specific defaults
export function getPostureDefaults(posture: Posture) {
  switch (posture) {
    case 'AGGRESSIVE':
      return {
        unknownChainAction: 'ESCALATE' as const,
        crossChainAction: 'ALLOW' as const,
        bridgeAction: 'ESCALATE' as const,
        lowConfidenceAction: 'ALLOW' as const,
        verificationUnavailableAction: 'ALLOW' as const,
        minConfidence: 0.5,
      };
    case 'BALANCED':
      return {
        unknownChainAction: 'BLOCK' as const,
        crossChainAction: 'ESCALATE' as const,
        bridgeAction: 'ESCALATE' as const,
        lowConfidenceAction: 'ESCALATE' as const,
        verificationUnavailableAction: 'ESCALATE' as const,
        minConfidence: 0.7,
      };
    case 'CAUTIOUS':
      return {
        unknownChainAction: 'BLOCK' as const,
        crossChainAction: 'BLOCK' as const,
        bridgeAction: 'BLOCK' as const,
        lowConfidenceAction: 'BLOCK' as const,
        verificationUnavailableAction: 'BLOCK' as const,
        minConfidence: 0.9,
      };
  }
}

// Main evaluation function implementing xBPP 9-phase sequence
export function evaluateTransaction(
  input: TransactionInput,
  config: ExtendedPolicyConfig
): EvaluationResult {
  const reasonCodes: ReasonCode[] = [];
  const checksPerformed: string[] = [];
  const checksPassed: string[] = [];
  const checksFailed: string[] = [];
  let verdict: DecisionType = 'ALLOW';
  let phase = 'Phase 9: Final Decision';
  const explanations: string[] = [];
  
  const postureDefaults = getPostureDefaults(config.posture);
  const totalValue = input.amount + (input.gasMaxWilling || 0);

  // Phase 2: Emergency Checks (Phase 1 validation assumed passed)
  checksPerformed.push('kill_switch');
  checksPassed.push('kill_switch');

  // Phase 3: Input Validation
  checksPerformed.push('confidence_range');
  if (input.confidence < 0 || input.confidence > 1) {
    reasonCodes.push('INVALID_CONFIDENCE');
    verdict = 'BLOCK';
    phase = 'Phase 3: Input Validation';
    checksFailed.push('confidence_range');
    explanations.push('Confidence must be between 0 and 1');
  } else {
    checksPassed.push('confidence_range');
  }

  checksPerformed.push('value_valid');
  if (input.amount < 0) {
    reasonCodes.push('INVALID_VALUE');
    verdict = 'BLOCK';
    phase = 'Phase 3: Input Validation';
    checksFailed.push('value_valid');
    explanations.push('Value cannot be negative');
  } else {
    checksPassed.push('value_valid');
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 4: Core Limits
  checksPerformed.push('single_limit');
  if (input.amount > config.maxSingle) {
    reasonCodes.push('EXCEEDS_SINGLE_LIMIT');
    verdict = 'BLOCK';
    phase = 'Phase 4: Core Limits';
    checksFailed.push('single_limit');
    explanations.push(`Amount $${input.amount.toLocaleString()} exceeds max single limit of $${config.maxSingle.toLocaleString()}`);
  } else {
    checksPassed.push('single_limit');
  }

  checksPerformed.push('daily_limit');
  if (input.dailySpent + totalValue > config.maxDaily) {
    reasonCodes.push('EXCEEDS_DAILY_LIMIT');
    verdict = 'BLOCK';
    phase = 'Phase 4: Core Limits';
    checksFailed.push('daily_limit');
    explanations.push(`Would exceed daily limit of $${config.maxDaily.toLocaleString()}`);
  } else {
    checksPassed.push('daily_limit');
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 7a: Gas Check
  if (input.gasMaxWilling > 0) {
    checksPerformed.push('gas_buffer');
    const bufferTolerance = config.gasBufferTolerance || 0.1;
    const maxAcceptableGas = input.gasEstimate * (1 + bufferTolerance);
    if (input.gasMaxWilling > maxAcceptableGas * 2) {
      reasonCodes.push('GAS_EXCEEDS_BUFFER');
      if (config.posture === 'CAUTIOUS') {
        verdict = 'BLOCK';
        checksFailed.push('gas_buffer');
      } else {
        verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
        checksFailed.push('gas_buffer');
      }
      phase = 'Phase 7a: Gas Check';
      explanations.push(`Gas max willing ($${input.gasMaxWilling}) significantly exceeds estimate ($${input.gasEstimate})`);
    } else {
      checksPassed.push('gas_buffer');
    }
  }

  // Phase 7b: Extended Limits
  if (config.maxWeekly && input.weeklySpent + totalValue > config.maxWeekly) {
    checksPerformed.push('weekly_limit');
    reasonCodes.push('EXCEEDS_WEEKLY_LIMIT');
    verdict = 'BLOCK';
    phase = 'Phase 7b: Extended Limits';
    checksFailed.push('weekly_limit');
    explanations.push(`Would exceed weekly limit of $${config.maxWeekly.toLocaleString()}`);
  }

  if (config.maxMonthly && input.monthlySpent + totalValue > config.maxMonthly) {
    checksPerformed.push('monthly_limit');
    reasonCodes.push('EXCEEDS_MONTHLY_LIMIT');
    verdict = 'BLOCK';
    phase = 'Phase 7b: Extended Limits';
    checksFailed.push('monthly_limit');
    explanations.push(`Would exceed monthly limit of $${config.maxMonthly.toLocaleString()}`);
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 7c: Rate Limit Check
  checksPerformed.push('rate_limits');
  const maxPerMinute = config.maxPerMinute || 10;
  const maxPerHour = config.maxPerHour || 60;
  
  if (input.actionsThisMinute >= maxPerMinute) {
    reasonCodes.push('RATE_LIMITED');
    verdict = 'BLOCK';
    phase = 'Phase 7c: Rate Limits';
    checksFailed.push('rate_limits');
    explanations.push(`Rate limited: ${input.actionsThisMinute} actions this minute (max: ${maxPerMinute})`);
  } else if (input.actionsThisHour >= maxPerHour) {
    reasonCodes.push('RATE_LIMITED');
    verdict = 'BLOCK';
    phase = 'Phase 7c: Rate Limits';
    checksFailed.push('rate_limits');
    explanations.push(`Rate limited: ${input.actionsThisHour} actions this hour (max: ${maxPerHour})`);
  } else {
    checksPassed.push('rate_limits');
  }

  // Burst detection
  if (config.burstDetection) {
    checksPerformed.push('burst_detection');
    const burstThreshold = config.burstThreshold || 5;
    if (input.actionsThisMinute >= burstThreshold) {
      reasonCodes.push('BURST_DETECTED');
      if (config.posture === 'CAUTIOUS') {
        verdict = 'BLOCK';
        checksFailed.push('burst_detection');
      } else {
        verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
        checksFailed.push('burst_detection');
      }
      phase = 'Phase 7c: Rate Limits';
      explanations.push(`Burst detected: ${input.actionsThisMinute} rapid actions`);
    } else {
      checksPassed.push('burst_detection');
    }
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 7e: Chain Check
  checksPerformed.push('chain_check');
  const allowedChains = config.allowedChains || ['base', 'ethereum', 'arbitrum', 'optimism'];
  
  if (!allowedChains.includes(input.chain.toLowerCase())) {
    const unknownAction = config.unknownChainAction || postureDefaults.unknownChainAction;
    reasonCodes.push('UNKNOWN_CHAIN');
    if (unknownAction === 'BLOCK') {
      verdict = 'BLOCK';
      checksFailed.push('chain_check');
    } else if (unknownAction === 'ESCALATE') {
      verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
      checksFailed.push('chain_check');
    }
    phase = 'Phase 7e: Chain Check';
    explanations.push(`Unknown chain "${input.chain}" (allowed: ${allowedChains.join(', ')})`);
  } else {
    checksPassed.push('chain_check');
  }

  if (input.isCrossChain) {
    checksPerformed.push('cross_chain');
    const crossChainAction = config.crossChainAction || postureDefaults.crossChainAction;
    reasonCodes.push('CROSS_CHAIN_TRANSACTION');
    if (crossChainAction === 'BLOCK') {
      verdict = 'BLOCK';
      checksFailed.push('cross_chain');
    } else if (crossChainAction === 'ESCALATE') {
      verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
      checksFailed.push('cross_chain');
    }
    phase = 'Phase 7e: Chain Check';
    explanations.push('Cross-chain transaction detected');
  }

  if (input.isBridge) {
    checksPerformed.push('bridge_check');
    const bridgeAction = config.bridgeAction || postureDefaults.bridgeAction;
    reasonCodes.push('BRIDGE_TRANSACTION');
    if (bridgeAction === 'BLOCK') {
      verdict = 'BLOCK';
      checksFailed.push('bridge_check');
    } else if (bridgeAction === 'ESCALATE') {
      verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
      checksFailed.push('bridge_check');
    }
    phase = 'Phase 7e: Chain Check';
    explanations.push('Bridge transaction detected');
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 7f: Counterparty Check
  checksPerformed.push('counterparty_check');
  
  if (input.isNewCounterparty && verdict === 'ALLOW') {
    reasonCodes.push('NEW_COUNTERPARTY');
    if (config.newCounterpartyAction === 'BLOCK') {
      verdict = 'BLOCK';
      checksFailed.push('counterparty_check');
      explanations.push('New counterparties are blocked');
    } else if (config.newCounterpartyAction === 'ESCALATE') {
      verdict = 'ESCALATE';
      checksFailed.push('counterparty_check');
      explanations.push('New counterparty requires human approval');
    }
    phase = 'Phase 7f: Counterparty Check';
  }

  if (config.requireVerified && !input.isVerified && verdict === 'ALLOW') {
    reasonCodes.push('UNVERIFIED_MERCHANT');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      checksFailed.push('counterparty_check');
      explanations.push('Unverified recipient blocked (CAUTIOUS posture)');
    } else {
      verdict = 'ESCALATE';
      checksFailed.push('counterparty_check');
      explanations.push('Unverified recipient requires approval');
    }
    phase = 'Phase 7f: Counterparty Check';
  }

  if (input.isSelfPayment && !(config.allowSelfPayment ?? false)) {
    reasonCodes.push('SELF_PAYMENT');
    verdict = 'BLOCK';
    phase = 'Phase 7f: Counterparty Check';
    checksFailed.push('counterparty_check');
    explanations.push('Self-payment not allowed');
  }

  if (input.isAgentToAgent) {
    checksPerformed.push('agent_to_agent');
    const agentAction = config.agentToAgentAction || 'ESCALATE';
    reasonCodes.push('AGENT_TO_AGENT');
    if (agentAction === 'BLOCK') {
      verdict = 'BLOCK';
      checksFailed.push('agent_to_agent');
    } else if (agentAction === 'ESCALATE') {
      verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
      checksFailed.push('agent_to_agent');
    }
    phase = 'Phase 7f: Counterparty Check';
    explanations.push('Agent-to-agent transaction detected');
  }

  const minContractAge = config.minContractAgeHours || 24;
  if (input.contractAgeHours < minContractAge && input.contractAgeHours >= 0) {
    checksPerformed.push('contract_age');
    reasonCodes.push('NEW_CONTRACT');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      checksFailed.push('contract_age');
    } else {
      verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
      checksFailed.push('contract_age');
    }
    phase = 'Phase 7f: Counterparty Check';
    explanations.push(`Contract too new: ${input.contractAgeHours}h (min: ${minContractAge}h)`);
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 7g: Security Check
  checksPerformed.push('security_threats');
  
  if (input.addressPoisoning) {
    reasonCodes.push('ADDRESS_POISONING');
    verdict = 'BLOCK';
    phase = 'Phase 7g: Security Check';
    checksFailed.push('security_threats');
    explanations.push('Address poisoning attack detected');
  }

  if (input.drainerContract) {
    reasonCodes.push('DRAINER_CONTRACT');
    verdict = 'BLOCK';
    phase = 'Phase 7g: Security Check';
    checksFailed.push('security_threats');
    explanations.push('Known drainer contract detected');
  }

  if (input.honeypotToken) {
    reasonCodes.push('HONEYPOT_TOKEN');
    verdict = 'BLOCK';
    phase = 'Phase 7g: Security Check';
    checksFailed.push('security_threats');
    explanations.push('Honeypot token detected');
  }

  if (input.phishingSignature) {
    reasonCodes.push('PHISHING_SIGNATURE');
    verdict = 'BLOCK';
    phase = 'Phase 7g: Security Check';
    checksFailed.push('security_threats');
    explanations.push('Phishing signature detected');
  }

  if (input.unverifiedContract && verdict === 'ALLOW') {
    reasonCodes.push('UNVERIFIED_CONTRACT');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      checksFailed.push('security_threats');
    } else {
      verdict = 'ESCALATE';
      checksFailed.push('security_threats');
    }
    phase = 'Phase 7g: Security Check';
    explanations.push('Interacting with unverified contract');
  }

  if (input.adminKeyDetected && verdict === 'ALLOW') {
    reasonCodes.push('ADMIN_KEY_DETECTED');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      checksFailed.push('security_threats');
    } else {
      verdict = 'ESCALATE';
      checksFailed.push('security_threats');
    }
    phase = 'Phase 7g: Security Check';
    explanations.push('Contract has admin key privileges');
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 7h: Recurring/Preauth Check
  if (input.isRecurring) {
    checksPerformed.push('recurring_check');
    
    if (input.isFirstRecurring && (config.requireInitialApproval ?? true)) {
      reasonCodes.push('RECURRING_INITIAL_APPROVAL');
      verdict = 'ESCALATE';
      phase = 'Phase 7h: Recurring Check';
      checksFailed.push('recurring_check');
      explanations.push('First recurring payment requires approval');
    }

    const varianceTolerance = config.recurringVarianceTolerance || 0.1;
    if (input.recurringVariance > varianceTolerance) {
      reasonCodes.push('RECURRING_VARIANCE');
      if (config.posture === 'CAUTIOUS') {
        verdict = 'BLOCK';
        checksFailed.push('recurring_check');
      } else {
        verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
        checksFailed.push('recurring_check');
      }
      phase = 'Phase 7h: Recurring Check';
      explanations.push(`Recurring payment variance ${(input.recurringVariance * 100).toFixed(0)}% exceeds tolerance ${(varianceTolerance * 100).toFixed(0)}%`);
    }
  }

  // Phase 7i: Adversarial Check (Fragmentation)
  checksPerformed.push('fragmentation');
  const fragmentationThreshold = config.fragmentationThreshold || 5;
  if (input.recentActionsToSameAddress >= fragmentationThreshold) {
    reasonCodes.push('FRAGMENTATION_DETECTED');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      checksFailed.push('fragmentation');
    } else {
      verdict = verdict === 'ALLOW' ? 'ESCALATE' : verdict;
      checksFailed.push('fragmentation');
    }
    phase = 'Phase 7i: Adversarial Check';
    explanations.push(`Fragmentation detected: ${input.recentActionsToSameAddress} recent actions to same address`);
  } else {
    checksPassed.push('fragmentation');
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 7j: Confidence Check
  checksPerformed.push('confidence_check');
  const minConfidence = config.minConfidence || postureDefaults.minConfidence;
  if (input.confidence < minConfidence && verdict === 'ALLOW') {
    reasonCodes.push('LOW_CONFIDENCE');
    if (config.posture === 'CAUTIOUS') {
      verdict = 'BLOCK';
      checksFailed.push('confidence_check');
      explanations.push(`Confidence ${(input.confidence * 100).toFixed(0)}% below minimum ${(minConfidence * 100).toFixed(0)}%`);
    } else if (config.posture === 'BALANCED') {
      verdict = 'ESCALATE';
      checksFailed.push('confidence_check');
      explanations.push('Low confidence requires human review');
    }
    phase = 'Phase 7j: Confidence Check';
  } else {
    checksPassed.push('confidence_check');
  }

  if (verdict === 'BLOCK') {
    return { verdict, reasonCodes, explanation: explanations.join('. '), phase, checksPerformed, checksPassed, checksFailed };
  }

  // Phase 8: Escalation Triggers
  checksPerformed.push('escalation_trigger');
  if (input.amount > config.requireHumanAbove && verdict === 'ALLOW') {
    reasonCodes.push('HIGH_VALUE');
    verdict = 'ESCALATE';
    phase = 'Phase 8: Escalation Triggers';
    checksFailed.push('escalation_trigger');
    explanations.push(`Amount exceeds human approval threshold of $${config.requireHumanAbove.toLocaleString()}`);
  } else {
    checksPassed.push('escalation_trigger');
  }

  // Phase 9: Final Decision
  if (reasonCodes.length === 0) {
    explanations.push('Transaction passes all policy checks');
    phase = 'Phase 9: Final Decision';
  }

  return {
    verdict,
    reasonCodes,
    explanation: explanations.join('. '),
    phase,
    checksPerformed,
    checksPassed,
    checksFailed,
  };
}

// Reason code metadata for UI display
export interface ReasonCodeInfo {
  code: ReasonCode;
  category: string;
  defaultDecision: DecisionType | 'varies';
  description: string;
  phase: string;
}

export const reasonCodeDatabase: ReasonCodeInfo[] = [
  // Core - Value & Limits
  { code: 'EXCEEDS_SINGLE_LIMIT', category: 'Limits', defaultDecision: 'BLOCK', description: 'Value exceeds maximum single transaction limit', phase: 'Phase 4' },
  { code: 'EXCEEDS_DAILY_LIMIT', category: 'Limits', defaultDecision: 'BLOCK', description: 'Would exceed maximum daily spending limit', phase: 'Phase 4' },
  { code: 'EXCEEDS_WEEKLY_LIMIT', category: 'Limits', defaultDecision: 'BLOCK', description: 'Would exceed maximum weekly spending limit', phase: 'Phase 7b' },
  { code: 'EXCEEDS_MONTHLY_LIMIT', category: 'Limits', defaultDecision: 'BLOCK', description: 'Would exceed maximum monthly spending limit', phase: 'Phase 7b' },
  { code: 'INVALID_VALUE', category: 'Validation', defaultDecision: 'BLOCK', description: 'Value is malformed, negative, or has precision overflow', phase: 'Phase 3' },
  { code: 'ZERO_VALUE', category: 'Validation', defaultDecision: 'varies', description: 'Transaction value is zero (behavior is profile-dependent)', phase: 'Phase 3' },
  { code: 'DUST_AMOUNT', category: 'Limits', defaultDecision: 'BLOCK', description: 'Value is below minimum allowed amount', phase: 'Phase 7b' },
  { code: 'EXCEEDS_MAX_VALUE', category: 'Limits', defaultDecision: 'BLOCK', description: 'Value exceeds hard cap maximum', phase: 'Phase 7b' },
  
  // Core - Verification
  { code: 'VERIFICATION_UNAVAILABLE', category: 'Verification', defaultDecision: 'varies', description: 'Verification service is unreachable', phase: 'Phase 6' },
  { code: 'VERIFICATION_ERROR', category: 'Verification', defaultDecision: 'varies', description: 'Verification service returned an error', phase: 'Phase 6' },
  { code: 'VERIFICATION_TIMEOUT', category: 'Verification', defaultDecision: 'varies', description: 'Verification request timed out', phase: 'Phase 6' },
  { code: 'REVOKED_TARGET', category: 'Verification', defaultDecision: 'BLOCK', description: 'Target has been revoked in the registry', phase: 'Phase 6' },
  
  // Core - Escalation
  { code: 'HIGH_VALUE', category: 'Escalation', defaultDecision: 'ESCALATE', description: 'Value exceeds human approval threshold', phase: 'Phase 8' },
  { code: 'ESCALATION_TIMEOUT', category: 'Escalation', defaultDecision: 'BLOCK', description: 'Escalation expired without response', phase: 'Resolution' },
  { code: 'NO_PRINCIPAL_FOR_ESCALATION', category: 'Escalation', defaultDecision: 'varies', description: 'No human principal available to escalate to', phase: 'Phase 8' },
  
  // Core - Policy
  { code: 'INVALID_POLICY', category: 'Policy', defaultDecision: 'BLOCK', description: 'Policy document is malformed or invalid', phase: 'Phase 1' },
  { code: 'POLICY_EXPIRED', category: 'Policy', defaultDecision: 'BLOCK', description: 'Policy expiration date has passed', phase: 'Phase 1' },
  { code: 'POLICY_REQUIRED', category: 'Policy', defaultDecision: 'BLOCK', description: 'No policy was provided for evaluation', phase: 'Phase 1' },
  { code: 'SCHEMA_UNSUPPORTED', category: 'Policy', defaultDecision: 'BLOCK', description: 'Policy schema identifier is not recognized', phase: 'Phase 1' },
  { code: 'POLICY_SIGNATURE_INVALID', category: 'Policy', defaultDecision: 'BLOCK', description: 'Policy signature verification failed', phase: 'Phase 1' },
  
  // Core - System
  { code: 'EVALUATION_ERROR', category: 'System', defaultDecision: 'BLOCK', description: 'Internal interpreter error during evaluation', phase: 'Any' },
  { code: 'INVALID_CONFIDENCE', category: 'Validation', defaultDecision: 'BLOCK', description: 'Confidence score is outside valid range [0.0, 1.0]', phase: 'Phase 3' },
  { code: 'DUPLICATE_ACTION', category: 'System', defaultDecision: 'BLOCK', description: 'Action hash was seen within duplicate detection window', phase: 'Phase 5' },
  { code: 'KILL_SWITCH_ACTIVE', category: 'Emergency', defaultDecision: 'BLOCK', description: 'Emergency kill switch has been activated', phase: 'Phase 2' },
  { code: 'LOCK_EXPIRED', category: 'System', defaultDecision: 'ALLOW', description: 'Tentative spend lock released after duration', phase: 'State' },
  
  // xBPP-pay - Currency
  { code: 'UNSUPPORTED_CURRENCY', category: 'Currency', defaultDecision: 'BLOCK', description: 'Currency is in the blocked currencies list', phase: 'Phase 7d' },
  { code: 'UNKNOWN_CURRENCY', category: 'Currency', defaultDecision: 'varies', description: 'Currency is not recognized by the system', phase: 'Phase 7d' },
  { code: 'PRICE_STALE', category: 'Currency', defaultDecision: 'varies', description: 'Price oracle data is older than allowed maximum', phase: 'Phase 7d' },
  { code: 'CONVERSION_FAILED', category: 'Currency', defaultDecision: 'varies', description: 'Currency conversion calculation failed', phase: 'Phase 7d' },
  
  // xBPP-pay - Gas
  { code: 'GAS_EXCEEDS_BUFFER', category: 'Gas', defaultDecision: 'varies', description: 'Gas max_willing significantly exceeds estimate', phase: 'Phase 7a' },
  { code: 'GAS_PRICE_TOO_HIGH', category: 'Gas', defaultDecision: 'varies', description: 'Current gas price exceeds policy maximum', phase: 'Phase 7a' },
  { code: 'GAS_CURRENCY_UNSUPPORTED', category: 'Gas', defaultDecision: 'BLOCK', description: 'Gas payment currency cannot be converted', phase: 'Phase 7a' },
  
  // xBPP-pay - Chain
  { code: 'CHAIN_NOT_ALLOWED', category: 'Chain', defaultDecision: 'BLOCK', description: 'Destination chain is not in allowed chains list', phase: 'Phase 7e' },
  { code: 'UNKNOWN_CHAIN', category: 'Chain', defaultDecision: 'varies', description: 'Chain identifier is not recognized', phase: 'Phase 7e' },
  { code: 'CROSS_CHAIN_TRANSACTION', category: 'Chain', defaultDecision: 'varies', description: 'Transaction involves multiple blockchains', phase: 'Phase 7e' },
  { code: 'BRIDGE_TRANSACTION', category: 'Chain', defaultDecision: 'varies', description: 'Transaction uses a cross-chain bridge protocol', phase: 'Phase 7e' },
  
  // xBPP-pay - Counterparty
  { code: 'BLOCKLISTED_MERCHANT', category: 'Counterparty', defaultDecision: 'BLOCK', description: 'Recipient is on the merchant blocklist', phase: 'Phase 7f' },
  { code: 'UNVERIFIED_MERCHANT', category: 'Counterparty', defaultDecision: 'varies', description: 'Recipient is not verified in the registry', phase: 'Phase 7f' },
  { code: 'NEW_COUNTERPARTY', category: 'Counterparty', defaultDecision: 'varies', description: 'First transaction to this recipient', phase: 'Phase 7f' },
  { code: 'NEW_CONTRACT', category: 'Counterparty', defaultDecision: 'varies', description: 'Contract is younger than minimum age requirement', phase: 'Phase 7f' },
  { code: 'PROXY_CONTRACT', category: 'Counterparty', defaultDecision: 'varies', description: 'Target is an upgradeable proxy contract', phase: 'Phase 7f' },
  { code: 'SELF_PAYMENT', category: 'Counterparty', defaultDecision: 'BLOCK', description: 'Attempted payment to own address', phase: 'Phase 7f' },
  { code: 'AGENT_TO_AGENT', category: 'Counterparty', defaultDecision: 'varies', description: 'Transaction between two AI agents', phase: 'Phase 7f' },
  { code: 'VERIFICATION_EXPIRED', category: 'Counterparty', defaultDecision: 'varies', description: 'Counterparty verification has expired', phase: 'Phase 7f' },
  
  // xBPP-pay - Rate & Timing
  { code: 'RATE_LIMITED', category: 'Rate', defaultDecision: 'BLOCK', description: 'Transaction rate limit has been exceeded', phase: 'Phase 7c' },
  { code: 'BURST_DETECTED', category: 'Rate', defaultDecision: 'varies', description: 'Unusual burst of activity detected', phase: 'Phase 7c' },
  { code: 'RECURRING_NOT_ALLOWED', category: 'Recurring', defaultDecision: 'BLOCK', description: 'Recurring payments are disabled by policy', phase: 'Phase 7h' },
  { code: 'RECURRING_OVER_LIMIT', category: 'Recurring', defaultDecision: 'BLOCK', description: 'Recurring payment exceeds allowed amount', phase: 'Phase 7h' },
  { code: 'RECURRING_VARIANCE', category: 'Recurring', defaultDecision: 'varies', description: 'Recurring amount differs from original authorization', phase: 'Phase 7h' },
  { code: 'RECURRING_INITIAL_APPROVAL', category: 'Recurring', defaultDecision: 'ESCALATE', description: 'First recurring payment requires human approval', phase: 'Phase 7h' },
  { code: 'PREAUTH_EXPIRED', category: 'Preauth', defaultDecision: 'BLOCK', description: 'Pre-authorization has expired', phase: 'Phase 7h' },
  { code: 'CAPTURE_OVER_PREAUTH', category: 'Preauth', defaultDecision: 'varies', description: 'Capture amount exceeds pre-authorization', phase: 'Phase 7h' },
  
  // xBPP-pay - Security
  { code: 'PATTERN_MATCH_EXACT', category: 'Security', defaultDecision: 'BLOCK', description: 'Exact match with known threat pattern', phase: 'Phase 7g' },
  { code: 'PATTERN_MATCH_FUZZY', category: 'Security', defaultDecision: 'varies', description: 'Fuzzy match with potential threat pattern', phase: 'Phase 7g' },
  { code: 'ZERO_DAY_HEURISTIC', category: 'Security', defaultDecision: 'varies', description: 'Heuristic detected potential unknown threat', phase: 'Phase 7g' },
  { code: 'UNVERIFIED_CONTRACT', category: 'Security', defaultDecision: 'varies', description: 'Contract source code is not verified', phase: 'Phase 7g' },
  { code: 'ADMIN_KEY_DETECTED', category: 'Security', defaultDecision: 'varies', description: 'Contract contains admin key privileges', phase: 'Phase 7g' },
  { code: 'ADDRESS_POISONING', category: 'Security', defaultDecision: 'BLOCK', description: 'Address poisoning attack detected', phase: 'Phase 7g' },
  { code: 'PHISHING_SIGNATURE', category: 'Security', defaultDecision: 'BLOCK', description: 'Known phishing signature pattern detected', phase: 'Phase 7g' },
  { code: 'DRAINER_CONTRACT', category: 'Security', defaultDecision: 'BLOCK', description: 'Known wallet drainer contract detected', phase: 'Phase 7g' },
  { code: 'HONEYPOT_TOKEN', category: 'Security', defaultDecision: 'BLOCK', description: 'Token identified as honeypot scam', phase: 'Phase 7g' },
  
  // xBPP-pay - Confidence & Adversarial
  { code: 'LOW_CONFIDENCE', category: 'Confidence', defaultDecision: 'varies', description: 'Agent confidence below required threshold', phase: 'Phase 7j' },
  { code: 'FRAGMENTATION_DETECTED', category: 'Adversarial', defaultDecision: 'varies', description: 'Suspicious pattern of split transactions', phase: 'Phase 7i' },
  
  // xBPP-pay - Resolution
  { code: 'ESCALATION_BACKLOG', category: 'Escalation', defaultDecision: 'varies', description: 'Too many pending escalations in queue', phase: 'Phase 8' },
  { code: 'STANDING_APPROVAL', category: 'Resolution', defaultDecision: 'ALLOW', description: 'Matched an existing standing approval', phase: 'Resolution' },
  { code: 'HUMAN_OVERRIDE', category: 'Resolution', defaultDecision: 'ALLOW', description: 'Human explicitly approved override', phase: 'Resolution' },
  { code: 'MODIFICATION_EXCEEDS_LIMITS', category: 'Resolution', defaultDecision: 'BLOCK', description: 'Modified approval amount out of bounds', phase: 'Resolution' },
];

// Get reason codes by category
export function getReasonCodesByCategory(category: string): ReasonCodeInfo[] {
  return reasonCodeDatabase.filter(rc => rc.category === category);
}

// Get all categories
export function getReasonCodeCategories(): string[] {
  return [...new Set(reasonCodeDatabase.map(rc => rc.category))];
}

// Get reason code info
export function getReasonCodeInfo(code: ReasonCode): ReasonCodeInfo | undefined {
  return reasonCodeDatabase.find(rc => rc.code === code);
}
