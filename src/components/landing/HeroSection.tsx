import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Terminal, BookOpen, Library, PlayCircle, FlaskConical, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/learn', label: 'Learn', icon: BookOpen, description: 'Getting started guides' },
    { to: '/library', label: 'Library', icon: Library, description: 'Policies, scenarios & more' },
    { to: '/playground', label: 'Playground', icon: PlayCircle, description: 'Interactive demo' },
    { to: '/spec', label: 'Spec', icon: FileText, description: 'Technical specification' },
    { to: '/test-suite', label: 'Test Suite', icon: FlaskConical, description: 'Verification dashboard' },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      {/* Top Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-2.5 h-2.5 rounded-full bg-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-mono font-medium tracking-[0.15em] uppercase text-foreground">
                BPPLAB
              </span>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full border border-border/40 bg-background/80 backdrop-blur-md">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile - Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-border/40 bg-background/80 backdrop-blur-md text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border/50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <span className="text-sm font-mono font-medium tracking-[0.15em] uppercase text-foreground">
              Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border/40 bg-muted/30 text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Nav Links */}
          <div className="p-6 space-y-2">
            {navLinks.map(({ to, label, icon: Icon, description }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-start gap-4 p-4 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/30">
            <Button asChild size="lg" className="w-full">
              <Link to="/playground" onClick={() => setMobileMenuOpen(false)}>
                <PlayCircle className="mr-2 h-5 w-5" />
                Try the Playground
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto text-center space-y-10 relative z-10 pt-16">
        {/* Tagline Badge */}
        <div 
          className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-mono tracking-wider text-muted-foreground">
              The policy standard for agent transactions
            </span>
          </div>
        </div>
        
        {/* Main Headline */}
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="block text-muted-foreground">Agents can spend money.</span>
          <span className="block mt-2">They just can't prove</span>
          <span className="block mt-2 text-primary">they should.</span>
        </h1>
        
        {/* Subhead */}
        <div 
          className={`max-w-xl mx-auto space-y-3 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-xl md:text-2xl text-foreground font-medium">
            xBPP changes that.
          </p>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Define your rules once. Every transaction follows them.
            <span className="block text-foreground/80 mt-2">A programmable CFO that says yes, no, or "ask me first."</span>
          </p>
        </div>
        
        {/* Architecture Flow Diagram */}
        <div 
          className={`transition-all duration-500 delay-250 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-3 md:gap-4 px-5 py-4 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm">
            {/* Intent */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center">
                <span className="text-lg md:text-xl">💬</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Intent</span>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center text-muted-foreground/50">
              <div className="w-6 md:w-10 h-px bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/40" />
              <ArrowRight className="h-4 w-4 -ml-1" />
            </div>
            
            {/* Interpret */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-lg md:text-xl">⚙️</span>
              </div>
              <span className="text-xs font-mono text-primary uppercase tracking-wide">xBPP</span>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center text-muted-foreground/50">
              <div className="w-6 md:w-10 h-px bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20" />
              <ArrowRight className="h-4 w-4 -ml-1" />
            </div>
            
            {/* Verdict */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[hsl(var(--decision-allow))]/20 border border-[hsl(var(--decision-allow))]/40 flex items-center justify-center">
                  <span className="text-[10px] md:text-xs">✓</span>
                </div>
                <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[hsl(var(--decision-block))]/20 border border-[hsl(var(--decision-block))]/40 flex items-center justify-center">
                  <span className="text-[10px] md:text-xs">✗</span>
                </div>
                <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[hsl(var(--decision-escalate))]/20 border border-[hsl(var(--decision-escalate))]/40 flex items-center justify-center">
                  <span className="text-[10px] md:text-xs">?</span>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Verdict</span>
            </div>
          </div>
        </div>
        
        {/* SDK Install Preview */}
        <div 
          className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
            <Terminal className="h-4 w-4 text-primary" />
            <code className="text-sm font-mono text-muted-foreground">
              npm install <span className="text-primary">@anthropic/xbpp</span>
            </code>
          </div>
        </div>
        
        {/* CTAs */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transition-all duration-500 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Button asChild size="lg" className="group text-base px-8 py-6">
            <Link to="/playground">
              <PlayCircle className="mr-2 h-5 w-5" />
              Try the Playground
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-base px-8 py-6">
            <Link to="/spec">
              <FileText className="mr-2 h-5 w-5" />
              Read the Spec
            </Link>
          </Button>
        </div>
      </main>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40">
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-muted-foreground/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}