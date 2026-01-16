# xBPP SDK Implementation Guide

**Execution Boundary Permission Protocol (xBPP)**

**Version:** 1.0  
**Date:** January 2025  
**Companion to:** xBPP Master Specification v1.0

---

# Quick Start

## Installation

```bash
npm install @anthropic/xbpp
```

## 30-Second Integration

```typescript
import { xbpp } from '@anthropic/xbpp';
import { x402Client } from '@coinbase/x402';

// Wrap your x402 client with xBPP protection
const client = xbpp.wrap(x402Client, {
  maxSingle: 100,      // Max $100 per transaction
  dailyBudget: 1000,   // Max $1000 per day
  askMeAbove: 500,     // Human approval over $500
});

// All payments now go through xBPP
const response = await client.fetch(url);
```

That's it. Every payment is now evaluated against your policy.

---

# Core Concepts

## The Three Decisions

Every payment request gets one of three verdicts:

```typescript
switch (verdict.decision) {
  case 'ALLOW':
    // ✅ Proceed - payment is within policy
    break;
    
  case 'BLOCK':
    // 🛑 Stop - policy violation
    console.log('Blocked:', verdict.reasons);
    break;
    
  case 'ESCALATE':
    // ⏸️ Pause - needs human approval
    await handleEscalation(verdict);
    break;
}
```

## Simple Options vs Full Policy

The SDK accepts either simple options or a full policy object:

**Simple Options (Recommended for Getting Started):**

```typescript
xbpp.wrap(client, {
  maxSingle: 100,
  dailyBudget: 1000,
  askMeAbove: 500,
});
```

**Full Policy (For Advanced Configuration):**

```typescript
xbpp.wrap(client, {
  schema: 'xbpp-pay/v1.0',
  posture: 'BALANCED',
  limits: {
    max_single: 100,
    max_daily: 1000,
    max_weekly: 5000,
    require_human_above: 500,
  },
  counterparty_rules: {
    new_counterparty_action: 'ESCALATE',
  },
  // ... full policy object
});
```

**Option Mapping:**

| Simple Option | Policy Field |
|---------------|--------------|
| `maxSingle` | `limits.max_single` |
| `dailyBudget` | `limits.max_daily` |
| `weeklyBudget` | `limits.max_weekly` |
| `monthlyBudget` | `limits.max_monthly` |
| `askMeAbove` | `limits.require_human_above` |
| `mode` | `posture` |
| `verify` | `verification` |
| `chains` | `chain_rules.allowed_chains` |
| `allowlist` | `counterparty_rules.merchant_allowlist` |
| `blocklist` | `counterparty_rules.merchant_blocklist` |

---

# Handling Escalations

## Basic Escalation Handler

```typescript
const client = xbpp.wrap(x402Client, {
  maxSingle: 100,
  askMeAbove: 50,
  
  onEscalate: async (request) => {
    // request contains:
    // - amount: number (payment amount)
    // - currency: string (e.g., "USDC")
    // - to: string (recipient address)
    // - reason: string (why escalation triggered)
    // - timeout: Date (when escalation expires)
    
    const approved = await promptUser(
      `Approve $${request.amount} ${request.currency} to ${request.to}?`
    );
    
    return approved; // true = allow, false = block
  }
});
```

## Escalation with Modified Amount

If your policy allows modified approvals:

```typescript
onEscalate: async (request) => {
  const result = await promptUser(request);
  
  if (result.approved) {
    return {
      approved: true,
      modifiedAmount: result.newAmount, // Optional: approve different amount
    };
  }
  
  return { approved: false };
}
```

## Async Escalation (Webhooks)

For long-running approvals:

```typescript
const client = xbpp.wrap(x402Client, {
  maxSingle: 100,
  askMeAbove: 50,
  
  escalation: {
    mode: 'webhook',
    endpoint: 'https://your-app.com/xbpp/escalations',
    timeout: 60 * 60, // 1 hour
  }
});

// Your webhook receives:
// POST /xbpp/escalations
// {
//   "escalation_id": "uuid",
//   "eval_id": "uuid",
//   "action": { ... },
//   "reason": "HIGH_VALUE",
//   "timeout_at": "ISO8601"
// }

// Respond via API:
await xbpp.resolveEscalation(escalationId, {
  approved: true,
  approver: 'user@company.com',
});
```

---

# Error Handling

## Blocked Payments

```typescript
import { xbpp, BlockedError } from '@anthropic/xbpp';

try {
  const response = await client.fetch(url);
} catch (error) {
  if (error instanceof BlockedError) {
    console.log('Payment blocked');
    console.log('Reasons:', error.reasons);      // ['EXCEEDS_DAILY_LIMIT']
    console.log('Message:', error.message);      // Human-readable
    console.log('Verdict:', error.verdict);      // Full verdict object
    
    // Optionally show user-friendly message
    if (error.reasons.includes('EXCEEDS_DAILY_LIMIT')) {
      showToast('Daily spending limit reached. Try again tomorrow.');
    }
  } else {
    throw error; // Re-throw non-xBPP errors
  }
}
```

