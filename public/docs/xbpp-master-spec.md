# xBPP: Behavioral Policy Protocol

**Master Specification v1.0**

**Status:** Final  
**Date:** January 2025  
**License:** Apache 2.0  
**Primary Integration:** x402 Payment Protocol

---

# Part I: Overview

## What is xBPP?

xBPP (Behavioral Policy Protocol) is an open standard that lets autonomous AI agents make payments safely. It answers a simple question: *"Should this agent be allowed to spend this money?"*

When an AI agent wants to make a payment, xBPP evaluates the request against a policy you define and returns one of three answers:

- **ALLOW** — Proceed with the payment
- **BLOCK** — Stop; this violates policy
- **ESCALATE** — Ask a human to approve

Think of xBPP as a programmable CFO for your AI agents. You set the rules once (budgets, approved vendors, risk tolerance), and xBPP enforces them on every transaction.

## Why Does This Exist?

AI agents are increasingly capable of taking real-world actions—booking travel, purchasing software, paying invoices. But capability without constraint is dangerous:

- An agent with access to a credit card could drain it in seconds
- A compromised agent could send funds to attackers
- Even well-intentioned agents make mistakes

Traditional solutions don't work:
- **Manual approval of every transaction** destroys the value of automation
- **Fixed spending limits** are too blunt (a $100 limit blocks both a $101 legitimate purchase and a $101 fraud)
- **No limits** is unacceptable risk

xBPP provides **graduated autonomy**: agents operate freely within defined boundaries, escalate edge cases to humans, and hard-stop on policy violations.

## How It Works (30-Second Version)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Your Application                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Agent wants to pay $50 to 0xABC...
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        xBPP Interpreter                          │
│                                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
│   │  Action  │ +  │  Policy  │ +  │  State (spent today etc) │  │
│   └──────────┘    └──────────┘    └──────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│                  ┌──────────────┐                                │
│                  │   Verdict    │                                │
│                  │ ALLOW/BLOCK/ │                                │
│                  │   ESCALATE   │                                │
│                  └──────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
          ALLOW             ESCALATE           BLOCK
       Execute via          Human              Stop
         x402              Approval            
```

## Key Concepts

| Concept | What It Is | Example |
|---------|------------|---------|
| **Action** | A proposed payment to evaluate | "Pay $50 USDC to 0xABC on Base" |
| **Policy** | Rules defining what's allowed | "Max $100/tx, $1000/day, ask me above $500" |
| **Verdict** | The evaluation result | ALLOW, BLOCK, or ESCALATE with reasons |
| **State** | Running totals and history | "$340 spent today, 12 transactions" |
| **Posture** | Default risk tolerance | AGGRESSIVE, BALANCED, or CAUTIOUS |

## Example Policy

Here's a policy for a small team's AI purchasing agent:

```json
{
  "schema": "xbpp-pay/v1.0",
  "posture": "BALANCED",
  "limits": {
    "max_single": 500,
    "max_daily": 5000,
    "require_human_above": 1000
  },
  "verification": "BUILT_IN",
  "counterparty_rules": {
    "new_counterparty_action": "ESCALATE"
  }
}
```

This policy says:
- No single payment over $500
- No more than $5,000 per day total
- Human approval required for anything over $1,000
- First-time vendors require human approval
- Use built-in threat detection

## Integration with x402

xBPP is designed to work with the x402 payment protocol. The typical integration:

1. Wrap your x402 client with xBPP
2. Every payment request is automatically evaluated
3. Allowed payments execute normally via x402
4. Blocked payments throw an error
5. Escalations invoke your approval callback

```typescript
import { xbpp } from '@anthropic/xbpp';
import { x402Client } from '@coinbase/x402';

const client = xbpp.wrap(x402Client, {
  maxSingle: 500,
  dailyBudget: 5000,
  askMeAbove: 1000,
  onEscalate: async (request) => promptUser(request)
});

