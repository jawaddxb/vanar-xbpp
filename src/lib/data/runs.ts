import { Run, Decision, Diff, Divergence, Summary } from '../types';
import { permissivePolicy, restrictivePolicy } from './policies';
import { scenarios } from './scenarios';

// Pre-computed runs for each scenario with each policy

// THE NEW VENDOR
const newVendorRunPermissive: Run = {
  id: 'run-nv-permissive',
  scenario_id: 'scenario-new-vendor',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'nv-6',
      decision: 'ALLOW',
      reason_codes: ['BUDGET_COMPLIANT', 'BASIC_VERIFICATION_PASSED', 'TIME_CRITICAL'],
      narrative: 'Vendor meets basic verification requirements. Transaction within limits. Proceeding.',
      timestamp: 10000,
    },
  ],
};

const newVendorRunRestrictive: Run = {
  id: 'run-nv-restrictive',
  scenario_id: 'scenario-new-vendor',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'nv-6',
      decision: 'ESCALATE',
      reason_codes: ['NEW_VENDOR_REQUIRES_APPROVAL', 'VERIFICATION_INCOMPLETE', 'TRUST_THRESHOLD_NOT_MET'],
      narrative: 'New vendor relationship requires human approval. Escalating to operations team.',
      timestamp: 10000,
    },
  ],
};

// THE SLOW DRAIN
const slowDrainRunPermissive: Run = {
  id: 'run-sd-permissive',
  scenario_id: 'scenario-slow-drain',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'sd-10',
      decision: 'ALLOW',
      reason_codes: ['INDIVIDUAL_LIMIT_COMPLIANT', 'SERVICE_AUTHORIZED', 'AUTO_SCALE_POLICY'],
      narrative: 'Transaction within individual limits. Aggregate monitoring not triggered. Approved.',
      timestamp: 27000,
    },
  ],
};

const slowDrainRunRestrictive: Run = {
  id: 'run-sd-restrictive',
  scenario_id: 'scenario-slow-drain',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'sd-10',
      decision: 'BLOCK',
      reason_codes: ['VELOCITY_ANOMALY', 'AGGREGATE_THRESHOLD_EXCEEDED', 'PATTERN_DEVIATION'],
      narrative: 'Unusual spending velocity detected. Daily aggregate at risk. Transaction blocked pending review.',
      timestamp: 27000,
    },
  ],
};

// THE CONVINCING SIGNATURE
const signatureRunPermissive: Run = {
  id: 'run-cs-permissive',
  scenario_id: 'scenario-convincing-signature',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'cs-7',
      decision: 'ALLOW',
      reason_codes: ['SIGNATURES_VALID', 'AMOUNT_WITHIN_LIMITS', 'DESTINATION_KNOWN'],
      narrative: 'Both signatures cryptographically valid. Treasury address verified. Transfer approved.',
      timestamp: 15000,
    },
  ],
};

const signatureRunRestrictive: Run = {
  id: 'run-cs-restrictive',
  scenario_id: 'scenario-convincing-signature',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'cs-7',
      decision: 'ESCALATE',
      reason_codes: ['TIMING_ANOMALY', 'PATTERN_DEVIATION', 'HIGH_VALUE_TRANSFER'],
      narrative: 'Signature timing deviation exceeds acceptable threshold. Requesting manual verification.',
      timestamp: 15000,
    },
  ],
};

// THE POISONED ADDRESS
const poisonedRunPermissive: Run = {
  id: 'run-pa-permissive',
  scenario_id: 'scenario-poisoned-address',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'pa-7',
      decision: 'ALLOW',
      reason_codes: ['NO_NEGATIVE_REPUTATION', 'INCOMING_FUNDS', 'VISUAL_MATCH_ACCEPTABLE'],
      narrative: 'No reputation flags. Incoming transaction poses limited risk. Accepted.',
      timestamp: 12000,
    },
  ],
};