## Escalation Timeout

```typescript
import { EscalationTimeoutError } from '@anthropic/xbpp';

try {
  const response = await client.fetch(url);
} catch (error) {
  if (error instanceof EscalationTimeoutError) {
    console.log('Approval timed out');
    console.log('Escalation ID:', error.escalationId);
    // Payment was NOT executed
  }
}
```

## Common Error Types

| Error | Description |
|-------|-------------|
| `BlockedError` | Payment violated policy |
| `EscalationTimeoutError` | Human approval timed out |
| `EscalationDeniedError` | Human explicitly denied |
| `PolicyError` | Invalid policy configuration |
| `RegistryError` | Registry unavailable |

---

# Direct Interpreter Usage

For advanced use cases, you can use the interpreter directly without the x402 wrapper:

## Evaluate an Action

```typescript
import { XBPPInterpreter } from '@anthropic/xbpp';

const interpreter = new XBPPInterpreter({
  registry: myRegistry, // Optional: custom registry
});

const action = {
  timestamp: new Date().toISOString(),
  type: 'PAYMENT',
  value: { amount: 100, currency: 'USDC' },
  target: { address: '0x...' },
  confidence: 0.9,
  agent: { agent_id: 'my-agent' },
  chain: { id: 'base' },
};

const policy = {
  schema: 'xbpp-pay/v1.0',
  version: '1',
  posture: 'BALANCED',
  limits: {
    max_single: 500,
    max_daily: 5000,
    require_human_above: 1000,
  },
  verification: 'BUILT_IN',
};

const verdict = await interpreter.evaluate(action, policy);

console.log(verdict.decision);  // 'ALLOW' | 'BLOCK' | 'ESCALATE'
console.log(verdict.reasons);   // ['HIGH_VALUE'] etc.
console.log(verdict.eval_id);   // UUID for tracking
```

## Confirm or Void

After payment execution:

```typescript
// On successful transaction
await interpreter.confirm(verdict.eval_id, {
  tx_hash: '0x...',
  block_number: 12345,
  actual_gas: 0.002,
});

// On failed transaction
await interpreter.void(verdict.eval_id, 'TRANSACTION_REVERTED');
```

## State Management

Access current state:

```typescript
const state = await interpreter.getState(agentId);

console.log(state.confirmed_spend_today);   // $340
console.log(state.tentative_spend_today);   // $50 (pending)
console.log(state.actions_today);           // 12
console.log(state.pending_escalations);     // 1
```

Reset daily limits (for testing):

```typescript
await interpreter.resetDaily(agentId); // Clears daily counters
```

---

# Configuration

## Interpreter Options

```typescript
const interpreter = new XBPPInterpreter({
  // Registry configuration
  registry: {
    type: 'built-in',           // 'built-in' | 'custom'
    endpoint: 'https://...',    // For custom registry
    apiKey: '...',              // If required
    cacheSeconds: 300,          // Cache TTL
  },
  
  // State storage
  state: {
    type: 'memory',             // 'memory' | 'redis' | 'custom'
    redis: {                    // If type = 'redis'
      url: 'redis://...',
    },
  },
  
  // Defaults
  defaults: {
    lockDuration: 3600,         // Tentative spend lock (seconds)
    verdictValidity: 60,        // Verdict expiration (seconds)
    duplicateWindow: 60,        // Duplicate detection window
  },
  
  // Logging
  logging: {
    level: 'info',              // 'debug' | 'info' | 'warn' | 'error'
    auditEndpoint: '...',       // Optional: external audit log
  },
});
```

## Client Wrapper Options

```typescript
const client = xbpp.wrap(x402Client, policy, {
  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoff: 'exponential',
  },
  
  // Timeout configuration
  timeout: {
    evaluation: 5000,           // Interpreter timeout (ms)
    escalation: 3600000,        // Escalation timeout (ms)
  },
  
  // Hooks
  hooks: {
    beforeEvaluate: async (action) => {
      // Modify action before evaluation
      return action;
    },
    afterVerdict: async (verdict) => {
      // Log, alert, etc.
      await logToDatadog(verdict);
    },
  },
});
```

---

# Postures

## Choosing a Posture

| Posture | Use Case | Behavior |
|---------|----------|----------|
| `AGGRESSIVE` | High-frequency automation, trading bots | Minimize friction, allow edge cases |
| `BALANCED` | General purpose (default) | Balance autonomy and safety |
| `CAUTIOUS` | High-value, compliance-sensitive | Maximize oversight, block ambiguity |

