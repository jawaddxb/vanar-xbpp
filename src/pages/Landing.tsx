import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/effects';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <AnimatedBackground variant="default" />
      
      {/* Animated timeline pulse - top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-primary/60 to-transparent animate-pulse-subtle" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/80 blur-sm animate-pulse" />
      </div>
      
      <main className="max-w-3xl mx-auto text-center space-y-10 relative z-10">
        {/* Logo / Brand */}
        <div className="mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-sm font-mono tracking-[0.3em] text-muted-foreground uppercase">
              POLICYLAB
            </h2>
          </div>
        </div>
        
        {/* Headline */}
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          Same agent. Same world.
          <br />
          <span className="text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
            Different rules.
          </span>
        </h1>
        
        {/* Subhead */}
        <p 
          className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          Watch how autonomous systems behave under constraint.
        </p>
        
        {/* Animated divider */}
        <div 
          className="flex items-center justify-center gap-3 py-10 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-primary/80 animate-pulse-subtle" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary blur-md animate-pulse-subtle" />
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        
        {/* CTAs */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          <Button asChild size="lg" className="group text-lg px-8 py-6 relative overflow-hidden">
            <Link to="/scenarios">
              <span className="relative z-10 flex items-center">
                Run a simulation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground text-lg px-8 py-6 group">
            <Link to="/spec">
              <FileText className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              View the standard
            </Link>
          </Button>
        </div>
        
        {/* Tagline */}
        <p 
          className="text-sm text-muted-foreground/60 font-mono tracking-wide animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          Where agent behavior becomes obvious.
        </p>
      </main>
      
      {/* Bottom pulse */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-40">
        <div className="w-full h-full bg-gradient-to-t from-transparent via-primary/40 to-transparent animate-pulse-subtle" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-border/30 rounded-tl-lg opacity-50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-border/30 rounded-tr-lg opacity-50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-border/30 rounded-bl-lg opacity-50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-border/30 rounded-br-lg opacity-50" />
    </div>
  );
}