const poisonedRunRestrictive: Run = {
  id: 'run-pa-restrictive',
  scenario_id: 'scenario-poisoned-address',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'pa-7',
      decision: 'ESCALATE',
      reason_codes: ['ADDRESS_SIMILARITY_FLAG', 'TIMING_CORRELATION', 'POISONING_PATTERN_MATCH'],
      narrative: 'Address creation timing correlates with known attack pattern. Quarantining for review.',
      timestamp: 12000,
    },
  ],
};

// THE PHANTOM APPROVAL
const phantomRunPermissive: Run = {
  id: 'run-pha-permissive',
  scenario_id: 'scenario-phantom-approval',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'pha-6',
      decision: 'ALLOW',
      reason_codes: ['ALL_SIGNATURES_VALID', 'THRESHOLD_MET', 'KEYS_NOT_REVOKED'],
      narrative: 'All three signatures cryptographically valid. Required threshold met. Transfer approved.',
      timestamp: 12500,
    },
  ],
};

const phantomRunRestrictive: Run = {
  id: 'run-pha-restrictive',
  scenario_id: 'scenario-phantom-approval',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'pha-6',
      decision: 'BLOCK',
      reason_codes: ['SIGNER_EMPLOYMENT_TERMINATED', 'STALE_AUTHORIZATION', 'HR_STATUS_MISMATCH'],
      narrative: 'Signer finance-lead-3 no longer employed. Authorization stale. Transfer blocked.',
      timestamp: 12500,
    },
  ],
};

// THE TRUSTED INSIDER
const insiderRunPermissive: Run = {
  id: 'run-ti-permissive',
  scenario_id: 'scenario-trusted-insider',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'ti-7',
      decision: 'ALLOW',
      reason_codes: ['VALID_PERMISSIONS', 'AUTHENTICATED_SESSION', 'NO_POLICY_VIOLATION'],
      narrative: 'User has valid read permissions for all repositories. Access continues.',
      timestamp: 18000,
    },
  ],
};

const insiderRunRestrictive: Run = {
  id: 'run-ti-restrictive',
  scenario_id: 'scenario-trusted-insider',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'ti-7',
      decision: 'ESCALATE',
      reason_codes: ['BEHAVIORAL_ANOMALY', 'BULK_DOWNLOAD_PATTERN', 'DEPARTURE_CORRELATION'],
      narrative: 'Unusual bulk download pattern detected near departure date. Session flagged for security review.',
      timestamp: 18000,
    },
  ],
};

// THE URGENT OVERRIDE
const overrideRunPermissive: Run = {
  id: 'run-uo-permissive',
  scenario_id: 'scenario-urgent-override',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'uo-5',
      decision: 'ALLOW',
      reason_codes: ['CEO_AUTHORITY', 'IDENTITY_VERIFIED', 'BUSINESS_CRITICAL'],
      narrative: 'CEO identity verified. Executive override authority accepted. Transfer initiated.',
      timestamp: 8000,
    },
  ],
};

const overrideRunRestrictive: Run = {
  id: 'run-uo-restrictive',
  scenario_id: 'scenario-urgent-override',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'uo-5',
      decision: 'ESCALATE',
      reason_codes: ['EXCEEDS_SINGLE_AUTHORITY', 'STRESS_INDICATORS_DETECTED', 'APPROVAL_CHAIN_REQUIRED'],
      narrative: 'Amount exceeds single-authority limit. Urgency language flagged as potential duress. Escalating to board.',
      timestamp: 8000,
    },
  ],
};

// THE COPY-PASTE ERROR
const copyPasteRunPermissive: Run = {
  id: 'run-cpe-permissive',
  scenario_id: 'scenario-copy-paste-error',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'cpe-6',
      decision: 'ALLOW',
      reason_codes: ['CODE_MATCHES_TEMPLATE', 'VALID_DEPLOYER', 'SYNTAX_VERIFIED'],
      narrative: 'Contract code matches approved template. Deployment authorized.',
      timestamp: 12500,
    },
  ],
};