```typescript
// Aggressive - favor action
xbpp.wrap(client, {
  mode: 'aggressive',
  maxSingle: 1000,
  dailyBudget: 50000,
  askMeAbove: 5000,
});

// Cautious - favor safety
xbpp.wrap(client, {
  mode: 'cautious',
  maxSingle: 100,
  dailyBudget: 1000,
  askMeAbove: 50,
});
```

## Posture Effects

| Situation | AGGRESSIVE | BALANCED | CAUTIOUS |
|-----------|------------|----------|----------|
| New counterparty | Allow | Escalate | Block |
| Verification down | Allow | Escalate | Block |
| Near daily limit | Allow | Warn | Escalate |
| Unknown chain | Escalate | Block | Block |
| Low confidence | Warn | Escalate | Block |

---

# Common Patterns

## Multi-Agent Setup

```typescript
// Each agent gets its own state
const agent1Client = xbpp.wrap(x402Client, policy, {
  agentId: 'purchasing-agent',
});

const agent2Client = xbpp.wrap(x402Client, policy, {
  agentId: 'travel-agent',
});

// Limits are tracked separately
await agent1Client.fetch(url1); // Uses agent1's budget
await agent2Client.fetch(url2); // Uses agent2's budget
```

## Shared Principal

```typescript
// Multiple agents sharing a single budget
const sharedPolicy = {
  ...basePolicy,
  agent: {
    principal: 'team-budget',
    shared_limits: true,
  },
};

const agent1 = xbpp.wrap(client, sharedPolicy, { agentId: 'agent-1' });
const agent2 = xbpp.wrap(client, sharedPolicy, { agentId: 'agent-2' });

// Both agents draw from the same daily limit
```

## Allowlist-Only Mode

```typescript
// Only allow payments to pre-approved addresses
xbpp.wrap(client, {
  maxSingle: 1000,
  dailyBudget: 10000,
  askMeAbove: 10001, // Never escalate (block instead)
  
  allowlist: [
    '0xVendor1...',
    '0xVendor2...',
    '0xVendor3...',
  ],
  
  // Block everything not on allowlist
  counterparty: {
    newCounterpartyAction: 'block',
    requireVerified: false, // Don't need registry verification
  },
});
```

## Read-Only Mode (Dry Run)

```typescript
// Evaluate without affecting state
const verdict = await interpreter.evaluate(action, policy, {
  dryRun: true,
});

// verdict.decision tells you what WOULD happen
// State is not modified
```

## Kill Switch

```typescript
// Emergency stop all payments for an agent
await interpreter.activateKillSwitch({
  scope: 'agent',
  agentId: 'my-agent',
  reason: 'Suspected compromise',
});

// All subsequent evaluations return BLOCK with KILL_SWITCH_ACTIVE

// Deactivate when resolved
await interpreter.deactivateKillSwitch({
  scope: 'agent',
  agentId: 'my-agent',
});
```

---

# Testing

## Mock Interpreter

```typescript
import { MockInterpreter } from '@anthropic/xbpp/testing';

const mockInterpreter = new MockInterpreter({
  defaultDecision: 'ALLOW',
});

// Override for specific scenarios
mockInterpreter.when({
  'value.amount': { $gt: 100 }
}).returns({
  decision: 'BLOCK',
  reasons: ['EXCEEDS_SINGLE_LIMIT'],
});

// Use in tests
const client = xbpp.wrap(x402Client, policy, {
  interpreter: mockInterpreter,
});
```

## Test Fixtures

```typescript
import { fixtures } from '@anthropic/xbpp/testing';

// Pre-built actions for common scenarios
const smallPayment = fixtures.action.smallPayment();
const highValuePayment = fixtures.action.highValuePayment();
const recurringPayment = fixtures.action.recurring();

// Pre-built policies
const strictPolicy = fixtures.policy.strict();
const lenientPolicy = fixtures.policy.lenient();
```

## Assertion Helpers

```typescript
import { expect } from '@anthropic/xbpp/testing';

const verdict = await interpreter.evaluate(action, policy);

expect(verdict).toAllow();
expect(verdict).toBlock();
expect(verdict).toBlockWith('EXCEEDS_DAILY_LIMIT');
expect(verdict).toEscalate();
expect(verdict).toEscalateWith('HIGH_VALUE');
```

---

# TypeScript Types

## Core Types

```typescript
import type {
  Action,
  PayAction,
  Policy,
  PayPolicy,
  Verdict,
  Decision,
  ReasonCode,
  State,
  Evidence,
  Audit,
  Escalation,
} from '@anthropic/xbpp';
```

## Helper Types

```typescript
import type {
  SimpleOptions,
  WrapOptions,
  InterpreterConfig,
  EscalationRequest,
  EscalationResponse,
  ConfirmPayload,
  VoidPayload,
} from '@anthropic/xbpp';
```

