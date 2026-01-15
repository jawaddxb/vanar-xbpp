import { PolicyTemplate, Posture } from '../types';

// Policy templates based on xBPP Master Specification v1.0
// These are real-world starting points for different use cases

export const policyTemplates: PolicyTemplate[] = [
  // From xBPP Spec: Default Policies Section 10
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individual developers getting started with agent payments. Simple limits, balanced defaults.',
    use_case: 'Personal projects, testing, hackathons, prototypes',
    icon: 'Rocket',
    posture: 'BALANCED',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'BALANCED',
      limits: {
        max_single: 100,
        max_daily: 1000,
        require_human_above: 500,
      },
      verification: 'BUILT_IN',
    },
    tags: ['beginner', 'individual', 'low-volume', 'simple'],
    risk_profile: 'balanced',
    example_scenarios: ['scenario-new-vendor', 'scenario-saas-renewal'],
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For small teams with shared agent budgets. Weekly limits and new vendor escalation.',
    use_case: 'Startup operations, shared purchasing agents, team automation',
    icon: 'Users',
    posture: 'BALANCED',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'BALANCED',
      limits: {
        max_single: 500,
        max_daily: 5000,
        max_weekly: 20000,
        require_human_above: 1000,
      },
      verification: 'BUILT_IN',
      counterparty_rules: {
        new_counterparty_action: 'ESCALATE',
      },
    },
    tags: ['team', 'startup', 'medium-volume', 'collaborative'],
    risk_profile: 'balanced',
    example_scenarios: ['scenario-new-vendor', 'scenario-slow-drain'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations with compliance and audit requirements. Strict verification, detailed logging.',
    use_case: 'Corporate treasury, regulated industries, high-value operations, financial services',
    icon: 'Building2',
    posture: 'CAUTIOUS',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'CAUTIOUS',
      limits: {
        max_single: 1000,
        max_daily: 10000,
        max_weekly: 50000,
        max_monthly: 200000,
        require_human_above: 500,
      },
      verification: 'BUILT_IN',
      value_rules: {
        base_currency: 'USD',
        accepted_currencies: ['USDC', 'USDT'],
      },
      counterparty_rules: {
        require_verified: true,
        new_counterparty_action: 'BLOCK',
      },
      audit: {
        log_level: 'VERBOSE',
        retention_days: 2555,
      },
    },
    tags: ['enterprise', 'compliance', 'audit', 'high-security', 'regulated'],
    risk_profile: 'conservative',
    example_scenarios: ['scenario-urgent-override', 'scenario-phantom-approval'],
  },
  {
    id: 'high-frequency',
    name: 'High-Frequency Automation',
    description: 'For trading bots and high-volume automated systems. Aggressive posture, high rate limits.',
    use_case: 'Trading agents, arbitrage bots, API marketplace automation, micro-transactions',
    icon: 'Zap',
    posture: 'AGGRESSIVE',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'AGGRESSIVE',
      limits: {
        max_single: 500,
        max_daily: 50000,
        max_weekly: 250000,
        require_human_above: 2500,
      },
      verification: 'BUILT_IN',
      rate_limits: {
        max_per_minute: 50,
        max_per_hour: 500,
        burst_detection: false,
      },
      confidence_rules: {
        min_confidence: 0.5,
      },
    },
    tags: ['automation', 'trading', 'high-frequency', 'bots', 'speed'],
    risk_profile: 'aggressive',
    example_scenarios: ['scenario-slow-drain', 'scenario-fragmented-attack'],
  },
  {
    id: 'allowlist-only',
    name: 'Allowlist Only',
    description: 'Payments restricted to pre-approved addresses only. Maximum security, minimum flexibility.',
    use_case: 'Payroll, fixed vendor payments, treasury operations, internal transfers',
    icon: 'Shield',
    posture: 'CAUTIOUS',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'CAUTIOUS',
      limits: {
        max_single: 10000,
        max_daily: 100000,
        require_human_above: 100001, // Effectively never escalate, just block
      },
      verification: 'BUILT_IN',
      counterparty_rules: {
        new_counterparty_action: 'BLOCK',
        require_verified: false,
        merchant_allowlist: ['0x...treasury', '0x...payroll', '0x...vendor1'],
      },
    },
    tags: ['secure', 'allowlist', 'treasury', 'payroll', 'locked-down'],
    risk_profile: 'conservative',
    example_scenarios: ['scenario-poisoned-address', 'scenario-copy-paste-error'],
  },
  {
    id: 'travel-agent',
    name: 'Travel Agent',
    description: 'For AI agents booking travel and accommodation. Higher single limits for bookings.',
    use_case: 'Corporate travel booking, hotel reservations, flight purchases, travel automation',
    icon: 'Plane',
    posture: 'BALANCED',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'BALANCED',
      limits: {
        max_single: 2000,
        max_daily: 8000,
        max_weekly: 25000,
        require_human_above: 3000,
      },
      verification: 'BUILT_IN',
      counterparty_rules: {
        new_counterparty_action: 'ESCALATE',
      },
      value_rules: {
        base_currency: 'USD',
        accepted_currencies: ['USDC', 'USDT', 'USD'],
      },
    },
    tags: ['travel', 'booking', 'specialized', 'hospitality'],
    risk_profile: 'balanced',
    example_scenarios: ['scenario-new-vendor', 'scenario-urgent-override'],
  },
  {
    id: 'procurement-agent',
    name: 'Procurement Agent',
    description: 'For AI agents handling vendor purchases. Weekly limits and vendor verification.',
    use_case: 'Office supplies, SaaS subscriptions, vendor management, recurring purchases',
    icon: 'Package',
    posture: 'BALANCED',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'BALANCED',
      limits: {
        max_single: 500,
        max_daily: 5000,
        max_weekly: 15000,
        require_human_above: 1000,
      },
      verification: 'BUILT_IN',
      counterparty_rules: {
        new_counterparty_action: 'ESCALATE',
        min_contract_age_hours: 24,
      },
    },
    tags: ['procurement', 'purchasing', 'vendors', 'saas', 'subscriptions'],
    risk_profile: 'balanced',
    example_scenarios: ['scenario-saas-renewal', 'scenario-new-vendor'],
  },
  {
    id: 'defi-agent',
    name: 'DeFi Agent',
    description: 'For agents interacting with DeFi protocols. Chain-aware with bridge restrictions.',
    use_case: 'Yield farming, liquidity provision, protocol interaction, DeFi automation',
    icon: 'Coins',
    posture: 'AGGRESSIVE',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'AGGRESSIVE',
      limits: {
        max_single: 1000,
        max_daily: 25000,
        max_weekly: 100000,
        require_human_above: 5000,
      },
      verification: 'BUILT_IN',
      chain_rules: {
        allowed_chains: ['base', 'ethereum', 'arbitrum', 'optimism'],
        cross_chain_action: 'ESCALATE',
        bridge_transaction_action: 'ESCALATE',
      },
      counterparty_rules: {
        min_contract_age_hours: 168, // 1 week
      },
    },
    tags: ['defi', 'crypto', 'chains', 'yield', 'protocols'],
    risk_profile: 'aggressive',
    example_scenarios: ['scenario-bridge-request', 'scenario-honeypot-token'],
  },
  {
    id: 'compliance-heavy',
    name: 'Compliance First',
    description: 'Maximum oversight for heavily regulated environments. Human approval for almost everything.',
    use_case: 'Banking, healthcare payments, government contractors, regulated financial services',
    icon: 'Scale',
    posture: 'CAUTIOUS',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'CAUTIOUS',
      limits: {
        max_single: 250,
        max_daily: 2500,
        max_weekly: 10000,
        require_human_above: 100,
      },
      verification: 'BUILT_IN',
      value_rules: {
        base_currency: 'USD',
        accepted_currencies: ['USDC'],
        unknown_currency_action: 'BLOCK',
      },
      counterparty_rules: {
        require_verified: true,
        new_counterparty_action: 'BLOCK',
      },
      confidence_rules: {
        min_confidence: 0.9,
      },
      audit: {
        log_level: 'VERBOSE',
        retention_days: 2555,
        include_action_details: true,
      },
    },
    tags: ['compliance', 'regulated', 'banking', 'healthcare', 'government'],
    risk_profile: 'conservative',
    example_scenarios: ['scenario-phantom-approval', 'scenario-urgent-override'],
  },
  {
    id: 'micro-payments',
    name: 'Micro-Payments',
    description: 'For high-volume, low-value transactions. Very small limits with aggressive automation.',
    use_case: 'API credits, content micropayments, gaming in-app purchases, pay-per-use services',
    icon: 'CircleDollarSign',
    posture: 'AGGRESSIVE',
    policy: {
      schema: 'xbpp-pay/v1.0',
      version: '1',
      posture: 'AGGRESSIVE',
      limits: {
        max_single: 10,
        max_daily: 500,
        max_weekly: 2000,
        require_human_above: 25,
      },
      verification: 'BUILT_IN',
      rate_limits: {
        max_per_minute: 100,
        max_per_hour: 1000,
        burst_detection: true,
        burst_threshold: 50,
      },
    },
    tags: ['micropayments', 'api', 'gaming', 'content', 'high-volume'],
    risk_profile: 'aggressive',
    example_scenarios: ['scenario-slow-drain', 'scenario-fragmented-attack'],
  },
];

