import { AnimatedBackground, ScrollReveal } from '@/components/effects';
import {
  HeroSection,
  ProblemSection,
  WhatIsSection,
  ParadigmShiftSection,
  HowItWorksSection,
  UseCaseCarousel,
  PlaygroundPreview,
  WhoIsForSection,
  FinalCTASection,
  Footer,
} from '@/components/landing';

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground variant="default" />
      
      {/* 1. Hero - The hook (no scroll animation - already has mount animation) */}
      <HeroSection />
      
      {/* 2. Problem - The Agentic Gap */}
      <ScrollReveal variant="fade-up">
        <ProblemSection />
      </ScrollReveal>
      
      {/* 3. Solution - What is xBPP */}
      <ScrollReveal variant="fade-up" delay={50}>
        <WhatIsSection />
      </ScrollReveal>
      
      {/* 4. Paradigm Shift - Before/After comparison */}
      <ScrollReveal variant="scale">
        <ParadigmShiftSection />
      </ScrollReveal>
      
      {/* 5. How It Works - Architecture of Trust */}
      <ScrollReveal variant="fade-up">
        <HowItWorksSection />
      </ScrollReveal>
      
      {/* 6. Use Cases - Interactive carousel */}
      <ScrollReveal variant="fade-left">
        <UseCaseCarousel />
      </ScrollReveal>
      
      {/* 7. Playground Preview - Interactive demo teaser */}
      <ScrollReveal variant="scale" delay={100}>
        <PlaygroundPreview />
      </ScrollReveal>
      
      {/* 8. Who It's For - Target personas */}
      <ScrollReveal variant="fade-up">
        <WhoIsForSection />
      </ScrollReveal>
      
      {/* 9. Final CTA */}
      <ScrollReveal variant="blur">
        <FinalCTASection />
      </ScrollReveal>
      
      {/* Footer */}
      <ScrollReveal variant="fade-up" threshold={0.05}>
        <Footer />
      </ScrollReveal>
    </div>
  );
}