const copyPasteRunRestrictive: Run = {
  id: 'run-cpe-restrictive',
  scenario_id: 'scenario-copy-paste-error',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'cpe-6',
      decision: 'BLOCK',
      reason_codes: ['PARAMETER_DEVIATION', 'UNKNOWN_ADDRESS', 'APPROVAL_STALE'],
      narrative: 'Beneficiary address differs from template and is unknown. Human verification required.',
      timestamp: 12500,
    },
  ],
};

// THE SILENT LISTENER
const listenerRunPermissive: Run = {
  id: 'run-sl-permissive',
  scenario_id: 'scenario-silent-listener',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'sl-7',
      decision: 'ALLOW',
      reason_codes: ['VALID_API_KEY', 'READ_ONLY_ACCESS', 'WITHIN_RATE_LIMITS'],
      narrative: 'API key has valid read permissions. Rate limits not exceeded. Access continues.',
      timestamp: 12000,
    },
  ],
};

const listenerRunRestrictive: Run = {
  id: 'run-sl-restrictive',
  scenario_id: 'scenario-silent-listener',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'sl-7',
      decision: 'BLOCK',
      reason_codes: ['ENUMERATION_PATTERN', 'STALE_KEY_OWNER', 'RECONNAISSANCE_DETECTED'],
      narrative: 'Systematic enumeration pattern detected. Key owner no longer active. Access revoked.',
      timestamp: 12000,
    },
  ],
};

// THE HELPFUL SUGGESTION
const suggestionRunPermissive: Run = {
  id: 'run-hs-permissive',
  scenario_id: 'scenario-helpful-suggestion',
  policy_id: permissivePolicy.id,
  decisions: [
    {
      event_id: 'hs-5',
      decision: 'ALLOW',
      reason_codes: ['TRUSTED_SOURCE', 'CODE_VALID', 'SAVINGS_CONFIRMED'],
      narrative: 'Suggestion from trusted oracle. Code analysis shows no vulnerabilities. Implementing optimization.',
      timestamp: 10000,
    },
  ],
};

const suggestionRunRestrictive: Run = {
  id: 'run-hs-restrictive',
  scenario_id: 'scenario-helpful-suggestion',
  policy_id: restrictivePolicy.id,
  decisions: [
    {
      event_id: 'hs-5',
      decision: 'ESCALATE',
      reason_codes: ['EXTERNAL_DEPENDENCY_ADDED', 'UNKNOWN_CONTRACT_OWNER', 'MUTABLE_PROXY_PATTERN'],
      narrative: 'New external dependency on unknown mutable contract. Requires security team review.',
      timestamp: 10000,
    },
  ],
};

// All runs indexed
export const runs: Record<string, Run> = {
  'scenario-new-vendor-permissive': newVendorRunPermissive,
  'scenario-new-vendor-restrictive': newVendorRunRestrictive,
  'scenario-slow-drain-permissive': slowDrainRunPermissive,
  'scenario-slow-drain-restrictive': slowDrainRunRestrictive,
  'scenario-convincing-signature-permissive': signatureRunPermissive,
  'scenario-convincing-signature-restrictive': signatureRunRestrictive,
  'scenario-poisoned-address-permissive': poisonedRunPermissive,
  'scenario-poisoned-address-restrictive': poisonedRunRestrictive,
  'scenario-phantom-approval-permissive': phantomRunPermissive,
  'scenario-phantom-approval-restrictive': phantomRunRestrictive,
  'scenario-trusted-insider-permissive': insiderRunPermissive,
  'scenario-trusted-insider-restrictive': insiderRunRestrictive,
  'scenario-urgent-override-permissive': overrideRunPermissive,
  'scenario-urgent-override-restrictive': overrideRunRestrictive,
  'scenario-copy-paste-error-permissive': copyPasteRunPermissive,
  'scenario-copy-paste-error-restrictive': copyPasteRunRestrictive,
  'scenario-silent-listener-permissive': listenerRunPermissive,
  'scenario-silent-listener-restrictive': listenerRunRestrictive,
  'scenario-helpful-suggestion-permissive': suggestionRunPermissive,
  'scenario-helpful-suggestion-restrictive': suggestionRunRestrictive,
};