// Helper functions
export function getPolicyTemplateById(id: string): PolicyTemplate | undefined {
  return policyTemplates.find(p => p.id === id);
}

export function getPolicyTemplatesByPosture(posture: Posture): PolicyTemplate[] {
  return policyTemplates.filter(p => p.posture === posture);
}

export function getPolicyTemplatesByRiskProfile(profile: 'conservative' | 'balanced' | 'aggressive'): PolicyTemplate[] {
  return policyTemplates.filter(p => p.risk_profile === profile);
}

export function getPolicyTemplatesByTag(tag: string): PolicyTemplate[] {
  return policyTemplates.filter(p => p.tags.includes(tag.toLowerCase()));
}

export function searchPolicyTemplates(query: string): PolicyTemplate[] {
  const lowerQuery = query.toLowerCase();
  return policyTemplates.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.use_case.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.includes(lowerQuery))
  );
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  policyTemplates.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

// Posture color mapping
export const postureColors: Record<Posture, { bg: string; text: string; border: string }> = {
  AGGRESSIVE: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  BALANCED: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  CAUTIOUS: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};

// Risk profile descriptions
export const riskProfileInfo: Record<string, { label: string; description: string }> = {
  conservative: {
    label: 'Conservative',
    description: 'Maximum safety, minimum autonomy. Human oversight on most decisions.',
  },
  balanced: {
    label: 'Balanced',
    description: 'Reasonable autonomy with safety guardrails. Escalate when uncertain.',
  },
  aggressive: {
    label: 'Aggressive',
    description: 'Maximum autonomy, minimal friction. Trust the agent, verify results.',
  },
};