// All payments now go through xBPP
const response = await client.fetch(url);
```

## Who Should Use xBPP?

- **Application developers** building AI agents that handle money
- **Enterprises** deploying autonomous systems with financial access
- **Platforms** offering agent-as-a-service with spending controls
- **Anyone** who needs programmable guardrails on AI spending

## What xBPP Does NOT Do

- **Execute payments** — That's x402's job
- **Custody funds** — xBPP is policy, not a wallet
- **Guarantee counterparty behavior** — Can't prevent a vendor from being malicious
- **Replace legal contracts** — xBPP is technical enforcement, not legal agreement

---

# Part II: Core Specification

This section defines the foundational protocol that all xBPP implementations must support.

## 1. Conformance

### 1.1 Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

### 1.2 Schema Identifier

Implementations MUST identify Core conformance using:

```
xbpp/v1.0
```

Implementations SHOULD also accept `xbpp/v1` as equivalent for compatibility.

### 1.3 Profiles

Profiles extend Core with domain-specific fields. A profile:

- MUST specify a schema identifier (e.g., `xbpp-pay/v1.0`)
- MUST be a strict superset of Core
- MAY add fields to Action, Policy, and Verdict
- MAY add reason codes
- MUST NOT modify Core semantics

This specification defines the **xBPP-pay** profile for payment transactions.

---

## 2. Data Structures

### 2.1 Action

An Action represents a proposed agent behavior to evaluate.

```
Action {
  action_id:    string    OPTIONAL  Client-provided identifier (UUID recommended)
  action_hash:  string    COMPUTED  SHA-256 of canonical action
  timestamp:    datetime  REQUIRED  ISO 8601 format
  
  type:         enum      REQUIRED  PAYMENT | SIGN | APPROVE | CALL
  value:        Value     REQUIRED  Action value
  target:       Target    REQUIRED  Action target
  confidence:   number    REQUIRED  Agent confidence [0.0-1.0]
  
  agent:        Agent     REQUIRED  Agent identification
  context:      object    OPTIONAL  Profile-specific fields
}
```

**Action Types:**

| Type | Description |
|------|-------------|
| `PAYMENT` | Transfer of value |
| `SIGN` | Cryptographic signature |
| `APPROVE` | Authorization grant (e.g., token approval) |
| `CALL` | External contract/API invocation |

**Value:**

```
Value {
  amount:    number  REQUIRED  Numeric value (non-negative)
  currency:  string  REQUIRED  Currency identifier (e.g., "USDC", "ETH")
}
```

**Target:**

```
Target {
  address:  string  REQUIRED  Target identifier (e.g., wallet address)
}
```

**Agent:**

```
Agent {
  agent_id:     string  REQUIRED  Unique agent identifier
  instance_id:  string  OPTIONAL  Specific instance (for multi-instance agents)
  principal:    string  OPTIONAL  Human/entity responsible for agent
}
```

### 2.2 Policy

A Policy declares behavioral constraints for an agent.

```
Policy {
  schema:       string    REQUIRED  "xbpp/v1.0" or profile identifier
  version:      string    REQUIRED  Policy version (for change tracking)
  created_at:   datetime  REQUIRED  ISO 8601 creation timestamp
  expires_at:   datetime  OPTIONAL  Expiration timestamp
  
  posture:      enum      REQUIRED  AGGRESSIVE | BALANCED | CAUTIOUS
  limits:       Limits    REQUIRED  Spending/action limits
  verification: enum      REQUIRED  NONE | BUILT_IN | CUSTOM
  
  signature:    string    OPTIONAL  Policy signature for authentication
  extensions:   object    OPTIONAL  Profile-specific fields
}
```

**Posture:**

| Posture | Description | Use Case |
|---------|-------------|----------|
| `AGGRESSIVE` | Favor action; minimize friction | High-frequency trading, automation |
| `BALANCED` | Balance autonomy and safety | General purpose (default) |
| `CAUTIOUS` | Favor safety; maximize oversight | High-value, compliance-sensitive |

**Limits:**

```
Limits {
  max_single:          number  REQUIRED  Maximum single action value
  max_daily:           number  REQUIRED  Maximum daily cumulative value
  require_human_above: number  REQUIRED  Escalation threshold
}
```

**Verification Mode:**

| Mode | Description |
|------|-------------|
| `NONE` | No external verification |
| `BUILT_IN` | Use implementation's default verification (threat detection, etc.) |
| `CUSTOM` | Use policy-specified verification endpoint |

### 2.3 Verdict

A Verdict is the output of policy evaluation.

```
Verdict {
  eval_id:             string    REQUIRED  Unique evaluation identifier (UUID)
  verdict_hash:        string    COMPUTED  SHA-256 of canonical verdict
  timestamp:           datetime  REQUIRED  Evaluation timestamp
  interpreter_version: string    REQUIRED  Format: {core}.{impl_id}.{impl_ver}
  
  decision:     enum      REQUIRED  ALLOW | BLOCK | ESCALATE
  reasons:      string[]  REQUIRED  Reason codes (may be empty for ALLOW)
  warnings:     string[]  OPTIONAL  Warning codes (non-blocking issues)
  
  valid_until:  datetime  REQUIRED  Verdict expiration (default: 60 seconds)
  constraints:  object    OPTIONAL  Constraints on execution
  
  evidence:     Evidence  REQUIRED  Evaluation evidence
  audit:        Audit     REQUIRED  Audit payload
  escalation:   Escalation OPTIONAL Present only if decision is ESCALATE
}
```

**Decision:**

| Decision | Description | Agent Behavior |
|----------|-------------|----------------|
| `ALLOW` | Action permitted | May proceed to execution |
| `BLOCK` | Action denied | MUST NOT proceed |
| `ESCALATE` | Requires human approval | Await approval or timeout |

**Evidence:**

```
Evidence {
  policy_hash:      string    REQUIRED  Hash of evaluated policy
  policy_version:   string    REQUIRED  Version of evaluated policy
  registry_version: string    OPTIONAL  Registry version if used
  
  checks_performed: string[]  REQUIRED  List of checks run
  checks_passed:    string[]  REQUIRED  Checks that passed
  checks_failed:    string[]  REQUIRED  Checks that failed
  
  revocation_checked_at: datetime OPTIONAL  Last revocation check
}
```

**Audit:**

```
Audit {
  action_hash:     string  REQUIRED  Hash of evaluated action
  policy_snapshot: string  REQUIRED  Hash of policy at evaluation time
  state_snapshot:  string  REQUIRED  Hash of runtime state at evaluation
}
```

**Escalation** (present only when decision is `ESCALATE`):

```
Escalation {
  escalation_id:  string    REQUIRED  Unique escalation identifier
  reason:         string    REQUIRED  Primary escalation reason code
  approver:       string    OPTIONAL  Designated approver identifier
  timeout_at:     datetime  REQUIRED  When escalation expires
}
```

### 2.4 Hash Computation

**Action Hash:**

```
action_hash = SHA-256(canonical_json(action_without_hash))
```

**Verdict Hash:**

```
verdict_hash = SHA-256(canonical_json(verdict_core))
```

Where `verdict_core` includes only: `eval_id`, `decision`, `reasons`, `valid_until`, `evidence.policy_hash`, `audit.action_hash`.

**Canonical JSON Rules:**

- Keys sorted alphabetically at each nesting level
- No whitespace between tokens
- Numbers: no leading zeros, no trailing zeros after decimal, no positive sign
- Strings: UTF-8, minimal escaping
- Null/undefined values: omit field entirely
- Arrays: preserve order

For precision-critical values (amounts > 2^53), use string representation.

---

## 3. Runtime State

### 3.1 State Structure

```
State {
  // Spending tracking (separated for race condition safety)
  tentative_spend_today:   number    Pending (unconfirmed) daily spend
  confirmed_spend_today:   number    Confirmed daily spend
  tentative_spend_week:    number    Pending weekly spend
  confirmed_spend_week:    number    Confirmed weekly spend
  tentative_spend_month:   number    Pending monthly spend
  confirmed_spend_month:   number    Confirmed monthly spend
  
  // Rate limiting
  actions_last_minute:     integer   Actions in rolling 60-second window
  actions_last_hour:       integer   Actions in rolling 1-hour window
  actions_today:           integer   Actions since daily reset
  
  // Escalation tracking
  pending_escalations:     integer   Unresolved escalation count
  
  // Duplicate detection
  recent_action_hashes:    string[]  Hashes within duplicate window
  
  // Emergency controls
  kill_switch_active:      boolean   Emergency stop flag
  kill_switch_scope:       enum      AGENT | PRINCIPAL | GLOBAL
  
  // Time
  current_time:            datetime  Evaluation timestamp
  timezone:                string    Default: "UTC"
  daily_reset_time:        string    Default: "00:00"
}
```

### 3.2 Tentative vs. Confirmed Spend

To prevent both "ghost blocking" (failed transactions blocking budget) and "double spend" (budget released before on-chain finality), xBPP uses a two-phase commit model with **lock duration**.

**Key Distinction:**

- `valid_until`: How long the agent has to **submit** the transaction (short, default 60s)
- `lock_duration`: How long tentative spend is **held** against limits (long, default 1 hour)

**Lifecycle:**

```
1. evaluate() returns ALLOW
   → Add value to tentative_spend
   → Set lock_expiry = now + lock_duration (default: 1 hour)

2a. confirm(eval_id, tx_reference) called
   → Move value from tentative_spend to confirmed_spend
   → Clear lock

2b. void(eval_id, reason) called
   → Remove value from tentative_spend
   → Clear lock

2c. lock_expiry reached without confirm/void
   → Remove value from tentative_spend (auto-void)
   → Log as LOCK_EXPIRED
