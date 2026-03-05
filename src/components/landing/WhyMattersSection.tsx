import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Rocket, Shield, Globe, FileCheck, Code, Star } from 'lucide-react';

const developerBenefits = [
  {
    icon: Rocket,
    title: 'Build Faster',
    description: 'Stop writing compliance code. Import @vanar/xbpp and wrap your client. Get rate limiting, budget caps, and threat detection for free.',
  },
  {
    icon: Star,
    title: 'Monetize Trust',
    description: 'An agent with a verifiable, public xBPP Policy is 10x more likely to be hired than a "black box" agent.',
  },
];

const ctoBenefits = [
  {
    icon: Shield,
    title: 'Capped Liability',
    description: 'Mathematically prove that an agent cannot spend more than $X or interact with sanctioned addresses.',
  },
  {
    icon: Globe,
    title: 'Global Compliance',
    description: 'Swap policies based on jurisdiction. US to Germany? Switch from policy-us-v1 to policy-eu-v1 instantly.',
  },
  {
    icon: FileCheck,
    title: 'Audit Trail',
    description: 'Every decision is hashed and logged. Know not just what the agent spent, but why it was allowed.',
  },
];

export function WhyMattersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#EDEDEA' }}>
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={cn(
            "section-label justify-center mb-6 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            WHY THIS MATTERS NOW
          </div>
          <h2
            className={cn(
              "transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(36px, 7vw, 60px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#1E2D2D',
            }}
          >
            BUILT FOR <span style={{ color: '#3ECFA5' }}>BUILDERS.</span>
            <br />
            TRUSTED BY <span style={{ color: '#3ECFA5' }}>ENTERPRISES.</span>
          </h2>
        </div>

        {/* Two Audience Columns */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* For Base Developers */}
          <div className={cn(
            "transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="p-8 rounded-2xl h-full" style={{ background: 'rgba(62, 207, 165, 0.08)', border: '1px solid rgba(62, 207, 165, 0.3)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(62, 207, 165, 0.2)' }}>
                  <Code className="h-5 w-5" style={{ color: '#3ECFA5' }} />
                </div>
                <h3 className="text-2xl font-medium" style={{ color: '#1E2D2D' }}>For Base Developers</h3>
              </div>

              <div className="space-y-6">
                {developerBenefits.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'white', border: '1px solid #E2E2DE' }}>
                      <Icon className="h-5 w-5" style={{ color: '#3ECFA5' }} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1" style={{ color: '#1E2D2D' }}>{title}</h4>
                      <p className="text-sm" style={{ color: '#6B6B67' }}>{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code snippet */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: 'white', border: '1px solid #E2E2DE' }}>
                <code className="text-xs font-mono">
                  <span style={{ color: '#3ECFA5' }}>import</span> <span style={{ color: '#1E2D2D' }}>{"{ wrap }"}</span> <span style={{ color: '#3ECFA5' }}>from</span> <span style={{ color: '#4ADE80' }}>'@vanar/xbpp'</span>;
                  <br />
                  <span style={{ color: '#9E9E98' }}>// That's it. You're compliant.</span>
                </code>
              </div>
            </div>
          </div>

          {/* For Enterprise CTOs */}
          <div className={cn(
            "transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="p-8 rounded-2xl h-full" style={{ background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74, 222, 128, 0.2)' }}>
                  <Shield className="h-5 w-5" style={{ color: '#4ADE80' }} />
                </div>
                <h3 className="text-2xl font-medium" style={{ color: '#1E2D2D' }}>For Enterprise CTOs</h3>
              </div>

              <div className="space-y-6">
                {ctoBenefits.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'white', border: '1px solid #E2E2DE' }}>
                      <Icon className="h-5 w-5" style={{ color: '#4ADE80' }} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1" style={{ color: '#1E2D2D' }}>{title}</h4>
                      <p className="text-sm" style={{ color: '#6B6B67' }}>{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
