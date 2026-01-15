// POLICYLAB Core Object Model
// Aligned with xBPP (Behavioral Policy Protocol) Master Specification v1.0

export type Category = 'SPEND' | 'SIGN' | 'DEFENSE';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type DecisionType = 'ALLOW' | 'BLOCK' | 'ESCALATE';
export type PolicyType = 'BPP' | 'DBP' | 'xBPP';
export type Posture = 'AGGRESSIVE' | 'BALANCED' | 'CAUTIOUS';
export type Verification = 'NONE' | 'BUILT_IN' | 'CUSTOM';

// xBPP Reason Codes (from spec)
export type ReasonCode =
  // Core - Value & Limits
  | 'EXCEEDS_SINGLE_LIMIT'
  | 'EXCEEDS_DAILY_LIMIT'
  | 'EXCEEDS_WEEKLY_LIMIT'
  | 'EXCEEDS_MONTHLY_LIMIT'
  | 'INVALID_VALUE'
  | 'ZERO_VALUE'
  | 'DUST_AMOUNT'
  | 'EXCEEDS_MAX_VALUE'
  // Core - Verification
  | 'VERIFICATION_UNAVAILABLE'
  | 'VERIFICATION_ERROR'
  | 'VERIFICATION_TIMEOUT'
  | 'REVOKED_TARGET'
  // Core - Escalation
  | 'HIGH_VALUE'
  | 'ESCALATION_TIMEOUT'
  | 'NO_PRINCIPAL_FOR_ESCALATION'
  // Core - Policy
  | 'INVALID_POLICY'
  | 'POLICY_EXPIRED'
  | 'POLICY_REQUIRED'
  | 'SCHEMA_UNSUPPORTED'
  | 'POLICY_SIGNATURE_INVALID'
  // Core - System
  | 'EVALUATION_ERROR'
  | 'INVALID_CONFIDENCE'
  | 'DUPLICATE_ACTION'
  | 'KILL_SWITCH_ACTIVE'
  | 'LOCK_EXPIRED'
  // xBPP-pay - Currency
  | 'UNSUPPORTED_CURRENCY'
  | 'UNKNOWN_CURRENCY'
  | 'PRICE_STALE'
  | 'CONVERSION_FAILED'
  // xBPP-pay - Gas
  | 'GAS_EXCEEDS_BUFFER'
  | 'GAS_PRICE_TOO_HIGH'
  | 'GAS_CURRENCY_UNSUPPORTED'
  // xBPP-pay - Chain
  | 'CHAIN_NOT_ALLOWED'
  | 'UNKNOWN_CHAIN'
  | 'CROSS_CHAIN_TRANSACTION'
  | 'BRIDGE_TRANSACTION'
  // xBPP-pay - Counterparty
  | 'BLOCKLISTED_MERCHANT'
  | 'UNVERIFIED_MERCHANT'
  | 'NEW_COUNTERPARTY'
  | 'NEW_CONTRACT'
  | 'PROXY_CONTRACT'
  | 'SELF_PAYMENT'
  | 'AGENT_TO_AGENT'
  | 'VERIFICATION_EXPIRED'
  // xBPP-pay - Rate & Timing
  | 'RATE_LIMITED'
  | 'BURST_DETECTED'
  | 'RECURRING_NOT_ALLOWED'
  | 'RECURRING_OVER_LIMIT'
  | 'RECURRING_VARIANCE'
  | 'RECURRING_INITIAL_APPROVAL'
  | 'PREAUTH_EXPIRED'
  | 'CAPTURE_OVER_PREAUTH'
  // xBPP-pay - Security
  | 'PATTERN_MATCH_EXACT'
  | 'PATTERN_MATCH_FUZZY'
  | 'ZERO_DAY_HEURISTIC'
  | 'UNVERIFIED_CONTRACT'
  | 'ADMIN_KEY_DETECTED'
  | 'ADDRESS_POISONING'
  | 'PHISHING_SIGNATURE'
  | 'DRAINER_CONTRACT'
  | 'HONEYPOT_TOKEN'
  // xBPP-pay - Confidence & Adversarial
  | 'LOW_CONFIDENCE'
  | 'FRAGMENTATION_DETECTED'
  // xBPP-pay - Resolution
  | 'ESCALATION_BACKLOG'
  | 'STANDING_APPROVAL'
  | 'HUMAN_OVERRIDE'
  | 'MODIFICATION_EXCEEDS_LIMITS';

// xBPP Policy Limits
export interface XBPPLimits {
  max_single: number;
  max_daily: number;
  max_weekly?: number;
  max_monthly?: number;
  require_human_above: number;
}

// xBPP Counterparty Rules
export interface XBPPCounterpartyRules {
  require_verified?: boolean;
  new_counterparty_action?: 'ALLOW' | 'ESCALATE' | 'BLOCK';
  merchant_allowlist?: string[];
  merchant_blocklist?: string[];
  min_contract_age_hours?: number;
  allow_self_payment?: boolean;
}

