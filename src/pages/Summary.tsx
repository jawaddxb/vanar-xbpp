import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, Download, TrendingDown, TrendingUp, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePolicyLabStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { AnimatedBackground, MetricCounter } from '@/components/effects';

export default function Summary() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scenarioId = searchParams.get('scenario');
  
  const { selectedScenario, diff, loadScenarioData, reset } = usePolicyLabStore();
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  
  useEffect(() => {
    if (!scenarioId) {
      navigate('/scenarios');
      return;
    }
    if (!selectedScenario || selectedScenario.id !== scenarioId) {
      loadScenarioData(scenarioId);
    }
  }, [scenarioId, selectedScenario, loadScenarioData, navigate]);
  
  // Staggered reveal of sections
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleSections([0]), 300),
      setTimeout(() => setVisibleSections([0, 1]), 600),
      setTimeout(() => setVisibleSections([0, 1, 2]), 900),
      setTimeout(() => setVisibleSections([0, 1, 2, 3]), 1200),
      setTimeout(() => setVisibleSections([0, 1, 2, 3, 4]), 1500),
      setTimeout(() => setVisibleSections([0, 1, 2, 3, 4, 5]), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  
  const handleRunAnother = () => {
    reset();
    navigate('/scenarios');
  };
  
  if (!selectedScenario || !diff) return null;
  
  const { consequence_summary } = diff;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <header className={cn(
          "text-center mb-20 transition-all duration-700",
          visibleSections.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Consequence Summary
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium">{selectedScenario.name}</h1>
        </header>
        
        {/* Narrative Sections */}
        <div className="space-y-12 mb-20">
          <NarrativeSection
            title="What happened"
            content={consequence_summary.what_happened}
            isVisible={visibleSections.includes(1)}
            accentColor="primary"
          />
          <NarrativeSection
            title="What was prevented"
            content={consequence_summary.what_was_prevented}
            isVisible={visibleSections.includes(2)}
            accentColor="allow"
          />
          <NarrativeSection
            title="What tradeoff was made"
            content={consequence_summary.tradeoff}
            isVisible={visibleSections.includes(3)}
            accentColor="escalate"
          />
        </div>
        
        {/* Metrics */}
        <div className={cn(
          "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 transition-all duration-700",
          visibleSections.includes(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <MetricCounter
            label="Spend Exposure Delta"
            value={consequence_summary.metrics.spend_exposure_delta}
            icon={<TrendingDown className="h-4 w-4" />}
            delay={0}
          />
          <MetricCounter
            label="Human Escalations"
            value={consequence_summary.metrics.human_escalation_count.toString()}
            icon={<Users className="h-4 w-4" />}
            delay={100}
          />
          <MetricCounter
            label="Autonomy Change"
            value={consequence_summary.metrics.autonomy_change}
            icon={<TrendingUp className="h-4 w-4" />}
            delay={200}
          />
          <MetricCounter
            label="Risk Avoided"
            value={consequence_summary.metrics.risk_avoided}
            icon={<Shield className="h-4 w-4" />}
            delay={300}
          />
        </div>
        
        {/* Framing quote */}
        <div className={cn(
          "text-center mb-20 transition-all duration-700",
          visibleSections.includes(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-block max-w-2xl">
            <div className="relative p-8 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
              {/* Quote marks */}
              <div className="absolute -top-4 left-8 text-6xl text-primary/20 font-serif">"</div>
              
              <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                Constraints don't make agents worse.
              </p>
              <p className="text-xl md:text-2xl leading-relaxed mt-2">
                They make outcomes <span className="text-primary font-medium">legible</span>.
              </p>
              
              {/* Accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
          </div>
        </div>
        
        {/* CTAs */}
        <div className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700",
          visibleSections.includes(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Button asChild variant="outline" size="lg" className="group text-lg px-8 py-6">
            <Link to={`/export?scenario=${scenarioId}`}>
              <Download className="mr-2 h-5 w-5" />
              Export results
            </Link>
          </Button>
          <Button onClick={handleRunAnother} size="lg" className="group text-lg px-8 py-6">
            <RotateCcw className="mr-2 h-5 w-5 transition-transform group-hover:-rotate-180 duration-500" />
            Run another scenario
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NarrativeSectionProps {
  title: string;
  content: string;
  isVisible: boolean;
  accentColor: 'primary' | 'allow' | 'escalate';
}

function NarrativeSection({ title, content, isVisible, accentColor }: NarrativeSectionProps) {
  const colorClasses = {
    primary: 'border-primary/50 bg-primary/5',
    allow: 'border-allow/50 bg-allow/5',
    escalate: 'border-escalate/50 bg-escalate/5',
  };
  
  return (
    <div className={cn(
      "transition-all duration-700",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className={cn(
        "p-8 rounded-xl border-l-4",
        colorClasses[accentColor]
      )}>
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full",
            accentColor === 'primary' && "bg-primary",
            accentColor === 'allow' && "bg-allow",
            accentColor === 'escalate' && "bg-escalate"
          )} />
          {title}
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