```

**Required Functions:**

```
confirm(eval_id: string, tx_reference: string) → boolean
void(eval_id: string, reason: string) → boolean
```

**Limit Evaluation:**

When evaluating limits, implementations MUST use:

```
effective_spend = confirmed_spend + tentative_spend
```

This ensures pending transactions count against limits even if not yet confirmed.

**Lock Duration Configuration:**

Policies MAY specify `lock_duration_seconds` (default: 3600). Implementations SHOULD allow override based on chain finality characteristics.

### 3.3 Escalation Lifecycle

When a verdict returns `ESCALATE`:

1. **Pending State**: Escalation is created with `escalation_id` and `timeout_at`
2. **Approval Flow**: Human reviews via implementation-specific mechanism
3. **Resolution**:
   - **Approved**: Implementation calls internal `approve(escalation_id)`, original action proceeds as ALLOW
   - **Denied**: Implementation calls internal `deny(escalation_id)`, treated as BLOCK
   - **Timeout**: `timeout_at` reached, automatically treated as BLOCK with reason `ESCALATION_TIMEOUT`
   - **Modified Approval**: If policy allows, human may approve a different amount

**Important**: A new `eval_id` is NOT generated on approval. The original verdict's `eval_id` is used for confirmation, maintaining audit continuity.

---

## 4. Interpreter Semantics

### 4.1 Function Signature

```
evaluate(action: Action, policy: Policy, state: State) → Verdict
```

The interpreter MUST be deterministic: identical inputs MUST produce identical outputs.

### 4.2 Evaluation Sequence

Implementations MUST evaluate in this exact order. Each step may produce a decision (BLOCK, ESCALATE, or continue).

**Phase 1: Validation**

| Step | Check | Failure Codes |
|------|-------|---------------|
| 1.1 | Policy schema is `xbpp/v1.0` or recognized profile | `SCHEMA_UNSUPPORTED` |
| 1.2 | Policy not expired (`expires_at` not passed) | `POLICY_EXPIRED` |
| 1.3 | Required policy fields present | `INVALID_POLICY` |
| 1.4 | Policy signature valid (if present) | `POLICY_SIGNATURE_INVALID` |

**Phase 2: Emergency Checks**

| Step | Check | Failure Codes |
|------|-------|---------------|
| 2.1 | Kill switch not active | `KILL_SWITCH_ACTIVE` |

**Phase 3: Input Validation**

| Step | Check | Failure Codes |
|------|-------|---------------|
| 3.1 | Action schema valid | `EVALUATION_ERROR` |
| 3.2 | Confidence in range [0.0, 1.0] | `INVALID_CONFIDENCE` |
| 3.3 | Value non-negative | `INVALID_VALUE` |
| 3.4 | Value within precision limits | `INVALID_VALUE` |

**Phase 4: Core Limits**

| Step | Check | Failure Codes |
|------|-------|---------------|
| 4.1 | Value ≤ `max_single` | `EXCEEDS_SINGLE_LIMIT` |
| 4.2 | Value + effective_spend_today ≤ `max_daily` | `EXCEEDS_DAILY_LIMIT` |

**Phase 5: Duplicate Detection**

| Step | Check | Failure Codes |
|------|-------|---------------|
| 5.1 | Action hash not in `recent_action_hashes` | `DUPLICATE_ACTION` |

**Phase 6: Verification** (if mode ≠ `NONE`)

| Step | Check | Failure Codes |
|------|-------|---------------|
| 6.1 | Verification service reachable | `VERIFICATION_UNAVAILABLE` |
| 6.2 | Verification returns success | `VERIFICATION_ERROR` |
| 6.3 | Verification within timeout | `VERIFICATION_TIMEOUT` |
| 6.4 | Target not revoked in registry | `REVOKED_TARGET` |

**Phase 7: Profile Checks** (xBPP-pay inserts here)

See Section 6 for xBPP-pay specific checks.

**Phase 8: Escalation Triggers**

| Step | Check | Result Codes |
|------|-------|--------------|
| 8.1 | Value > `require_human_above` | `HIGH_VALUE` → ESCALATE |
| 8.2 | Profile-specific triggers | Profile-defined |

**Phase 9: Final Decision**

```
IF any check returned BLOCK:
    decision = BLOCK
    reasons = all BLOCK reason codes
    
ELSE IF any check returned ESCALATE:
    decision = ESCALATE
    reasons = all ESCALATE reason codes
    
ELSE:
    decision = ALLOW
    reasons = []
