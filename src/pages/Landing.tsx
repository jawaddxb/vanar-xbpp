import { AnimatedBackground } from '@/components/effects';
import {
  HeroSection,
  ProblemSection,
  InsightSection,
  WhatIsSection,
  HowItWorksSection,
  TheMomentSection,
  WhyMattersSection,
  WhoIsForSection,
  DifferentSection,
  StandardSection,
  NotSection,
  WhyNowSection,
  FinalCTASection,
  Footer,
} from '@/components/landing';

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground variant="default" />
      
      <HeroSection />
      <ProblemSection />
      <InsightSection />
      <WhatIsSection />
      <HowItWorksSection />
      <TheMomentSection />
      <WhyMattersSection />
      <WhoIsForSection />
      <DifferentSection />
      <StandardSection />
      <NotSection />
      <WhyNowSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
