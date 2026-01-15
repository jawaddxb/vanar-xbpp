import { useState } from 'react';
import { BookOpen, Copy, Check, ChevronDown, ChevronRight, Download, FileJson, Shield, Zap, AlertTriangle, ExternalLink, Sparkles, Play } from 'lucide-react';
import { AnimatedBackground } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { PolicyBuilder } from '@/components/spec/PolicyBuilder';
import { VerdictSimulator } from '@/components/spec/VerdictSimulator';
import { PolicyConfig } from '@/lib/types';

const tocSections = [
  { id: 'overview', title: 'Overview', icon: BookOpen },
  { id: 'how-it-works', title: 'How It Works', icon: Zap },
  { id: 'key-concepts', title: 'Key Concepts', icon: FileJson },
  { id: 'policy-builder', title: 'Policy Builder', icon: Sparkles },
  { id: 'verdict-simulator', title: 'Verdict Simulator', icon: Play },
  { id: 'policy-structure', title: 'Policy Structure', icon: Shield },
  { id: 'postures', title: 'Postures', icon: AlertTriangle },
  { id: 'reason-codes', title: 'Reason Codes', icon: FileJson },
  { id: 'default-policies', title: 'Default Policies', icon: Shield },
  { id: 'sdk', title: 'SDK Integration', icon: Zap },
];

const coreReasonCodes = [
  { code: 'EXCEEDS_SINGLE_LIMIT', decision: 'BLOCK', description: 'Value exceeds max_single' },
  { code: 'EXCEEDS_DAILY_LIMIT', decision: 'BLOCK', description: 'Would exceed max_daily' },
  { code: 'EXCEEDS_WEEKLY_LIMIT', decision: 'BLOCK', description: 'Would exceed max_weekly' },
  { code: 'EXCEEDS_MONTHLY_LIMIT', decision: 'BLOCK', description: 'Would exceed max_monthly' },
  { code: 'HIGH_VALUE', decision: 'ESCALATE', description: 'Value exceeds require_human_above' },
  { code: 'INVALID_VALUE', decision: 'BLOCK', description: 'Value malformed, negative, or precision overflow' },
  { code: 'VERIFICATION_UNAVAILABLE', decision: 'varies', description: 'Verification service unreachable' },
  { code: 'REVOKED_TARGET', decision: 'BLOCK', description: 'Target revoked in registry' },
  { code: 'ESCALATION_TIMEOUT', decision: 'BLOCK', description: 'Escalation expired without response' },
  { code: 'KILL_SWITCH_ACTIVE', decision: 'BLOCK', description: 'Emergency stop engaged' },
  { code: 'DUPLICATE_ACTION', decision: 'BLOCK', description: 'Action hash seen within duplicate window' },
];

const payReasonCodes = [
  { code: 'UNSUPPORTED_CURRENCY', decision: 'BLOCK', description: 'Currency in blocked_currencies' },
  { code: 'UNKNOWN_CURRENCY', decision: 'varies', description: 'Currency not recognized' },
  { code: 'PRICE_STALE', decision: 'varies', description: 'Oracle data too old' },
  { code: 'CHAIN_NOT_ALLOWED', decision: 'BLOCK', description: 'Chain not in allowed_chains' },
  { code: 'UNKNOWN_CHAIN', decision: 'varies', description: 'Chain not recognized' },
  { code: 'CROSS_CHAIN_TRANSACTION', decision: 'varies', description: 'Transaction crosses chains' },
  { code: 'NEW_COUNTERPARTY', decision: 'varies', description: 'First-time payment recipient' },
  { code: 'NEW_CONTRACT', decision: 'varies', description: 'Contract below min_contract_age' },
  { code: 'BLOCKLISTED_MERCHANT', decision: 'BLOCK', description: 'Target in merchant_blocklist' },
  { code: 'UNVERIFIED_MERCHANT', decision: 'varies', description: 'Target not verified in registry' },
  { code: 'RATE_LIMITED', decision: 'BLOCK', description: 'Exceeds rate limits' },
  { code: 'BURST_DETECTED', decision: 'varies', description: 'Unusual transaction burst' },
  { code: 'FRAGMENTATION_DETECTED', decision: 'varies', description: 'Possible split transaction attack' },
  { code: 'LOW_CONFIDENCE', decision: 'varies', description: 'Agent confidence below threshold' },
  { code: 'DRAINER_CONTRACT', decision: 'BLOCK', description: 'Known drainer contract detected' },
  { code: 'ADDRESS_POISONING', decision: 'BLOCK', description: 'Address poisoning pattern detected' },
  { code: 'HONEYPOT_TOKEN', decision: 'BLOCK', description: 'Honeypot token detected' },
];

