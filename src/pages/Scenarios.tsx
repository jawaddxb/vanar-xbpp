import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Sparkles, X } from 'lucide-react';
import { scenarios } from '@/lib/data/scenarios';
import { Category } from '@/lib/types';
import { AnimatedBackground } from '@/components/effects';
import { CategoryFilter, ScenarioCard } from '@/components/scenarios';
import { useBPPLabStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterOption = 'ALL' | Category;

export default function Scenarios() {
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('ALL');
  const { customPolicy, useCustomPolicy, clearCustomPolicy } = useBPPLabStore();

  const filteredScenarios = useMemo(() => {
    if (selectedCategory === 'ALL') return scenarios;
    return scenarios.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  const counts = useMemo(() => ({
    ALL: scenarios.length,
    SPEND: scenarios.filter(s => s.category === 'SPEND').length,
    SIGN: scenarios.filter(s => s.category === 'SIGN').length,
    DEFENSE: scenarios.filter(s => s.category === 'DEFENSE').length,
  }), []);

  // Determine featured scenarios (first HIGH risk in view, or first overall)
  const featuredIndex = filteredScenarios.findIndex(s => s.risk_level === 'HIGH');

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Custom Policy Banner */}
        {useCustomPolicy && customPolicy && (
          <div className="mb-8 animate-fade-in">
            <div className="p-4 rounded-xl border border-primary/50 bg-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    Testing Your Custom Policy
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-mono",
                      customPolicy.xbpp?.posture === 'AGGRESSIVE' ? 'bg-escalate/20 text-escalate' :
                      customPolicy.xbpp?.posture === 'CAUTIOUS' ? 'bg-allow/20 text-allow' :
                      'bg-primary/20 text-primary'
                    )}>
                      {customPolicy.xbpp?.posture}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max ${customPolicy.xbpp?.limits.max_single?.toLocaleString()}/tx • 
                    ${customPolicy.xbpp?.limits.max_daily?.toLocaleString()}/day • 
                    Human above ${customPolicy.xbpp?.limits.require_human_above?.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearCustomPolicy} className="shrink-0">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-16">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-mono tracking-widest text-muted-foreground uppercase hover:text-primary transition-colors mb-8 animate-fade-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            BPPLAB
          </Link>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-medium mt-6 mb-6 animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            {useCustomPolicy ? 'Test your policy' : 'Choose a scenario'}
          </h1>
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            {useCustomPolicy ? (
              <>
                Select a scenario to see how your custom policy handles real-world situations.
                <br />
                <span className="text-foreground/80">Your policy vs. Cautious Standard.</span>
              </>
            ) : (
              <>
                Each scenario presents a decision point where policy constraints diverge.
                <br />
                <span className="text-foreground/80">Same situation. Different outcomes.</span>
              </>
            )}
          </p>
        </header>
        
        {/* Category Filter */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CategoryFilter 
            selected={selectedCategory}
            onChange={setSelectedCategory}
            counts={counts}
          />
        </div>

        {/* Category description */}
        {selectedCategory !== 'ALL' && (
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-muted-foreground">
              {selectedCategory === 'SPEND' && 'Financial transactions, vendor relationships, and spending controls.'}
              {selectedCategory === 'SIGN' && 'Cryptographic signatures, approvals, and authorization chains.'}
              {selectedCategory === 'DEFENSE' && 'Threat detection, address verification, and security responses.'}
            </p>
          </div>
        )}
        
        {/* Scenario Grid - Masonry-style with featured cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredScenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              index={index}
              featured={index === featuredIndex && filteredScenarios.length > 2}
            />
          ))}
        </div>
        
        {/* Empty state */}
        {filteredScenarios.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-muted-foreground">No scenarios in this category yet.</p>
          </div>
        )}
        
        {/* Bottom actions */}
        <div 
          className="flex flex-col items-center gap-4 mt-16 animate-fade-in" 
          style={{ animationDelay: '600ms' }}
        >
          <Link
            to="/matrix"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            View Comparison Matrix
          </Link>
          <p className="text-sm text-muted-foreground/60 font-mono">
            {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>
    </div>
  );
}
