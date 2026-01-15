import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, ArrowRight, Copy, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sdkCode = `import { xbpp } from '@anthropic/xbpp';
import { x402Client } from '@coinbase/x402';

// Wrap your x402 client with xBPP protection
const client = xbpp.wrap(x402Client, {
  maxSingle: 100,      // Max $100 per transaction
  dailyBudget: 1000,   // Max $1000 per day
  askMeAbove: 500,     // Human approval over $500
});

// All payments now go through xBPP
const response = await client.fetch(url);`;

const optionMapping = [
  { simple: 'maxSingle', policy: 'limits.max_single' },
  { simple: 'dailyBudget', policy: 'limits.max_daily' },
  { simple: 'weeklyBudget', policy: 'limits.max_weekly' },
  { simple: 'monthlyBudget', policy: 'limits.max_monthly' },
  { simple: 'askMeAbove', policy: 'limits.require_human_above' },
  { simple: 'mode', policy: 'posture' },
  { simple: 'verify', policy: 'verification' },
  { simple: 'allowlist', policy: 'counterparty_rules.merchant_allowlist' },
];

export function StandardSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sdkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-20 px-6 relative">
      {/* Document aesthetic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4">The Standard</p>
          <h2 
            className={cn(
              "text-3xl md:text-4xl font-medium tracking-tight transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            30-Second Integration
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground mt-4 transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Built on an open behavioral standard. Works with x402. Ships today.
          </p>
        </div>

        {/* SDK Code Block */}
        <div 
          className={cn(
            "mb-12 transition-all duration-700 delay-200",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative group">
            <div className="absolute -top-3 left-4 px-2 py-1 bg-background border border-border rounded text-xs font-mono text-muted-foreground">
              TypeScript
            </div>
            <pre className="p-6 pt-8 rounded-lg border border-border bg-card/50 overflow-x-auto text-sm font-mono">
              <code className="text-foreground">{sdkCode}</code>
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4 text-allow" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            That's it. Every payment is now evaluated against your policy.
          </p>
        </div>

        {/* Option Mapping Table */}
        <div 
          className={cn(
            "mb-12 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h3 className="text-lg font-medium mb-4 text-center">Simple Options → Full Policy</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-2xl mx-auto">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Simple Option</th>
                  <th className="text-left py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Policy Field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {optionMapping.map(({ simple, policy }) => (
                  <tr key={simple}>
                    <td className="py-2 pr-4 font-mono text-primary">{simple}</td>
                    <td className="py-2 font-mono text-muted-foreground">{policy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kicker and CTAs */}
        <div 
          className={cn(
            "text-center transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-lg text-muted-foreground mb-2">The rules are boring.</p>
          <p className="text-xl font-medium mb-8">The results are not.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" className="group">
              <Link to="/spec">
                <FileText className="mr-2 h-4 w-4" />
                View the standard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="group">
              <Link to="/policies">
                <Shield className="mr-2 h-4 w-4" />
                Explore Policy Bank
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}