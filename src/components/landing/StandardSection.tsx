import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, ArrowRight, Copy, Check, Shield } from 'lucide-react';

const sdkCode = `import { xbpp } from '@vanarchain/xbpp';
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
    <section ref={sectionRef} className="py-20 md:py-28 px-6 lg:px-12 relative" style={{ background: '#e8e9e9' }}>
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header - Left aligned */}
        <div className="mb-12">
          <div className="section-label mb-6">THE STANDARD</div>
          <h2
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              lineHeight: 0.95,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#282B35',
            }}
          >
            30-SECOND <span style={{ color: '#03D9AF' }}>INTEGRATION</span>
          </h2>
          <p className={cn(
            "text-lg mt-4 transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )} style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
            Built on an open execution boundary standard. Works with x402. Ships today.
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
            <div
              className="absolute -top-3 left-4 px-2 py-1 text-xs font-mono"
              style={{ background: '#282B35', color: '#6B6F7D' }}
            >
              TypeScript
            </div>
            <pre
              className="p-6 pt-8 overflow-x-auto text-sm font-mono"
              style={{ background: '#282B35', border: '1px solid #333' }}
            >
              <code style={{ color: '#e8e9e9' }}>{sdkCode}</code>
            </pre>
            <button
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" style={{ color: '#4ADE80' }} /> : <Copy className="h-4 w-4" style={{ color: '#6B6F7D' }} />}
            </button>
          </div>
          <p className="text-sm mt-4" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>
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
          <h3 className="text-lg font-medium mb-4" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>Simple Options → Full Policy</h3>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm max-w-2xl"
              style={{
                background: 'linear-gradient(75.85deg, #ffffff 14.68%, #e9eff0 184.03%)',
                clipPath: 'polygon(24px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 24px)',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid #CAD0DA' }}>
                  <th className="text-left py-3 px-6 font-mono text-xs uppercase tracking-wider" style={{ color: '#6B6F7D' }}>Simple Option</th>
                  <th className="text-left py-3 px-6 font-mono text-xs uppercase tracking-wider" style={{ color: '#6B6F7D' }}>Policy Field</th>
                </tr>
              </thead>
              <tbody>
                {optionMapping.map(({ simple, policy }) => (
                  <tr key={simple} style={{ borderBottom: '1px solid #F5F5F3' }}>
                    <td className="py-2 px-6 font-mono" style={{ color: '#03D9AF' }}>{simple}</td>
                    <td className="py-2 px-6 font-mono" style={{ color: '#6B6F7D' }}>{policy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kicker and CTAs */}
        <div
          className={cn(
            "transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-lg mb-2" style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}>The rules are boring.</p>
          <p className="text-xl font-medium mb-8" style={{ color: '#282B35', fontFamily: "'Figtree', sans-serif" }}>The results are not.</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/spec" className="btn-ghost flex items-center gap-2 group">
              <FileText className="h-4 w-4" />
              View the standard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link to="/policies" className="btn-ghost flex items-center gap-2 group">
              <Shield className="h-4 w-4" />
              Explore Policy Bank
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
