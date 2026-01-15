import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Terminal, BookOpen, Library, PlayCircle, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { to: '/learn', label: 'Learn', icon: BookOpen },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/playground', label: 'Playground', icon: PlayCircle },
    { to: '/spec', label: 'Spec', icon: FileText },
    { to: '/test-suite', label: 'Test Suite', icon: FlaskConical },
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

            {/* Mobile - Primary CTA */}
            <Link
              to="/playground"
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <PlayCircle className="h-4 w-4" />
              Playground
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto text-center space-y-10 relative z-10 pt-16">
        {/* Tagline Badge */}
        <div 
          className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono tracking-wider text-muted-foreground">
              The missing layer for autonomous agents
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
          <p className="text-lg md:text-xl text-muted-foreground">
            The open standard for Agentic Governance.
            <span className="block text-foreground/80 mt-1">A programmable CFO for your AI agents.</span>
          </p>
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