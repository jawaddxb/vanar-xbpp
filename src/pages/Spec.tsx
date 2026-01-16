import { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, ChevronDown, ChevronRight, Download, FileJson, Shield, Zap, AlertTriangle, ExternalLink, Sparkles, Play, List, FlaskConical, Menu, ArrowUp } from 'lucide-react';
import { AnimatedBackground } from '@/components/effects';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PolicyBuilder } from '@/components/spec/PolicyBuilder';
import { AdvancedVerdictSimulator } from '@/components/spec/AdvancedVerdictSimulator';
import { ReasonCodeReference } from '@/components/spec/ReasonCodeReference';
import type { PolicyConfig } from '@/lib/types';

const tocSections = [
  { id: 'overview', title: 'Overview', icon: BookOpen },
  { id: 'how-it-works', title: 'How It Works', icon: Zap },
  { id: 'key-concepts', title: 'Key Concepts', icon: FileJson },
  { id: 'glossary', title: 'Glossary', icon: FileJson },
  { id: 'policy-builder', title: 'Policy Builder', icon: Sparkles },
  { id: 'verdict-simulator', title: 'Verdict Simulator', icon: Play },
  { id: 'reason-codes', title: 'Reason Codes', icon: List },
  { id: 'policy-structure', title: 'Policy Structure', icon: Shield },
  { id: 'postures', title: 'Postures', icon: AlertTriangle },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: track which section is visible
  useEffect(() => {
    const sectionIds = tocSections.map(s => s.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -70% 0px', // Trigger when section is in upper portion of viewport
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const TocContent = () => (
    <div className="space-y-1">
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
      
      <div className="pt-6 border-t border-border mt-6 space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
          <Link to="/test-suite">
            <FlaskConical className="h-4 w-4" />
            Test Suite
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
          <Link to="/policies">
            <Shield className="h-4 w-4" />
            Policy Bank
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted/30 z-50">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <AnimatedBackground variant="subtle" />
      
      {/* Back to Top Button */}
      {scrollProgress > 10 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-24 lg:right-6 z-30 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-primary/90 hover:scale-105"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
      
      {/* Mobile TOC Trigger */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 pt-12">
            <TocContent />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Fixed Sidebar TOC - Desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-64 h-screen pt-28 pb-8 px-6 flex-col z-20">
        <TocContent />
      </aside>
      
      {/* Scrollable Main Content */}
      <main className="lg:pl-64 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto relative z-10">
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
                    <p className="text-lg text-muted-foreground mt-1">Execution Boundary Permission Protocol for Autonomous Agents</p>
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
                  xBPP (Execution Boundary Permission Protocol) is an open standard that lets autonomous AI agents make payments safely.
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

            {/* Glossary */}
            <section id="glossary" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <FileJson className="h-6 w-6 text-primary" />
                Glossary
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Essential terminology for understanding and implementing the Execution Boundary Permission Protocol.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">xBPP (Execution Boundary Permission Protocol)</h4>
                  <p className="text-muted-foreground text-sm">
                    An open standard for autonomous agent governance. xBPP defines execution boundaries that determine whether an AI agent can proceed with an action, must stop, or should escalate to human oversight. The protocol serves as a "programmable super-ego" for autonomous systems.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">Execution Boundary</h4>
                  <p className="text-muted-foreground text-sm">
                    The set of constraints and rules that define what actions an autonomous agent is permitted to take. Unlike simple spending limits, execution boundaries encompass verification requirements, threat detection, rate limiting, and escalation triggers.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">Verdict</h4>
                  <p className="text-muted-foreground text-sm">
                    The signed decision returned by the xBPP interpreter after evaluating an action against a policy. A verdict contains one of three decisions (ALLOW, BLOCK, ESCALATE), along with reason codes explaining why, and cryptographic evidence for auditability.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">Posture</h4>
                  <p className="text-muted-foreground text-sm">
                    A preset risk tolerance that determines how ambiguous situations are handled. AGGRESSIVE favors action and autonomy, CAUTIOUS maximizes oversight and blocks uncertainty, and BALANCED provides a middle ground.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">Reason Code</h4>
                  <p className="text-muted-foreground text-sm">
                    A standardized identifier (e.g., EXCEEDS_SINGLE_LIMIT, DRAINER_CONTRACT) that explains why a particular verdict was reached. Reason codes enable consistent logging, auditing, and programmatic handling of policy decisions.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">9-Phase Evaluation</h4>
                  <p className="text-muted-foreground text-sm">
                    The structured evaluation sequence xBPP uses to assess every action: (1) Validation, (2) Emergency Checks, (3) Input Validation, (4) Core Limits, (5) Duplicate Detection, (6) Verification, (7) Profile Checks, (8) Escalation Triggers, (9) Final Decision.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">Principal</h4>
                  <p className="text-muted-foreground text-sm">
                    The human or organization ultimately responsible for an agent's actions. The principal defines the policy, receives escalations, and bears liability for permitted transactions.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">Escalation</h4>
                  <p className="text-muted-foreground text-sm">
                    A pause in autonomous execution that requests human decision-making. Escalations are triggered when actions require approval (high-value transactions), fall into policy ambiguity, or when explicit human oversight is mandated.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">Agentic Gap</h4>
                  <p className="text-muted-foreground text-sm">
                    The divide between what autonomous agents can do (capability) and who is responsible when things go wrong (liability). xBPP bridges this gap by providing a standardized framework for defining and enforcing execution boundaries.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-mono text-primary font-medium mb-2">x402</h4>
                  <p className="text-muted-foreground text-sm">
                    A payment protocol that enables AI agents to make authenticated payments over HTTP. xBPP integrates with x402 to provide policy enforcement for autonomous transactions, wrapping the x402 client with execution boundary controls.
                  </p>
                </div>
              </div>
            </section>


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
                Advanced Verdict Simulator
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Test the full xBPP 9-phase evaluation sequence. Configure transaction details including chain rules, security threats, rate limits, and more to see how your policy responds.
              </p>
              
              <AdvancedVerdictSimulator config={simulatorConfig} />
            </section>

            {/* Reason Codes Reference */}
            <section id="reason-codes" className="mb-16 scroll-mt-28">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
                <List className="h-6 w-6 text-primary" />
                Reason Codes Reference
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Complete reference of all 45+ xBPP reason codes. Filter by category or decision type to find specific codes.
              </p>
              
              <ReasonCodeReference />
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
          </div>
        </main>
      </div>
    );
  }