```

### 4.3 Posture Defaults

When policy does not specify behavior for ambiguous situations, posture determines the default:

| Situation | AGGRESSIVE | BALANCED | CAUTIOUS |
|-----------|------------|----------|----------|
| Unknown field in action | Ignore | Warn | Block |
| Verification unavailable | Allow | Escalate | Block |
| Near daily limit (>80%) | Allow | Warn | Escalate |
| New counterparty | Allow | Escalate | Block |
| Unknown chain | Escalate | Block | Block |

### 4.4 Numeric Precision

To prevent precision-based attacks:

- Implementations MUST support at least 18 decimal places for crypto values
- Comparisons MUST use exact arithmetic (not floating point)
- Values exceeding safe integer range (2^53) MUST use string representation in JSON

---

## 5. Reason Codes (Core)

Implementations MUST use these exact reason codes for Core conditions.

### 5.1 Value & Limits

| Code | Decision | Description |
|------|----------|-------------|
| `EXCEEDS_SINGLE_LIMIT` | BLOCK | Value exceeds `max_single` |
| `EXCEEDS_DAILY_LIMIT` | BLOCK | Would exceed `max_daily` |
| `INVALID_VALUE` | BLOCK | Value malformed, negative, or precision overflow |
| `ZERO_VALUE` | varies | Value is zero (profile-dependent behavior) |

### 5.2 Verification

| Code | Decision | Description |
|------|----------|-------------|
| `VERIFICATION_UNAVAILABLE` | varies | Verification service unreachable |
| `VERIFICATION_ERROR` | varies | Verification returned error |
| `VERIFICATION_TIMEOUT` | varies | Verification timed out |
| `REVOKED_TARGET` | BLOCK | Target revoked in registry |

### 5.3 Escalation

| Code | Decision | Description |
|------|----------|-------------|
| `HIGH_VALUE` | ESCALATE | Value exceeds `require_human_above` |
| `ESCALATION_TIMEOUT` | BLOCK | Escalation expired without response |
| `NO_PRINCIPAL_FOR_ESCALATION` | varies | No principal to escalate to |

### 5.4 Policy

| Code | Decision | Description |
|------|----------|-------------|
| `INVALID_POLICY` | BLOCK | Policy is malformed |
| `POLICY_EXPIRED` | BLOCK | Policy `expires_at` has passed |
| `POLICY_REQUIRED` | BLOCK | No policy provided |
| `SCHEMA_UNSUPPORTED` | BLOCK | Unrecognized schema identifier |
| `POLICY_SIGNATURE_INVALID` | BLOCK | Policy signature verification failed |

### 5.5 System

| Code | Decision | Description |
|------|----------|-------------|
| `EVALUATION_ERROR` | BLOCK | Interpreter error |
| `INVALID_CONFIDENCE` | BLOCK | Confidence outside [0.0, 1.0] |
| `DUPLICATE_ACTION` | BLOCK | Action hash seen within duplicate window |
| `KILL_SWITCH_ACTIVE` | BLOCK | Emergency stop engaged |
| `LOCK_EXPIRED` | info | Tentative spend released after lock duration |

---

# Part III: xBPP-pay Profile

This section defines the payment-specific extensions to xBPP Core for use with x402 and stablecoin transactions.

## 6. Extended Action Fields

### 6.1 Value Extensions

```
PayValue extends Value {
  amount:          number  REQUIRED  From Core
  currency:        string  REQUIRED  From Core
  
  token_type:      enum    OPTIONAL  FUNGIBLE | NFT | SEMI_FUNGIBLE
  token_id:        string  OPTIONAL  For NFTs
  token_contract:  string  OPTIONAL  Token contract address
}
```

### 6.2 Gas

```
Gas {
  estimate:     number  REQUIRED  Estimated gas cost (in gas currency)
  currency:     string  REQUIRED  Gas currency (e.g., "ETH")
  max_willing:  number  REQUIRED  Maximum acceptable gas (for limit calculation)
}
```

**Critical**: When evaluating limits, implementations MUST use `max_willing`, not `estimate`. This prevents agents from gaming limits with artificially low estimates.

### 6.3 Target Extensions

```
PayTarget extends Target {
  address:  string  REQUIRED  From Core
  
  type:     enum    OPTIONAL  EOA | CONTRACT | MULTISIG | PROXY | AGENT | UNKNOWN
  name:     string  OPTIONAL  Human-readable name
  verified: boolean OPTIONAL  Verification status from registry
}
```

### 6.4 Chain

```
Chain {
  id:  string  REQUIRED  Chain identifier (e.g., "base", "ethereum")
  
  cross_chain: {
    is_bridge:          boolean  OPTIONAL  Is this a bridge transaction
    source_chain:       string   OPTIONAL  Origin chain
    destination_chain:  string   OPTIONAL  Destination chain
  }
}
```

### 6.5 Recurring Payments

```
Recurring {
  is_recurring:     boolean  REQUIRED  Is this a recurring payment
  frequency:        enum     OPTIONAL  DAILY | WEEKLY | MONTHLY | YEARLY
  instance:         integer  OPTIONAL  Which instance (1, 2, 3...)
  original_amount:  number   OPTIONAL  Amount from initial authorization
}
```

### 6.6 Pre-authorization

```
Preauth {
  preauth_id:       string    REQUIRED  Original preauth identifier
  original_amount:  number    REQUIRED  Pre-authorized amount
  created_at:       datetime  REQUIRED  When preauth was created
}
```

### 6.7 Context Extensions

```
PayContext {
  user_initiated:  boolean  OPTIONAL  Triggered by direct user action
  category:        string   OPTIONAL  Spending category (e.g., "travel")
  memo:            string   OPTIONAL  Human-readable description
}
```

### 6.8 Complete Pay Action

```
PayAction extends Action {
  // Core fields
  action_id, action_hash, timestamp, type, confidence, agent
  
  // Extended fields
  value:        PayValue
  target:       PayTarget
  chain:        Chain       REQUIRED for xBPP-pay
  gas:          Gas         OPTIONAL (REQUIRED if gas_rules.include_in_limits)
  recurring:    Recurring   OPTIONAL
  preauth:      Preauth     OPTIONAL
  context:      PayContext  OPTIONAL
}
```

---

## 7. Extended Policy Fields

### 7.1 Extended Limits

```
PayLimits extends Limits {
  max_single:          number  REQUIRED  From Core
  max_daily:           number  REQUIRED  From Core
  require_human_above: number  REQUIRED  From Core
  
  max_weekly:          number  OPTIONAL  Maximum weekly spend
  max_monthly:         number  OPTIONAL  Maximum monthly spend
}
```

### 7.2 Value Rules

```
ValueRules {
  base_currency:            string    REQUIRED  Currency for limit evaluation (e.g., "USD")
  
  accepted_currencies:      string[]  OPTIONAL  Accepted without conversion (e.g., ["USDC", "USDT"])
  convertible_currencies:   string[]  OPTIONAL  Accepted with conversion (e.g., ["ETH"])
  blocked_currencies:       string[]  OPTIONAL  Always rejected
  
  unknown_currency_action:  enum      OPTIONAL  BLOCK | ESCALATE (default: BLOCK)
  
  conversion_source:        enum      OPTIONAL  BUILT_IN | CUSTOM
  max_price_age_seconds:    integer   OPTIONAL  Maximum oracle staleness (default: 60)
  volatile_token_buffer:    number    OPTIONAL  Buffer for volatile tokens (default: 0.05)
  
  min_value:                number    OPTIONAL  Minimum transaction value
  max_value:                number    OPTIONAL  Hard cap (overrides max_single)
  allow_zero:               boolean   OPTIONAL  Allow zero-value transactions (default: false)
}
```

### 7.3 Gas Rules

```
GasRules {
  include_in_limits:    boolean  OPTIONAL  Count gas toward limits (default: true)
  use_max_willing:      boolean  OPTIONAL  Use max_willing for limits (default: true, REQUIRED)
  buffer_tolerance:     number   OPTIONAL  Acceptable variance from estimate (default: 0.10)
  over_buffer_action:   enum     OPTIONAL  ALLOW_WITH_WARNING | BLOCK (default: WARN)
  max_gas_price:        number   OPTIONAL  Maximum acceptable gas price
}
```

**Critical**: `use_max_willing` MUST default to true. Budget calculations MUST use `gas.max_willing`, not `gas.estimate`.

### 7.4 Time Rules

```
TimeRules {
  timezone:       string  OPTIONAL  Timezone for resets (default: "UTC")
  daily_reset:    string  OPTIONAL  Daily reset time HH:MM (default: "00:00")
  weekly_reset:   string  OPTIONAL  Weekly reset day (default: "MONDAY")
  lock_duration:  integer OPTIONAL  Tentative spend lock in seconds (default: 3600)
}
```

### 7.5 Chain Rules

```
ChainRules {
  allowed_chains:            string[]  OPTIONAL  Permitted chains (empty = all allowed)
  default_chain:             string    OPTIONAL  Default if not specified
  
  unknown_chain_action:      enum      OPTIONAL  BLOCK | ESCALATE | ALLOW
  cross_chain_action:        enum      OPTIONAL  BLOCK | ESCALATE | ALLOW
  bridge_transaction_action: enum      OPTIONAL  BLOCK | ESCALATE | ALLOW
}
```

**Posture Defaults:**

| Posture | unknown_chain | cross_chain | bridge |
|---------|---------------|-------------|--------|
| AGGRESSIVE | ESCALATE | ALLOW | ESCALATE |
| BALANCED | BLOCK | ESCALATE | ESCALATE |
| CAUTIOUS | BLOCK | BLOCK | BLOCK |

### 7.6 Counterparty Rules

```
CounterpartyRules {
  require_verified:         boolean   OPTIONAL  Require registry verification
  new_counterparty_action:  enum      OPTIONAL  ALLOW | ESCALATE | BLOCK
  
  allow_contracts:          boolean   OPTIONAL  Allow contract targets (default: true)
  allow_eoa:                boolean   OPTIONAL  Allow EOA targets (default: true)
  allow_multisig:           boolean   OPTIONAL  Allow multisig targets (default: true)
  allow_proxy:              enum      OPTIONAL  BLOCK | ESCALATE | ALLOW
  
  min_contract_age_hours:   integer   OPTIONAL  Minimum contract age
  allow_self_payment:       boolean   OPTIONAL  Allow paying own address (default: false)
  allow_agent_to_agent:     enum      OPTIONAL  BLOCK | ESCALATE | ALLOW
  
  merchant_allowlist:       string[]  OPTIONAL  Always-allowed addresses
  merchant_blocklist:       string[]  OPTIONAL  Always-blocked addresses
  blocklist_priority:       boolean   OPTIONAL  Blocklist overrides allowlist (default: true)
  
  verification_expiry_days: integer   OPTIONAL  Verification staleness limit
}
```

### 7.7 Rate Limits

```
RateLimits {
  max_per_minute:       integer  OPTIONAL  Actions per minute
  max_per_hour:         integer  OPTIONAL  Actions per hour
  max_per_day:          integer  OPTIONAL  Actions per day
  
  burst_detection:      boolean  OPTIONAL  Enable burst detection
  burst_threshold:      integer  OPTIONAL  Actions in burst window
  burst_window_seconds: integer  OPTIONAL  Burst detection window
  burst_window_type:    enum     OPTIONAL  FIXED | SLIDING (default: SLIDING)
  burst_action:         enum     OPTIONAL  BLOCK | ESCALATE
}
```

**Posture Defaults:**

| Posture | max_per_minute | burst_threshold |
|---------|----------------|-----------------|
| AGGRESSIVE | 20 | 10 |
| BALANCED | 10 | 5 |
| CAUTIOUS | 5 | 3 |

### 7.8 Confidence Rules

```
ConfidenceRules {
  require_confidence:     boolean  OPTIONAL  Require confidence score
  min_confidence:         number   OPTIONAL  Global minimum confidence
  
  confidence_by_action: {
    PAYMENT:  number  OPTIONAL
    SIGN:     number  OPTIONAL
    APPROVE:  number  OPTIONAL
    CALL:     number  OPTIONAL
  }
  
  confidence_by_value: [
    { min: number, max: number | null, threshold: number }
  ]
}
```

**Posture Defaults:**

| Posture | min_confidence |
|---------|----------------|
| AGGRESSIVE | 0.5 |
| BALANCED | 0.7 |
| CAUTIOUS | 0.9 |

### 7.9 Security Rules

```
SecurityRules {
  pattern_matching:       enum     OPTIONAL  NONE | BUILT_IN | CUSTOM
  pattern_match_action: {
    exact:        enum  OPTIONAL  BLOCK | ESCALATE
    fuzzy_high:   enum  OPTIONAL  BLOCK | ESCALATE
    fuzzy_medium: enum  OPTIONAL  ESCALATE | WARN
    fuzzy_low:    enum  OPTIONAL  WARN | ALLOW
  }
  fuzzy_threshold:        number   OPTIONAL  Fuzzy match sensitivity
  
  zero_day_protection:    boolean  OPTIONAL  Enable heuristic detection
  zero_day_action:        enum     OPTIONAL  BLOCK | ESCALATE
}