export function getRunsForScenario(scenarioId: string): { permissive: Run; restrictive: Run } {
  return {
    permissive: runs[`${scenarioId}-permissive`],
    restrictive: runs[`${scenarioId}-restrictive`],
  };
}

// Pre-computed diffs
const diffSummaries: Record<string, Summary> = {
  'scenario-new-vendor': {
    what_happened: 'Both policies evaluated a new vendor offering better pricing. The permissive policy engaged the vendor based on basic verification. The restrictive policy escalated for human approval.',
    what_was_prevented: 'The restrictive policy prevented potential exposure to an unvetted vendor relationship. The permissive policy prevented budget overrun and deadline miss.',
    tradeoff: 'Speed and cost savings vs. relationship verification and risk mitigation.',
    metrics: {
      spend_exposure_delta: '$6,200',
      human_escalation_count: 1,
      autonomy_change: '-40%',
      risk_avoided: 'Vendor fraud potential',
    },
  },
  'scenario-slow-drain': {
    what_happened: 'Over the course of a day, small transactions accumulated to $5,310. Each individual transaction was within limits. The permissive policy continued approving. The restrictive policy detected the velocity anomaly and blocked.',
    what_was_prevented: 'The restrictive policy prevented unchecked spending accumulation. The permissive policy prevented service disruption.',
    tradeoff: 'Operational continuity vs. aggregate spend control.',
    metrics: {
      spend_exposure_delta: '$1,800',
      human_escalation_count: 0,
      autonomy_change: 'N/A',
      risk_avoided: 'Runaway spending',
    },
  },
  'scenario-convincing-signature': {
    what_happened: 'A $45,000 transfer request had valid cryptographic signatures but unusual timing. The permissive policy approved based on signature validity. The restrictive policy flagged the timing anomaly.',
    what_was_prevented: 'The restrictive policy potentially prevented a compromised key attack. The permissive policy prevented operational delays.',
    tradeoff: 'Transaction speed vs. behavioral verification.',
    metrics: {
      spend_exposure_delta: '$45,000',
      human_escalation_count: 1,
      autonomy_change: '-60%',
      risk_avoided: 'Potential key compromise',
    },
  },
  'scenario-poisoned-address': {
    what_happened: 'Incoming funds from an address visually similar to a known partner. The permissive policy accepted the transaction. The restrictive policy quarantined it based on attack pattern correlation.',
    what_was_prevented: 'The restrictive policy prevented potential address book poisoning. The permissive policy prevented legitimate funds from being delayed.',
    tradeoff: 'Funds availability vs. address integrity protection.',
    metrics: {
      spend_exposure_delta: '$22,000',
      human_escalation_count: 1,
      autonomy_change: '-35%',
      risk_avoided: 'Address poisoning attack',
    },
  },
  'scenario-phantom-approval': {
    what_happened: 'A $180,000 treasury transfer had three valid signatures, but one signer was terminated 28 days ago. The permissive policy approved based on cryptographic validity. The restrictive policy blocked due to stale authorization.',
    what_was_prevented: 'The restrictive policy prevented unauthorized access via orphaned credentials. The permissive policy would have completed a potentially fraudulent transfer.',
    tradeoff: 'Cryptographic trust vs. organizational state awareness.',
    metrics: {
      spend_exposure_delta: '$180,000',
      human_escalation_count: 0,
      autonomy_change: '-100%',
      risk_avoided: 'Credential misuse post-termination',
    },
  },
  'scenario-trusted-insider': {
    what_happened: 'A departing senior engineer downloaded three proprietary repositories at 2 AM. Each action was individually authorized. The permissive policy allowed continued access. The restrictive policy flagged the behavioral anomaly.',
    what_was_prevented: 'The restrictive policy potentially prevented intellectual property theft. The permissive policy avoided disrupting a legitimate employee.',
    tradeoff: 'Employee trust vs. departure risk monitoring.',
    metrics: {
      spend_exposure_delta: 'IP Value: Unquantified',
      human_escalation_count: 1,
      autonomy_change: '-50%',
      risk_avoided: 'Data exfiltration',
    },
  },
  'scenario-urgent-override': {
    what_happened: 'CEO requested immediate $2.4M transfer, bypassing normal approval chains. The permissive policy honored executive authority. The restrictive policy detected stress indicators and required board approval.',
    what_was_prevented: 'The restrictive policy potentially prevented a CEO fraud or duress scenario. The permissive policy risked enabling a social engineering attack.',
    tradeoff: 'Executive agility vs. duress detection.',
    metrics: {
      spend_exposure_delta: '$2,400,000',
      human_escalation_count: 1,
      autonomy_change: '-80%',
      risk_avoided: 'Executive impersonation or duress',
    },
  },
  'scenario-copy-paste-error': {
    what_happened: 'A smart contract deployment had a single-character difference in the beneficiary address. The permissive policy approved based on template match. The restrictive policy blocked due to unknown destination.',
    what_was_prevented: 'The restrictive policy prevented funds from being locked to an unknown address. The permissive policy would have deployed to a potentially malicious wallet.',
    tradeoff: 'Deployment velocity vs. parameter verification depth.',
    metrics: {
      spend_exposure_delta: 'Contract value at risk',
      human_escalation_count: 0,
      autonomy_change: '-100%',
      risk_avoided: 'Misdirected contract deployment',
    },
  },
  'scenario-silent-listener': {
    what_happened: 'An API key systematically enumerated customer records alphabetically. The permissive policy allowed access within rate limits. The restrictive policy detected the reconnaissance pattern and revoked access.',
    what_was_prevented: 'The restrictive policy prevented potential data mapping for future attack. The permissive policy avoided disrupting legitimate analytics.',
    tradeoff: 'API availability vs. access pattern monitoring.',
    metrics: {
      spend_exposure_delta: 'Customer data exposure',
      human_escalation_count: 0,
      autonomy_change: '-100%',
      risk_avoided: 'Data reconnaissance',
    },
  },
  'scenario-helpful-suggestion': {
    what_happened: 'A trusted oracle suggested gas optimization introducing external dependency. The permissive policy implemented the optimization. The restrictive policy flagged the unknown mutable contract.',
    what_was_prevented: 'The restrictive policy prevented dependency on an upgradeable external contract. The permissive policy gained 40% gas savings but introduced supply chain risk.',
    tradeoff: 'Gas optimization vs. dependency trust boundaries.',
    metrics: {
      spend_exposure_delta: '40% gas savings vs. unknown risk',
      human_escalation_count: 1,
      autonomy_change: '-45%',
      risk_avoided: 'Supply chain compromise',
    },
  },
};

export function getDiffForScenario(scenarioId: string): Diff | null {
  const scenario = scenarios.find(s => s.id === scenarioId);
  if (!scenario) return null;

  const runA = runs[`${scenarioId}-permissive`];
  const runB = runs[`${scenarioId}-restrictive`];
  if (!runA || !runB) return null;

  const decisionA = runA.decisions[0];
  const decisionB = runB.decisions[0];

  const divergence: Divergence = {
    event_id: decisionA.event_id,
    event_narrative: scenario.event_stream.find(e => e.id === decisionA.event_id)?.narrative || '',
    policy_a_decision: decisionA,
    policy_b_decision: decisionB,
    impact_summary: diffSummaries[scenarioId]?.tradeoff || '',
  };

  return {
    scenario_id: scenarioId,
    policy_a: runA,
    policy_b: runB,
    divergence_points: [divergence],
    consequence_summary: diffSummaries[scenarioId],
  };
}
