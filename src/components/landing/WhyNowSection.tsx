import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Globe, Building2, Cpu, CreditCard, Landmark } from 'lucide-react';

const ecosystemPlayers = [
  {
    name: 'Crossmint',
    icon: Building2,
    action: 'Building wallets for agents',
    color: '#3B82F6',
  },
  {
    name: 'Kite AI',
    icon: Cpu,
    action: 'Building the Agentic Internet layer',
    color: '#10B981',
  },
  {
    name: 'Visa',
    icon: CreditCard,
    action: 'Researching Trusted Agent Registries',
    color: '#8B5CF6',
  },
  {
    name: 'Coinbase',
    icon: Landmark,
    action: 'Exploring agent authentication standards',
    color: '#F59E0B',
  },
];

export function WhyNowSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setShowPlayers(true), 600);
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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden" style={{ background: '#EDEDEA' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(62, 207, 165, 0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="section-label justify-center mb-6">THE VISION</div>
          <h2
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(32px, 6vw, 56px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#1E2D2D',
            }}
          >
            IN THE NEAR FUTURE, NO AUTONOMOUS AGENT
            <br />
            WILL EXECUTE WITHOUT A <span style={{ color: '#3ECFA5' }}>SIGNED VERDICT</span>.
          </h2>
        </div>

        {/* Ecosystem Players */}
        <div className={cn(
          "mb-12 transition-all duration-700 delay-200",
          showPlayers ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-center text-sm font-mono uppercase tracking-wider mb-6" style={{ color: '#9E9E98' }}>
            The industry is already building toward this future
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ecosystemPlayers.map((player, index) => (
              <div
                key={player.name}
                className="p-4 rounded-xl ferron-card hover:shadow-md transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <player.icon className="w-4 h-4" style={{ color: player.color }} />
                  <span className="font-medium text-sm" style={{ color: '#1E2D2D' }}>{player.name}</span>
                </div>
                <p className="text-xs" style={{ color: '#6B6B67' }}>{player.action}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-4 italic" style={{ color: '#6B6B67' }}>
            They're all waiting for the same thing: <span style={{ color: '#1E2D2D', fontStyle: 'normal', fontWeight: 500 }}>a standard for safe spending.</span>
          </p>
        </div>

        <div className={cn(
          "flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-12 transition-all duration-700 delay-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl ferron-card">
            <Lock className="h-6 w-6" style={{ color: '#6B6B67' }} />
            <div>
              <p className="text-sm" style={{ color: '#9E9E98' }}>SSL</p>
              <p className="font-medium" style={{ color: '#1E2D2D' }}>Standard for moving data</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl" style={{ background: 'rgba(62, 207, 165, 0.1)', border: '1px solid rgba(62, 207, 165, 0.3)' }}>
            <Globe className="h-6 w-6" style={{ color: '#3ECFA5' }} />
            <div>
              <p className="text-sm" style={{ color: '#3ECFA5' }}>xBPP</p>
              <p className="font-medium" style={{ color: '#1E2D2D' }}>Standard for moving value</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xl mb-4" style={{ color: '#6B6B67' }}>
            xBPP transforms the "Wild West" of on-chain agents into a
          </p>
          <p className="text-2xl md:text-3xl font-medium" style={{ color: '#1E2D2D' }}>
            reliable, <span style={{ color: '#4ADE80' }}>insurable</span>, and <span style={{ color: '#3ECFA5' }}>scalable</span> economy.
          </p>
        </div>
      </div>
    </section>
  );
}