KnownThreats {
  address_poisoning:    enum  OPTIONAL  BLOCK | ESCALATE | WARN (default: BLOCK)
  phishing_signature:   enum  OPTIONAL  BLOCK | ESCALATE | WARN (default: BLOCK)
  drainer_contract:     enum  OPTIONAL  BLOCK | ESCALATE | WARN (default: BLOCK)
  honeypot_token:       enum  OPTIONAL  BLOCK | ESCALATE | WARN (default: BLOCK)
}

ContractSecurity {
  check_contract_verification:  boolean  OPTIONAL  Check source verification
  unverified_contract_action:   enum     OPTIONAL  BLOCK | ESCALATE | WARN
  
  check_admin_key:              boolean  OPTIONAL  Check for admin keys
  admin_key_action:             enum     OPTIONAL  BLOCK | ESCALATE | WARN
  
  check_proxy:                  boolean  OPTIONAL  Check proxy patterns
  proxy_action:                 enum     OPTIONAL  BLOCK | ESCALATE | WARN
}

AdversarialRules {
  fragmentation_detection:       boolean  OPTIONAL  Detect split transactions
  fragmentation_window_minutes:  integer  OPTIONAL  Detection window
  fragmentation_threshold:       integer  OPTIONAL  Suspicious transaction count
  fragmentation_action:          enum     OPTIONAL  BLOCK | ESCALATE | WARN
}
```

### 7.10 Escalation Rules

```
EscalationRules {
  escalation_timeout_minutes:  integer  OPTIONAL  Time before timeout (default: 60)
  timeout_action:              enum     OPTIONAL  BLOCK | ALLOW (default: BLOCK)
  
  max_pending_escalations:     integer  OPTIONAL  Queue limit
  escalation_backlog_action:   enum     OPTIONAL  BLOCK | QUEUE
  
  require_explicit_approval:   boolean  OPTIONAL  Require explicit yes/no
  allow_modified_approval:     boolean  OPTIONAL  Allow approving different amount
  modification_limits: {
    amount_increase:  number  OPTIONAL  Max increase factor (0 = none)
    amount_decrease:  number  OPTIONAL  Max decrease factor (1.0 = any)
  }
  
  no_principal_action:         enum     OPTIONAL  BLOCK | ALLOW_WITH_RISK
  default_approver:            string   OPTIONAL  Fallback approver
}
```

### 7.11 Recurring Payment Rules

```
RecurringRules {
  allow_recurring:              boolean  OPTIONAL  Allow recurring payments
  max_recurring_amount:         number   OPTIONAL  Max per recurring instance
  max_recurring_frequency:      enum     OPTIONAL  Most frequent allowed (DAILY = no faster)
  require_initial_approval:     boolean  OPTIONAL  Human approves first instance
  recurring_variance_tolerance: number   OPTIONAL  Acceptable amount variance (0.1 = 10%)
}
```

### 7.12 Pre-authorization Rules

```
PreauthRules {
  allow_preauth:              boolean  OPTIONAL  Allow pre-authorizations
  preauth_validity_hours:     integer  OPTIONAL  How long preauths last
  capture_variance_tolerance: number   OPTIONAL  Acceptable capture variance
  capture_over_preauth:       enum     OPTIONAL  BLOCK | ESCALATE
  allow_split_capture:        boolean  OPTIONAL  Multiple captures against one preauth
  max_capture_count:          integer  OPTIONAL  Maximum capture count per preauth
}
```

### 7.13 Audit Configuration

```
AuditConfig {
  log_level:               enum     OPTIONAL  MINIMAL | STANDARD | VERBOSE
  include_action_details:  boolean  OPTIONAL  Log full action in storage
  include_policy_snapshot: boolean  OPTIONAL  Log full policy in storage
  include_state_snapshot:  boolean  OPTIONAL  Log full state in storage
  redact_pii:              boolean  OPTIONAL  Redact sensitive data
  retention_days:          integer  OPTIONAL  Log retention period
}
```

**Note**: The Verdict object always contains hashes for wire transmission. `AuditConfig` controls what is stored in persistent logs.

---

## 8. Extended Evaluation Sequence

xBPP-pay inserts additional checks into Core Phase 7 (Profile Checks).

### 8.1 Pay-Specific Checks

After Core Phase 6 (Verification), insert:

**7a. Gas Check** (if gas present and `include_in_limits` is true)

```
total_value = action.value.amount + action.gas.max_willing  // NOT estimate!
```

- Total value ≤ effective limit
- Gas.max_willing within buffer tolerance of estimate
- → Fail: `GAS_EXCEEDS_BUFFER`, `GAS_PRICE_TOO_HIGH`

**7b. Extended Limits**

- Value + effective_spend_week ≤ `max_weekly`
- Value + effective_spend_month ≤ `max_monthly`
- → Fail: `EXCEEDS_WEEKLY_LIMIT`, `EXCEEDS_MONTHLY_LIMIT`

**7c. Rate Limit Check**

- Actions this minute ≤ `max_per_minute`
- Actions this hour ≤ `max_per_hour`
- Burst detection (sliding window)
- → Fail: `RATE_LIMITED`, `BURST_DETECTED`

**7d. Currency Check**

- Currency in `accepted_currencies` or `convertible_currencies`
- Price oracle age ≤ `max_price_age_seconds`
- Conversion succeeds (if needed)
- → Fail: `UNSUPPORTED_CURRENCY`, `UNKNOWN_CURRENCY`, `PRICE_STALE`, `CONVERSION_FAILED`

**7e. Chain Check**

- Chain in `allowed_chains` (if specified)
- Cross-chain rules
- Bridge rules
- → Fail: `CHAIN_NOT_ALLOWED`, `UNKNOWN_CHAIN`, `CROSS_CHAIN_TRANSACTION`, `BRIDGE_TRANSACTION`

**7f. Counterparty Check**

- Not in `merchant_blocklist`
- In `merchant_allowlist` (if require_verified and present) OR verified in registry
- Contract age ≥ `min_contract_age_hours`
- Target type allowed
- Not self-payment (unless allowed)
- → Fail: `BLOCKLISTED_MERCHANT`, `UNVERIFIED_MERCHANT`, `NEW_COUNTERPARTY`, `NEW_CONTRACT`, `SELF_PAYMENT`

**7g. Security Check**

- Pattern matching against threat registry
- Contract security checks
- Known threat signatures
- → Fail: `PATTERN_MATCH_EXACT`, `DRAINER_CONTRACT`, `ADDRESS_POISONING`, etc.

**7h. Recurring/Preauth Check** (if applicable)

- Recurring rules validation
- Preauth validity and capture limits
- → Fail: `RECURRING_NOT_ALLOWED`, `PREAUTH_EXPIRED`, `CAPTURE_OVER_PREAUTH`

**7i. Adversarial Check**

- Fragmentation detection
- → Fail: `FRAGMENTATION_DETECTED`

**7j. Confidence Check**

- Confidence ≥ threshold for action type
- Confidence ≥ threshold for value tier
- → Fail: `LOW_CONFIDENCE`

### 8.2 Currency Conversion

For limit comparison, convert to `base_currency`:

```
base_value = convert(
  action.value.amount, 
  action.value.currency, 
  policy.value_rules.base_currency
)
```

**Oracle Requirements:**

- Price source MUST be no older than `max_price_age_seconds` (default: 60)
- If oracle is stale, return `PRICE_STALE` based on posture:
  - AGGRESSIVE: Warn and continue with last known price
  - BALANCED: Escalate
  - CAUTIOUS: Block

---

## 9. Extended Reason Codes (xBPP-pay)

### 9.1 Value & Currency

| Code | Decision | Description |
|------|----------|-------------|
| `DUST_AMOUNT` | BLOCK | Value below `min_value` |
| `EXCEEDS_MAX_VALUE` | BLOCK | Value exceeds hard cap |
| `EXCEEDS_WEEKLY_LIMIT` | BLOCK | Would exceed `max_weekly` |
| `EXCEEDS_MONTHLY_LIMIT` | BLOCK | Would exceed `max_monthly` |
| `UNSUPPORTED_CURRENCY` | BLOCK | Currency in `blocked_currencies` |
| `UNKNOWN_CURRENCY` | varies | Currency not recognized |
| `PRICE_STALE` | varies | Oracle data too old |
| `CONVERSION_FAILED` | varies | Price conversion failed |

### 9.2 Gas

| Code | Decision | Description |
|------|----------|-------------|
| `GAS_EXCEEDS_BUFFER` | varies | Gas significantly over estimate |
| `GAS_PRICE_TOO_HIGH` | varies | Gas price exceeds maximum |
| `GAS_CURRENCY_UNSUPPORTED` | BLOCK | Gas currency cannot be converted |

### 9.3 Chain & Network

| Code | Decision | Description |
|------|----------|-------------|
| `CHAIN_NOT_ALLOWED` | BLOCK | Chain not in `allowed_chains` |
| `UNKNOWN_CHAIN` | varies | Chain not recognized |
| `CROSS_CHAIN_TRANSACTION` | varies | Cross-chain operation detected |
| `BRIDGE_TRANSACTION` | varies | Bridge operation detected |

### 9.4 Counterparty

| Code | Decision | Description |
|------|----------|-------------|
| `BLOCKLISTED_MERCHANT` | BLOCK | Target in blocklist |
| `UNVERIFIED_MERCHANT` | varies | Target not verified |
| `NEW_COUNTERPARTY` | varies | First transaction with target |
| `NEW_CONTRACT` | varies | Contract too new |
| `PROXY_CONTRACT` | varies | Proxy contract detected |
| `SELF_PAYMENT` | varies | Self-payment detected |
| `AGENT_TO_AGENT` | varies | Agent-to-agent payment |
| `VERIFICATION_EXPIRED` | varies | Verification is stale |

### 9.5 Rate & Timing

| Code | Decision | Description |
|------|----------|-------------|
| `RATE_LIMITED` | BLOCK | Rate limit exceeded |
| `BURST_DETECTED` | varies | Burst pattern detected |
| `RECURRING_NOT_ALLOWED` | BLOCK | Recurring payments disabled |
| `RECURRING_OVER_LIMIT` | BLOCK | Recurring exceeds limit |
| `RECURRING_VARIANCE` | varies | Amount differs from original |
| `RECURRING_INITIAL_APPROVAL` | ESCALATE | First instance needs approval |
| `PREAUTH_EXPIRED` | BLOCK | Pre-authorization expired |
| `CAPTURE_OVER_PREAUTH` | varies | Capture exceeds preauth |

### 9.6 Security

| Code | Decision | Description |
|------|----------|-------------|
| `PATTERN_MATCH_EXACT` | BLOCK | Exact threat match |
| `PATTERN_MATCH_FUZZY` | varies | Fuzzy threat match |
| `ZERO_DAY_HEURISTIC` | varies | Heuristic threat detection |
| `UNVERIFIED_CONTRACT` | varies | Contract source not verified |
| `ADMIN_KEY_DETECTED` | varies | Admin key pattern found |
| `ADDRESS_POISONING` | BLOCK | Address poisoning detected |
| `PHISHING_SIGNATURE` | BLOCK | Phishing pattern detected |
| `DRAINER_CONTRACT` | BLOCK | Known drainer contract |
| `HONEYPOT_TOKEN` | BLOCK | Known honeypot token |

### 9.7 Confidence

| Code | Decision | Description |
|------|----------|-------------|
| `LOW_CONFIDENCE` | varies | Below confidence threshold |

### 9.8 Adversarial

| Code | Decision | Description |
|------|----------|-------------|
| `FRAGMENTATION_DETECTED` | varies | Split transaction pattern |

### 9.9 Escalation Resolution

| Code | Decision | Description |
|------|----------|-------------|
| `ESCALATION_BACKLOG` | varies | Too many pending escalations |
| `STANDING_APPROVAL` | ALLOW | Matched standing approval |
| `HUMAN_OVERRIDE` | ALLOW | Human approved override |
| `MODIFICATION_EXCEEDS_LIMITS` | BLOCK | Modified approval out of bounds |

---

## 10. Default Policies

### 10.1 Starter (Individual Developers)

```json
{
  "schema": "xbpp-pay/v1.0",
  "version": "1",
  "posture": "BALANCED",
  "limits": {
    "max_single": 100,
    "max_daily": 1000,
    "require_human_above": 500
  },
  "verification": "BUILT_IN"
}
```

### 10.2 Team

```json
{
  "schema": "xbpp-pay/v1.0",
  "version": "1",
  "posture": "BALANCED",
  "limits": {
    "max_single": 500,
    "max_daily": 5000,
    "max_weekly": 20000,
    "require_human_above": 1000
  },
  "verification": "BUILT_IN",
  "counterparty_rules": {
    "new_counterparty_action": "ESCALATE"
  }
}
```

### 10.3 Enterprise

```json
{
  "schema": "xbpp-pay/v1.0",
  "version": "1",
  "posture": "CAUTIOUS",
  "limits": {
    "max_single": 1000,
    "max_daily": 10000,
    "max_weekly": 50000,
    "max_monthly": 200000,
    "require_human_above": 500
  },
  "verification": "BUILT_IN",
  "value_rules": {
    "base_currency": "USD",
    "accepted_currencies": ["USDC", "USDT"],
    "max_price_age_seconds": 30
  },
  "counterparty_rules": {
    "require_verified": true,
    "new_counterparty_action": "BLOCK"
  },
  "audit": {
    "log_level": "VERBOSE",
    "retention_days": 2555
  }
}
```

### 10.4 High-Frequency Automation

```json
{
  "schema": "xbpp-pay/v1.0",
  "version": "1",
  "posture": "AGGRESSIVE",
  "limits": {
    "max_single": 500,
    "max_daily": 50000,
    "max_weekly": 250000,
    "require_human_above": 2500
  },
  "verification": "BUILT_IN",
  "rate_limits": {
    "max_per_minute": 50,
    "max_per_hour": 500,
    "burst_detection": false
  },
  "confidence_rules": {
    "min_confidence": 0.5
  }
}
```

---

# Part IV: x402 Integration

## 11. Integration Architecture

### 11.1 Flow Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Application                                │
│                                                                   │
│   const client = xbpp.wrap(x402Client, policy);                  │
│   await client.fetch(url);  // Payment request                    │
└──────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                     xBPP Middleware                               │
│                                                                   │
│   1. Intercept payment request                                    │
│   2. Build Action from request                                    │
│   3. Call evaluate(action, policy, state)                        │
│   4. Handle verdict:                                              │
│      - ALLOW: Proceed to x402                                     │
│      - BLOCK: Throw BlockedError                                  │
│      - ESCALATE: Invoke callback, await resolution                │
└──────────────────────────────────────────────────────────────────┘
                                │
                         (if ALLOW)
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                       x402 Client                                 │
│                                                                   │
│   Execute payment on-chain                                        │
│   Return transaction result                                       │
└──────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                     xBPP Confirmation                             │
│                                                                   │
│   On success: confirm(eval_id, tx_hash)                          │
│   On failure: void(eval_id, reason)                              │
└──────────────────────────────────────────────────────────────────┘
```