// xBPP Chain Rules
export interface XBPPChainRules {
  allowed_chains?: string[];
  default_chain?: string;
  unknown_chain_action?: 'BLOCK' | 'ESCALATE' | 'ALLOW';
  cross_chain_action?: 'BLOCK' | 'ESCALATE' | 'ALLOW';
  bridge_transaction_action?: 'BLOCK' | 'ESCALATE' | 'ALLOW';
}

// xBPP Value Rules
export interface XBPPValueRules {
  base_currency: string;
  accepted_currencies?: string[];
  convertible_currencies?: string[];
  blocked_currencies?: string[];
  unknown_currency_action?: 'BLOCK' | 'ESCALATE';
  min_value?: number;
  max_value?: number;
  allow_zero?: boolean;
}

// xBPP Rate Limits
export interface XBPPRateLimits {
  max_per_minute?: number;
  max_per_hour?: number;
  max_per_day?: number;
  burst_detection?: boolean;
  burst_threshold?: number;
}

// xBPP Confidence Rules
export interface XBPPConfidenceRules {
  require_confidence?: boolean;
  min_confidence?: number;
  low_confidence_action?: 'ALLOW' | 'ESCALATE' | 'BLOCK';
}

// xBPP Audit Config
export interface XBPPAuditConfig {
  log_level?: 'MINIMAL' | 'STANDARD' | 'VERBOSE';
  retention_days?: number;
  include_action_details?: boolean;
  redact_pii?: boolean;
}

// Full xBPP Policy Structure (from spec)
export interface XBPPPolicy {
  schema: string; // 'xbpp-pay/v1.0'
  version: string;
  posture: Posture;
  limits: XBPPLimits;
  verification: Verification;
  value_rules?: XBPPValueRules;
  chain_rules?: XBPPChainRules;
  counterparty_rules?: XBPPCounterpartyRules;
  rate_limits?: XBPPRateLimits;
  confidence_rules?: XBPPConfidenceRules;
  audit?: XBPPAuditConfig;
}

// Policy Template (for Policy Bank)
export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  use_case: string;
  icon: string;
  posture: Posture;
  policy: XBPPPolicy;
  tags: string[];
  risk_profile: 'conservative' | 'balanced' | 'aggressive';
  example_scenarios?: string[];
}

// Legacy Constraint (for demo compatibility)
export interface Constraint {
  id: string;
  name: string;
  description: string;
  type: 'limit' | 'require' | 'deny' | 'escalate';
  parameter?: string | number;
  isShared?: boolean;
  category?: Category;
}

export interface Event {
  id: string;
  timestamp: number;
  type: 'action' | 'request' | 'evaluation' | 'decision';
  narrative: string;
  details?: string;
  pending?: boolean;
  reason_codes?: string[]; // Can be xBPP ReasonCode or demo-specific codes
}

export interface Scenario {
  id: string;
  name: string;
  narrative: string;
  description: string;
  category: Category;
  risk_level: RiskLevel;
  event_stream: Event[];
  xbpp_context?: {
    action_type: 'PAYMENT' | 'SIGN' | 'APPROVE' | 'CALL';
    value_range: string;
    key_checks: string[];
  };
}

export interface Policy {
  id: string;
  name: string;
  type: PolicyType;
  version: string;
  description: string;
  posture_summary: string;
  constraints: Constraint[];
  raw_json: object;
  hash: string;
  xbpp?: XBPPPolicy; // Full xBPP policy structure
}

export interface Decision {
  event_id: string;
  decision: DecisionType;
  reason_codes: string[]; // Can be xBPP ReasonCode or demo-specific codes
  narrative: string;
  timestamp: number;
}

export interface Run {
  id: string;
  scenario_id: string;
  policy_id: string;
  decisions: Decision[];
}

export interface Divergence {
  event_id: string;
  event_narrative: string;
  policy_a_decision: Decision;
  policy_b_decision: Decision;
  impact_summary: string;
}

export interface Summary {
  what_happened: string;
  what_was_prevented: string;
  tradeoff: string;
  metrics: {
    spend_exposure_delta: string;
    human_escalation_count: number;
    autonomy_change: string;
    risk_avoided: string;
  };
}

export interface Diff {
  scenario_id: string;
  policy_a: Run;
  policy_b: Run;
  divergence_points: Divergence[];
  consequence_summary: Summary;
}

export interface ComparisonState {
  scenario: Scenario | null;
  policyA: Policy | null;
  policyB: Policy | null;
  runA: Run | null;
  runB: Run | null;
  diff: Diff | null;
}

// Policy Builder Config (for saved policies)
export interface PolicyConfig {
  posture: Posture;
  maxSingle: number;
  maxDaily: number;
  maxWeekly: number;
  requireHumanAbove: number;
  newCounterpartyAction: 'ALLOW' | 'ESCALATE' | 'BLOCK';
  requireVerified: boolean;
  burstDetection: boolean;
  minConfidence: number;
  logLevel: 'MINIMAL' | 'STANDARD' | 'VERBOSE';
}

// Saved Policy (for Policy Library)
export interface SavedPolicy {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  config: PolicyConfig;
}
