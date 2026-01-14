import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { scenarios } from '@/lib/data/scenarios';
import { Category } from '@/lib/types';
import { AnimatedBackground } from '@/components/effects';
import { CategoryFilter, ScenarioCard } from '@/components/scenarios';

type FilterOption = 'ALL' | Category;

export default function Scenarios() {
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('ALL');

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
        {/* Header */}
        <header className="text-center mb-16">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-mono tracking-widest text-muted-foreground uppercase hover:text-primary transition-colors mb-8 animate-fade-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            POLICYLAB
          </Link>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-medium mt-6 mb-6 animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            Choose a scenario
          </h1>
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            Each scenario presents a decision point where policy constraints diverge.
            <br />
            <span className="text-foreground/80">Same situation. Different outcomes.</span>
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
        
        {/* Bottom hint */}
        <p 
          className="text-center text-sm text-muted-foreground/60 mt-16 font-mono animate-fade-in" 
          style={{ animationDelay: '600ms' }}
        >
          {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}
