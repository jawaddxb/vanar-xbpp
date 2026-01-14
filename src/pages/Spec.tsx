import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { AnimatedBackground } from '@/components/effects';

export default function Spec() {
  return (
    <div className="min-h-screen py-20 px-6 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16 animate-fade-in">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-medium">The Standard</h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Policy specification for autonomous agent behavior
          </p>
        </header>
        
        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-12">
          {/* Why this exists */}
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-medium mb-4 text-foreground">Why This Exists</h2>
            <p className="text-muted-foreground leading-relaxed">
              As autonomous systems gain capability, the gap between "what they can do" and 
              "what we can verify they're doing" grows exponentially. Policy specifications 
              exist to make agent behavior auditable, predictable, and constrainable before 
              deployment—not after incident.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              POLICYLAB demonstrates that small rule changes create radically different outcomes. 
              Understanding this is prerequisite to operating autonomous systems responsibly.
            </p>
          </section>
          
          {/* BPP */}
          <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-medium mb-4 text-foreground">
              BPP — Behavioral Policy Primitive
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A BPP defines the baseline behavioral envelope for an agent. It specifies:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Action limits</strong>: Maximum thresholds for spend, frequency, and scope</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Relationship rules</strong>: How to handle known vs unknown counterparties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Verification requirements</strong>: What must be checked before action</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Escalation triggers</strong>: When to involve humans</span>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded border border-border bg-muted/20">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                Example Posture
              </p>
              <p className="italic text-foreground">
                "Trust efficiency. Escalate only when necessary."
              </p>
            </div>
          </section>
          
          {/* DBP */}
          <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-medium mb-4 text-foreground">
              DBP — Decision Boundary Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A DBP extends a BPP with explicit decision boundaries. It adds:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Pattern recognition</strong>: Anomaly detection and behavioral analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Velocity monitoring</strong>: Aggregate tracking across time windows</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Defensive triggers</strong>: Automatic blocking on suspicious patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Uncertainty handling</strong>: Default to escalation when confidence is low</span>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded border border-border bg-muted/20">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                Example Posture
              </p>
              <p className="italic text-foreground">
                "Verify everything. Ask when uncertain."
              </p>
            </div>
          </section>
          
          {/* Reason Codes */}
          <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h2 className="text-xl font-medium mb-4 text-foreground">Reason Codes</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Every decision must be accompanied by machine-readable reason codes that explain 
              the policy evaluation. These enable auditing, debugging, and policy refinement.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-muted-foreground font-mono text-xs uppercase tracking-wider">Code</th>
                    <th className="text-left py-2 text-muted-foreground font-mono text-xs uppercase tracking-wider">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <ReasonCodeRow code="BUDGET_COMPLIANT" meaning="Transaction within spend limits" />
                  <ReasonCodeRow code="VELOCITY_ANOMALY" meaning="Unusual pattern detected in transaction frequency" />
                  <ReasonCodeRow code="NEW_VENDOR_REQUIRES_APPROVAL" meaning="Unknown counterparty needs human verification" />
                  <ReasonCodeRow code="SIGNATURE_VALID" meaning="Cryptographic verification passed" />
                  <ReasonCodeRow code="TIMING_ANOMALY" meaning="Behavioral timing outside normal parameters" />
                  <ReasonCodeRow code="PATTERN_DEVIATION" meaning="Action differs from historical baseline" />
                  <ReasonCodeRow code="TRUST_THRESHOLD_NOT_MET" meaning="Insufficient trust signals for autonomous action" />
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Interpreter Semantics */}
          <section className="animate-fade-in" style={{ animationDelay: '500ms' }}>
            <h2 className="text-xl font-medium mb-4 text-foreground">Interpreter Semantics</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The policy interpreter evaluates constraints in order of specificity:
            </p>
            <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
              <li><strong className="text-foreground">Deny rules</strong> are evaluated first. Any match blocks the action.</li>
              <li><strong className="text-foreground">Escalation triggers</strong> are checked next. Any match pauses for human input.</li>
              <li><strong className="text-foreground">Require rules</strong> must all pass. Any failure triggers escalation.</li>
              <li><strong className="text-foreground">Limit rules</strong> are checked last. Exceeded limits may block or escalate.</li>
            </ol>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Actions that pass all constraints receive an ALLOW decision. All decisions are logged 
              with full constraint evaluation traces for auditability.
            </p>
          </section>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p className="text-sm text-muted-foreground">
            POLICYLAB Specification v0.1
          </p>
        </footer>
      </div>
    </div>
  );
}

function ReasonCodeRow({ code, meaning }: { code: string; meaning: string }) {
  return (
    <tr>
      <td className="py-2 pr-4 font-mono text-primary">{code}</td>
      <td className="py-2 text-foreground">{meaning}</td>
    </tr>
  );
}