## Type Guards

```typescript
import {
  isBlockedError,
  isEscalationError,
  isPayAction,
  isPayPolicy,
} from '@anthropic/xbpp';

if (isBlockedError(error)) {
  // TypeScript knows error is BlockedError
}
```

---

# Debugging

## Verbose Logging

```typescript
const client = xbpp.wrap(x402Client, policy, {
  logging: {
    level: 'debug',
  },
});

// Logs every evaluation with full details
```

## Verdict Inspection

```typescript
const verdict = await interpreter.evaluate(action, policy);

// Full evaluation trace
console.log(verdict.evidence.checks_performed);  // All checks run
console.log(verdict.evidence.checks_passed);     // What passed
console.log(verdict.evidence.checks_failed);     // What failed

// State at evaluation time
console.log(verdict.audit.state_snapshot);
```

## Why Was This Blocked?

```typescript
import { explainVerdict } from '@anthropic/xbpp';

const verdict = await interpreter.evaluate(action, policy);

if (verdict.decision === 'BLOCK') {
  const explanation = explainVerdict(verdict);
  
  console.log(explanation);
  // "Payment of $150 USDC blocked because:
  //  - Exceeds single transaction limit of $100
  //  - Would exceed daily budget ($950 of $1000 used, $150 requested)"
}
```

---

# Migration Guide

## From Manual Limit Checking

Before:

```typescript
// ❌ Manual, error-prone
if (amount > MAX_SINGLE) {
  throw new Error('Over limit');
}
if (dailySpend + amount > MAX_DAILY) {
  throw new Error('Daily limit');
}
await x402Client.pay(to, amount);
dailySpend += amount;
```

After:

```typescript
// ✅ Automatic, comprehensive
const client = xbpp.wrap(x402Client, {
  maxSingle: MAX_SINGLE,
  dailyBudget: MAX_DAILY,
});
await client.fetch(url); // All checks handled
```

## From Custom Policy Engine

```typescript
// If you have existing policy logic, you can use it as a custom check
const client = xbpp.wrap(x402Client, policy, {
  hooks: {
    beforeEvaluate: async (action) => {
      // Run your existing checks
      const myResult = await myPolicyEngine.check(action);
      if (!myResult.allowed) {
        throw new BlockedError(['CUSTOM_POLICY_VIOLATION']);
      }
      return action;
    },
  },
});
```

---

# API Reference

## xbpp.wrap()

```typescript
function wrap(
  client: X402Client,
  policy: Policy | SimpleOptions,
  options?: WrapOptions
): WrappedClient;
```

## XBPPInterpreter

```typescript
class XBPPInterpreter {
  constructor(config?: InterpreterConfig);
  
  evaluate(
    action: Action,
    policy: Policy,
    options?: EvaluateOptions
  ): Promise<Verdict>;
  
  confirm(evalId: string, payload: ConfirmPayload): Promise<void>;
  void(evalId: string, reason: string): Promise<void>;
  
  getState(agentId: string): Promise<State>;
  resetDaily(agentId: string): Promise<void>;
  
  activateKillSwitch(options: KillSwitchOptions): Promise<void>;
  deactivateKillSwitch(options: KillSwitchOptions): Promise<void>;
  
  resolveEscalation(
    escalationId: string,
    response: EscalationResponse
  ): Promise<void>;
}
```

## Error Classes

```typescript
class BlockedError extends Error {
  reasons: ReasonCode[];
  verdict: Verdict;
}

class EscalationTimeoutError extends Error {
  escalationId: string;
  verdict: Verdict;
}

class EscalationDeniedError extends Error {
  escalationId: string;
  verdict: Verdict;
  denier?: string;
}

class PolicyError extends Error {
  field?: string;
  expected?: string;
  received?: string;
}
```

---

# Glossary

| Term | Definition |
|------|------------|
| **xBPP** | Execution Boundary Permission Protocol - an open standard for autonomous agent governance |
| **Execution Boundary** | The set of constraints defining what actions an agent is permitted to take |
| **Verdict** | The signed decision (ALLOW, BLOCK, ESCALATE) returned after policy evaluation |
| **Posture** | Risk tolerance preset (AGGRESSIVE, BALANCED, CAUTIOUS) |
| **Principal** | The human/organization responsible for an agent's actions |
| **Escalation** | A pause requesting human decision-making |
| **Reason Code** | Standardized identifier explaining why a verdict was reached |

---

# Changelog

## v1.0.0 (January 2025)

- Initial release
- x402 client wrapper
- Direct interpreter API
- TypeScript types
- Testing utilities

---

*End of xBPP SDK Implementation Guide - Execution Boundary Permission Protocol*