### 11.2 Wire Format

Include lightweight verdict in x402 payment header:

```
X-XBPP-Verdict: <base64url-encoded-lightweight-verdict>
```

**Lightweight Verdict Structure:**

```json
{
  "eval_id": "uuid",
  "decision": "ALLOW",
  "verdict_hash": "sha256...",
  "valid_until": "ISO8601"
}
```

### 11.3 Content Type

```
application/vnd.xbpp.verdict+json
```

### 11.4 Confirmation Payload

After successful x402 payment:

```json
{
  "eval_id": "uuid",
  "tx_hash": "0x...",
  "block_number": 12345,
  "actual_gas": 0.002,
  "confirmed_at": "ISO8601"
}
```

---

## 12. Registry Interface

### 12.1 Required Registry Functions

```typescript
interface XBPPRegistry {
  // Merchant verification
  getMerchant(address: string): MerchantData | null;
  
  // Threat detection  
  matchPatterns(action: Action): PatternMatch[];
  
  // Token data
  getTokenData(symbol: string, chain: string): TokenData | null;
  
  // Price conversion
  convertToBase(amount: number, currency: string, base: string): ConversionResult;
  
  // Agent registry
  isKnownAgent(address: string): boolean;
  
  // Versioning
  getVersion(): string;
}
```