const postureDefaults = [
  { situation: 'Unknown field in action', aggressive: 'Ignore', balanced: 'Warn', cautious: 'Block' },
  { situation: 'Verification unavailable', aggressive: 'Allow', balanced: 'Escalate', cautious: 'Block' },
  { situation: 'Near daily limit (>80%)', aggressive: 'Allow', balanced: 'Warn', cautious: 'Escalate' },
  { situation: 'New counterparty', aggressive: 'Allow', balanced: 'Escalate', cautious: 'Block' },
  { situation: 'Unknown chain', aggressive: 'Escalate', balanced: 'Block', cautious: 'Block' },
  { situation: 'Low confidence', aggressive: 'Warn', balanced: 'Escalate', cautious: 'Block' },
];

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group">
      <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-allow" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-card/50 hover:bg-card/80 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
      {isOpen && <div className="p-4 border-t border-border">{children}</div>}
    </div>
  );
}

export default function Spec() {
  const [activeSection, setActiveSection] = useState('overview');
  const [simulatorConfig, setSimulatorConfig] = useState<PolicyConfig>({
    posture: 'BALANCED',
    maxSingle: 100,
    maxDaily: 1000,
    maxWeekly: 5000,
    requireHumanAbove: 500,
    newCounterpartyAction: 'ESCALATE',
    requireVerified: false,
    burstDetection: false,
    minConfidence: 0.7,
    logLevel: 'STANDARD',
  });

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex gap-8">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-1">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">On this page</p>
              {tocSections.map(({ id, title, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                    activeSection === id 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {title}
                </button>
              ))}
              
              <div className="pt-6 border-t border-border mt-6">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link to="/policies">
                    <Shield className="h-4 w-4" />
                    Policy Bank
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-16 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground mb-4">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">v1.0</span>
                <span>•</span>
                <span>January 2025</span>
                <span>•</span>
                <span>Apache 2.0</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-medium">xBPP Specification</h1>
                    <p className="text-lg text-muted-foreground mt-1">Behavioral Policy Protocol for Autonomous Agents</p>
                  </div>
                </div>
              </div>
              
              {/* Download Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="/docs/xbpp-master-spec.md" download className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Master Spec (1760 lines)
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/docs/xbpp-sdk-guide.md" download className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    SDK Guide (810 lines)
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://github.com/anthropic/xbpp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </header>

            {/* Overview Section */}
            <section id="overview" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                What is xBPP?
              </h2>
              
              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  xBPP (Behavioral Policy Protocol) is an open standard that lets autonomous AI agents make payments safely. 
                  It answers a simple question: <span className="text-foreground font-medium">"Should this agent be allowed to spend this money?"</span>
                </p>
                
                <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
                  <p className="text-lg mb-4">When an AI agent wants to make a payment, xBPP evaluates the request against a policy you define and returns one of three answers:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-allow/10 border border-allow/30 text-center">
                      <p className="text-2xl font-mono font-bold text-allow mb-1">ALLOW</p>
                      <p className="text-sm text-muted-foreground">Proceed with the payment</p>
                    </div>
                    <div className="p-4 rounded-lg bg-block/10 border border-block/30 text-center">
                      <p className="text-2xl font-mono font-bold text-block mb-1">BLOCK</p>
                      <p className="text-sm text-muted-foreground">Stop; this violates policy</p>
                    </div>
                    <div className="p-4 rounded-lg bg-escalate/10 border border-escalate/30 text-center">
                      <p className="text-2xl font-mono font-bold text-escalate mb-1">ESCALATE</p>
                      <p className="text-sm text-muted-foreground">Ask a human to approve</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground">
                  Think of xBPP as a <span className="text-foreground font-medium">programmable CFO for your AI agents</span>. 
                  You set the rules once (budgets, approved vendors, risk tolerance), and xBPP enforces them on every transaction.
                </p>
              </div>
            </section>

            {/* Why This Exists */}
            <section className="mb-16">
              <h3 className="text-xl font-medium mb-4">Why Does This Exist?</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>AI agents are increasingly capable of taking real-world actions—booking travel, purchasing software, paying invoices. But capability without constraint is dangerous:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-block mt-1 shrink-0" />
                    <span>An agent with access to a credit card could <span className="text-foreground">drain it in seconds</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-block mt-1 shrink-0" />
                    <span>A compromised agent could <span className="text-foreground">send funds to attackers</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-block mt-1 shrink-0" />
                    <span>Even well-intentioned agents <span className="text-foreground">make mistakes</span></span>
                  </li>
                </ul>
                <p>Traditional solutions don't work:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <span className="text-foreground">Manual approval</span> of every transaction destroys the value of automation</li>
                  <li>• <span className="text-foreground">Fixed spending limits</span> are too blunt ($100 limit blocks both a $101 legitimate purchase and $101 fraud)</li>
                  <li>• <span className="text-foreground">No limits</span> = unacceptable risk</li>
                </ul>
                <p className="text-foreground font-medium">
                  xBPP provides graduated autonomy: agents operate freely within defined boundaries, escalate edge cases to humans, and hard-stop on policy violations.
                </p>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                How It Works (30-Second Version)
              </h2>
              
              <div className="p-6 rounded-xl border border-border bg-card/50 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border flex-1">
                    <p className="text-xs font-mono text-muted-foreground mb-2">YOUR APPLICATION</p>
                    <p className="font-medium">Agent wants to pay $50 to 0xABC...</p>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex-1">
                    <p className="text-xs font-mono text-primary mb-2">XBPP INTERPRETER</p>
                    <p className="font-medium">Action + Policy → Verdict</p>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border flex-1">
                    <p className="text-xs font-mono text-muted-foreground mb-2">RESULT</p>
                    <p className="font-mono font-bold">ALLOW | BLOCK | ESCALATE</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Concepts */}
            <section id="key-concepts" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <FileJson className="h-6 w-6 text-primary" />
                Key Concepts
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Concept</th>
                      <th className="text-left py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">What It Is</th>
                      <th className="text-left py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-primary">Action</td>
                      <td className="py-3 pr-4">A proposed payment to evaluate</td>
                      <td className="py-3 text-muted-foreground">"Pay $50 USDC to 0xABC on Base"</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-primary">Policy</td>
                      <td className="py-3 pr-4">Rules defining what's allowed</td>
                      <td className="py-3 text-muted-foreground">"Max $100/tx, $1000/day, ask me above $500"</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-primary">Verdict</td>
                      <td className="py-3 pr-4">The evaluation result</td>
                      <td className="py-3 text-muted-foreground">ALLOW, BLOCK, or ESCALATE with reasons</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-primary">State</td>
                      <td className="py-3 pr-4">Running totals and history</td>
                      <td className="py-3 text-muted-foreground">"$340 spent today, 12 transactions"</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-primary">Posture</td>
                      <td className="py-3 pr-4">Default risk tolerance</td>
                      <td className="py-3 text-muted-foreground">AGGRESSIVE, BALANCED, or CAUTIOUS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Interactive Policy Builder */}
            <section id="policy-builder" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Interactive Policy Builder
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Build your own xBPP policy in real-time. Adjust the controls to see how different settings affect the policy JSON.
              </p>
              
              <PolicyBuilder onConfigChange={setSimulatorConfig} />
            </section>

            {/* Verdict Simulator */}
            <section id="verdict-simulator" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <Play className="h-6 w-6 text-primary" />
                Verdict Simulator
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Test how your policy evaluates transactions in real-time. Enter transaction details to see the verdict and reason codes.
              </p>
              
              <VerdictSimulator config={simulatorConfig} />
            </section>

            {/* Policy Structure */}
            <section id="policy-structure" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Policy Structure
              </h2>
              
              <p className="text-muted-foreground mb-6">Here's a policy for a small team's AI purchasing agent:</p>
              
              <CodeBlock code={`{
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
}`} language="json" />
              
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
                <p className="font-medium mb-3">This policy says:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No single payment over <span className="text-foreground font-mono">$500</span></li>
                  <li>• No more than <span className="text-foreground font-mono">$5,000</span> per day total</li>
                  <li>• Human approval required for anything over <span className="text-foreground font-mono">$1,000</span></li>
                  <li>• First-time vendors require human approval</li>
                  <li>• Use built-in threat detection</li>
                </ul>
              </div>
            </section>

            {/* Postures */}
            <section id="postures" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Postures
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-5 rounded-xl border border-escalate/30 bg-escalate/5">
                  <p className="text-lg font-mono font-bold text-escalate mb-2">AGGRESSIVE</p>
                  <p className="text-sm text-muted-foreground mb-3">Favor action; minimize friction</p>
                  <p className="text-xs text-muted-foreground">Use case: High-frequency trading, automation</p>
                </div>
                <div className="p-5 rounded-xl border border-primary/30 bg-primary/5">
                  <p className="text-lg font-mono font-bold text-primary mb-2">BALANCED</p>
                  <p className="text-sm text-muted-foreground mb-3">Balance autonomy and safety</p>
                  <p className="text-xs text-muted-foreground">Use case: General purpose (default)</p>
                </div>
                <div className="p-5 rounded-xl border border-allow/30 bg-allow/5">
                  <p className="text-lg font-mono font-bold text-allow mb-2">CAUTIOUS</p>
                  <p className="text-sm text-muted-foreground mb-3">Favor safety; maximize oversight</p>
                  <p className="text-xs text-muted-foreground">Use case: High-value, compliance-sensitive</p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Posture Defaults</h3>
              <p className="text-muted-foreground mb-4">When policy does not specify behavior for ambiguous situations, posture determines the default:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Situation</th>
                      <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-wider text-escalate">Aggressive</th>
                      <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-wider text-primary">Balanced</th>
                      <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-wider text-allow">Cautious</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {postureDefaults.map(({ situation, aggressive, balanced, cautious }) => (
                      <tr key={situation}>
                        <td className="py-3 pr-4">{situation}</td>
                        <td className="py-3 px-4 text-center font-mono text-sm">{aggressive}</td>
                        <td className="py-3 px-4 text-center font-mono text-sm">{balanced}</td>
                        <td className="py-3 px-4 text-center font-mono text-sm">{cautious}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Reason Codes */}
            <section id="reason-codes" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <FileJson className="h-6 w-6 text-primary" />
                Reason Codes
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Every decision is accompanied by machine-readable reason codes that explain the policy evaluation.
              </p>
              
              <CollapsibleSection title="Core Reason Codes" defaultOpen>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Code</th>
                        <th className="text-left py-2 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Decision</th>
                        <th className="text-left py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {coreReasonCodes.map(({ code, decision, description }) => (
                        <tr key={code}>
                          <td className="py-2 pr-4 font-mono text-primary text-xs">{code}</td>
                          <td className={cn(
                            "py-2 pr-4 font-mono text-xs",
                            decision === 'BLOCK' && 'text-block',
                            decision === 'ESCALATE' && 'text-escalate',
                            decision === 'varies' && 'text-muted-foreground'
                          )}>{decision}</td>
                          <td className="py-2 text-muted-foreground">{description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
              
              <div className="mt-4">
                <CollapsibleSection title="xBPP-pay Extended Reason Codes">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Code</th>
                          <th className="text-left py-2 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Decision</th>
                          <th className="text-left py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {payReasonCodes.map(({ code, decision, description }) => (
                          <tr key={code}>
                            <td className="py-2 pr-4 font-mono text-primary text-xs">{code}</td>
                            <td className={cn(
                              "py-2 pr-4 font-mono text-xs",
                              decision === 'BLOCK' && 'text-block',
                              decision === 'ESCALATE' && 'text-escalate',
                              decision === 'varies' && 'text-muted-foreground'
                            )}>{decision}</td>
                            <td className="py-2 text-muted-foreground">{description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleSection>
              </div>
            </section>

            {/* Default Policies */}
            <section id="default-policies" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Default Policies
              </h2>
              
              <p className="text-muted-foreground mb-6">
                The xBPP specification includes recommended default policies for common use cases.
                Explore our full <Link to="/policies" className="text-primary hover:underline">Policy Bank</Link> for more templates.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <CollapsibleSection title="Starter Policy" defaultOpen>
                  <p className="text-sm text-muted-foreground mb-4">For individual developers getting started</p>
                  <CodeBlock code={`{
  "schema": "xbpp-pay/v1.0",
  "posture": "BALANCED",
  "limits": {
    "max_single": 100,
    "max_daily": 1000,
    "require_human_above": 500
  },
  "verification": "BUILT_IN"
}`} language="json" />
                </CollapsibleSection>
                
                <CollapsibleSection title="Team Policy">
                  <p className="text-sm text-muted-foreground mb-4">For small teams with shared agent budgets</p>
                  <CodeBlock code={`{
  "schema": "xbpp-pay/v1.0",
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
}`} language="json" />
                </CollapsibleSection>
                
                <CollapsibleSection title="Enterprise Policy">
                  <p className="text-sm text-muted-foreground mb-4">For organizations with compliance requirements</p>
                  <CodeBlock code={`{
  "schema": "xbpp-pay/v1.0",
  "posture": "CAUTIOUS",
  "limits": {
    "max_single": 1000,
    "max_daily": 10000,
    "max_weekly": 50000,
    "max_monthly": 200000,
    "require_human_above": 500
  },
  "verification": "BUILT_IN",
  "counterparty_rules": {
    "require_verified": true,
    "new_counterparty_action": "BLOCK"
  },
  "audit": {
    "log_level": "VERBOSE",
    "retention_days": 2555
  }
}`} language="json" />
                </CollapsibleSection>
                
                <CollapsibleSection title="High-Frequency Automation">
                  <p className="text-sm text-muted-foreground mb-4">For trading bots and high-volume systems</p>
                  <CodeBlock code={`{
  "schema": "xbpp-pay/v1.0",
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
    "max_per_hour": 500
  }
}`} language="json" />
                </CollapsibleSection>
              </div>
            </section>

            {/* SDK Integration */}
            <section id="sdk" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                SDK Integration
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Installation</h3>
                  <CodeBlock code="npm install @anthropic/xbpp" language="bash" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">30-Second Integration</h3>
                  <CodeBlock code={`import { xbpp } from '@anthropic/xbpp';
import { x402Client } from '@coinbase/x402';

// Wrap your x402 client with xBPP protection
const client = xbpp.wrap(x402Client, {
  maxSingle: 100,      // Max $100 per transaction
  dailyBudget: 1000,   // Max $1000 per day
  askMeAbove: 500,     // Human approval over $500
});

// All payments now go through xBPP
const response = await client.fetch(url);`} />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Handling Decisions</h3>
                  <CodeBlock code={`switch (verdict.decision) {
  case 'ALLOW':    // ✅ Proceed - payment is within policy
    break;
  case 'BLOCK':    // 🛑 Stop - policy violation
    console.log('Blocked:', verdict.reasons);
    break;
  case 'ESCALATE': // ⏸️ Pause - needs human approval
    await handleEscalation(verdict);
    break;
}`} />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Error Handling</h3>
                  <CodeBlock code={`import { xbpp, BlockedError } from '@anthropic/xbpp';

try {
  const response = await client.fetch(url);
} catch (error) {
  if (error instanceof BlockedError) {
    console.log('Payment blocked');
    console.log('Reasons:', error.reasons); // ['EXCEEDS_DAILY_LIMIT']
    console.log('Message:', error.message); // Human-readable
    
    if (error.reasons.includes('EXCEEDS_DAILY_LIMIT')) {
      showToast('Daily spending limit reached. Try again tomorrow.');
    }
  } else {
    throw error;
  }
}`} />
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    xBPP Master Specification v1.0 • January 2025 • Apache 2.0
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Primary Integration: x402 Payment Protocol
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/policies">
                      <Shield className="mr-2 h-4 w-4" />
                      Explore Policies
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/scenarios">
                      <Zap className="mr-2 h-4 w-4" />
                      Run Simulations
                    </Link>
                  </Button>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}