### 12.2 Merchant Data

```typescript
interface MerchantData {
  address: string;
  name: string;
  verified: boolean;
  verified_at: datetime;
  category: string;
  risk_score: number;  // 0.0 - 1.0
}
```

### 12.3 Token Data

```typescript
interface TokenData {
  symbol: string;
  contract: string;
  chain: string;
  type: 'FUNGIBLE' | 'NFT' | 'SEMI_FUNGIBLE';
  decimals: number;
  
  is_wrapped: boolean;
  underlying: string | null;
  
  is_rebasing: boolean;
  is_fee_on_transfer: boolean;
  
  price_usd: number;
  price_updated_at: datetime;
}
```

### 12.4 Conversion Result

```typescript
interface ConversionResult {
  success: boolean;
  value: number;
  rate: number;
  rate_timestamp: datetime;
  source: string;
  
  error?: string;  // If success = false
}
```

### 12.5 Threat Pattern

```typescript
interface PatternMatch {
  pattern_id: string;
  type: 'ADDRESS' | 'SIGNATURE' | 'BYTECODE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;  // 0.0 - 1.0
  description: string;
}
```

---

# Part V: Audit & Compliance

## 13. Audit Requirements

### 13.1 Mandatory Logging

Implementations MUST log:

| Event | Required Fields |
|-------|-----------------|
| `evaluate()` call | Full Verdict including all evidence |
| `confirm()` call | eval_id, tx_reference, timestamp |
| `void()` call | eval_id, reason, timestamp |
| Policy change | Before/after policy hashes, timestamp, actor |
| Kill switch activation | Scope, timestamp, actor, reason |
| Escalation resolution | escalation_id, decision, approver, timestamp |

### 13.2 Retention

- Implementations SHOULD retain audit logs for minimum 365 days
- Enterprise deployments SHOULD retain for 7 years (2555 days)
- Logs MUST be retrievable by `eval_id`

### 13.3 Integrity

Audit logs SHOULD be tamper-evident. Recommended approaches:

- Append-only storage with hash chaining
- External attestation (e.g., blockchain anchoring)
- Cryptographic signatures on log entries

### 13.4 Wire vs. Storage

| Data | Wire (Verdict) | Storage (Logs) |
|------|----------------|----------------|
| Policy | Hash only | Full snapshot (if `include_policy_snapshot`) |
| State | Hash only | Full snapshot (if `include_state_snapshot`) |
| Action | Hash only | Full details (if `include_action_details`) |

This separation keeps wire payloads small while maintaining full auditability.

---

# Part VI: Security Considerations

## 14. Threat Model

### 14.1 What xBPP Protects Against

| Threat | Protection |
|--------|------------|
| Agent overspending | Limits (single, daily, weekly, monthly) |
| Malicious recipients | Blocklists, verification, threat detection |
| Compromised agent drift | Confidence thresholds, human escalation |
| Rapid drain attacks | Rate limits, burst detection |
| Limit evasion via fragmentation | Fragmentation detection |

### 14.2 Trust Assumptions

xBPP assumes:

- Policy is authored by an authorized principal
- Interpreter implementation is correct
- Registry data is curated in good faith
- Transport layer is secure (TLS)
- Time source is accurate (NTP)

### 14.3 Out of Scope

xBPP does NOT protect against:

- Compromised agent runtime (agent code itself is malicious)
- Compromised principal credentials (attacker has policy access)
- Malicious interpreter implementations
- Time oracle attacks (system clock manipulation)
- Nation-state level attacks
- Physical coercion of human approvers

### 14.4 Security Recommendations

Implementations SHOULD:

- Use TLS 1.3+ for all network communication
- Validate policy signatures when present
- Implement rate limiting on `evaluate()` calls themselves
- Monitor for anomalous patterns (sudden spike in escalations, etc.)
- Use hardware security modules (HSM) for signing keys
- Implement circuit breakers for registry unavailability

---

## 15. Known Attack Vectors & Mitigations

### 15.1 Budget Double-Spend (Fixed in v1.0)

**Attack**: Agent submits transaction, verdict expires before confirmation, budget releases, agent submits another transaction, both confirm.

**Mitigation**: Separate `valid_until` (short, 60s) from `lock_duration` (long, 1 hour). Tentative spend held until explicit confirm/void or lock expiration.

### 15.2 Gas Estimate Gaming (Fixed in v1.0)

**Attack**: Agent provides artificially low gas estimate to slide under budget, then executes with high actual gas.

**Mitigation**: Budget calculation MUST use `gas.max_willing`, not `gas.estimate`. The `use_max_willing` flag defaults to true and SHOULD NOT be disabled.

### 15.3 Oracle Manipulation

**Attack**: During price volatility, use stale oracle data to bypass value limits.

**Mitigation**: `max_price_age_seconds` with `PRICE_STALE` reason code. Conservative postures block on stale prices.

### 15.4 Fragmentation

**Attack**: Split large transaction into many small ones to evade single-transaction limits.

**Mitigation**: Fragmentation detection with sliding window analysis. Daily/weekly/monthly limits as backstop.

### 15.5 Burst Racing

**Attack**: Send burst of transactions faster than rate limit window updates.

**Mitigation**: Use `SLIDING` burst window type (not `FIXED`). Atomic check-and-increment for rate counters.

---

# Part VII: Future Profiles

The following profiles are defined for future extension but are NOT part of the v1.0 release:

## 16. Planned Profiles

### 16.1 xBPP-defi (Future)

For DeFi operations including swaps, liquidity provision, and staking.

**Note**: v1.0 tracks **gross outflow** (spend), not **net position** or **NAV**. A trading agent swapping $1000 five times registers $5000 in spend even if net position is unchanged. This is intentional for v1.0 simplicity.

### 16.2 xBPP-gov (Future)

For regulatory compliance including KYC, AML, and jurisdiction rules.

### 16.3 xBPP-physical (Future)

For IoT, robotics, and physical-world agent actions.

---

# Part VIII: Reference

## 17. Complete Reason Code Reference

### 17.1 Core Reason Codes

| Code | Decision | Category |
|------|----------|----------|
| `EXCEEDS_SINGLE_LIMIT` | BLOCK | Limits |
| `EXCEEDS_DAILY_LIMIT` | BLOCK | Limits |
| `INVALID_VALUE` | BLOCK | Validation |
| `ZERO_VALUE` | varies | Validation |
| `VERIFICATION_UNAVAILABLE` | varies | Verification |
| `VERIFICATION_ERROR` | varies | Verification |
| `VERIFICATION_TIMEOUT` | varies | Verification |
| `REVOKED_TARGET` | BLOCK | Verification |
| `HIGH_VALUE` | ESCALATE | Escalation |
| `ESCALATION_TIMEOUT` | BLOCK | Escalation |
| `NO_PRINCIPAL_FOR_ESCALATION` | varies | Escalation |
| `INVALID_POLICY` | BLOCK | Policy |
| `POLICY_EXPIRED` | BLOCK | Policy |
| `POLICY_REQUIRED` | BLOCK | Policy |
| `SCHEMA_UNSUPPORTED` | BLOCK | Policy |
| `POLICY_SIGNATURE_INVALID` | BLOCK | Policy |
| `EVALUATION_ERROR` | BLOCK | System |
| `INVALID_CONFIDENCE` | BLOCK | System |
| `DUPLICATE_ACTION` | BLOCK | System |
| `KILL_SWITCH_ACTIVE` | BLOCK | System |

### 17.2 xBPP-pay Reason Codes

| Code | Decision | Category |
|------|----------|----------|
| `DUST_AMOUNT` | BLOCK | Value |
| `EXCEEDS_MAX_VALUE` | BLOCK | Value |
| `EXCEEDS_WEEKLY_LIMIT` | BLOCK | Value |
| `EXCEEDS_MONTHLY_LIMIT` | BLOCK | Value |
| `UNSUPPORTED_CURRENCY` | BLOCK | Currency |
| `UNKNOWN_CURRENCY` | varies | Currency |
| `PRICE_STALE` | varies | Currency |
| `CONVERSION_FAILED` | varies | Currency |
| `GAS_EXCEEDS_BUFFER` | varies | Gas |
| `GAS_PRICE_TOO_HIGH` | varies | Gas |
| `GAS_CURRENCY_UNSUPPORTED` | BLOCK | Gas |
| `CHAIN_NOT_ALLOWED` | BLOCK | Chain |
| `UNKNOWN_CHAIN` | varies | Chain |
| `CROSS_CHAIN_TRANSACTION` | varies | Chain |
| `BRIDGE_TRANSACTION` | varies | Chain |
| `BLOCKLISTED_MERCHANT` | BLOCK | Counterparty |
| `UNVERIFIED_MERCHANT` | varies | Counterparty |
| `NEW_COUNTERPARTY` | varies | Counterparty |
| `NEW_CONTRACT` | varies | Counterparty |
| `PROXY_CONTRACT` | varies | Counterparty |
| `SELF_PAYMENT` | varies | Counterparty |
| `AGENT_TO_AGENT` | varies | Counterparty |
| `VERIFICATION_EXPIRED` | varies | Counterparty |
| `RATE_LIMITED` | BLOCK | Rate |
| `BURST_DETECTED` | varies | Rate |
| `RECURRING_NOT_ALLOWED` | BLOCK | Recurring |
| `RECURRING_OVER_LIMIT` | BLOCK | Recurring |
| `RECURRING_VARIANCE` | varies | Recurring |
| `RECURRING_INITIAL_APPROVAL` | ESCALATE | Recurring |
| `PREAUTH_EXPIRED` | BLOCK | Preauth |
| `CAPTURE_OVER_PREAUTH` | varies | Preauth |
| `PATTERN_MATCH_EXACT` | BLOCK | Security |
| `PATTERN_MATCH_FUZZY` | varies | Security |
| `ZERO_DAY_HEURISTIC` | varies | Security |
| `UNVERIFIED_CONTRACT` | varies | Security |
| `ADMIN_KEY_DETECTED` | varies | Security |
| `ADDRESS_POISONING` | BLOCK | Security |
| `PHISHING_SIGNATURE` | BLOCK | Security |
| `DRAINER_CONTRACT` | BLOCK | Security |
| `HONEYPOT_TOKEN` | BLOCK | Security |
| `LOW_CONFIDENCE` | varies | Confidence |
| `FRAGMENTATION_DETECTED` | varies | Adversarial |
| `ESCALATION_BACKLOG` | varies | Escalation |
| `STANDING_APPROVAL` | ALLOW | Escalation |
| `HUMAN_OVERRIDE` | ALLOW | Escalation |
| `MODIFICATION_EXCEEDS_LIMITS` | BLOCK | Escalation |

---

## 18. JSON Schemas

Normative JSON schemas are available at:

```
https://schema.xbpp.dev/v1.0/core/action.json
https://schema.xbpp.dev/v1.0/core/policy.json
https://schema.xbpp.dev/v1.0/core/verdict.json
https://schema.xbpp.dev/v1.0/pay/action.json
https://schema.xbpp.dev/v1.0/pay/policy.json
```

---

## 19. IANA Considerations

This specification defines the following media types:

```
application/vnd.xbpp.verdict+json
application/vnd.xbpp.action+json
application/vnd.xbpp.policy+json
```

---

## 20. Changelog

### v1.0 (January 2025)

- Initial release
- Core specification with Action, Policy, Verdict, State
- xBPP-pay profile for x402 integration
- Tentative/confirmed spend with lock duration (fixes double-spend)
- Gas calculation using max_willing (fixes estimate gaming)
- Oracle staleness checks with PRICE_STALE (fixes stale oracle)
- Posture system with defaults
- Comprehensive reason codes
- Audit requirements

---

*End of xBPP Master Specification v1.0*
