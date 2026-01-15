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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
              <span className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                PolicyLab
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1 px-3 py-2 rounded-full border border-border/30 bg-card/30 backdrop-blur-md">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/playground"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-border/30 bg-card/30 backdrop-blur-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Playground
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated timeline pulse - top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-primary/60 to-transparent animate-pulse-subtle" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/80 blur-sm animate-pulse" />
      </div>
      
      <main className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Tagline */}
        <div 
          className={`mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono tracking-[0.3em] text-muted-foreground uppercase">
              The missing layer for autonomous agents
            </span>
          </div>
        </div>
        
        {/* Main Headline */}
        <h1 
          className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[1.05] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="block text-muted-foreground/90">Agents can spend money.</span>
          <span className="block">They just can't prove</span>
          <span className="block text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
            they should.
          </span>
        </h1>
        
        {/* Subhead */}
        <div 
          className={`max-w-2xl mx-auto space-y-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-2xl md:text-3xl text-foreground font-medium">
            xBPP changes that.
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            The open standard for Agentic Governance.
            <br />
            <span className="text-foreground/80">A programmable CFO for your AI agents.</span>
          </p>
        </div>
        
        {/* SDK Install Preview */}
        <div 
          className={`transition-all duration-700 delay-250 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
            <Terminal className="h-4 w-4 text-primary" />
            <code className="text-sm font-mono text-muted-foreground">
              npm install <span className="text-primary">@anthropic/xbpp</span>
            </code>
          </div>
        </div>
        
        {/* Animated divider */}
        <div 
          className={`flex items-center justify-center gap-3 py-8 transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
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
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Button asChild size="lg" className="group text-lg px-8 py-6 relative overflow-hidden">
            <Link to="/playground">
              <span className="relative z-10 flex items-center">
                <PlayCircle className="mr-2 h-5 w-5" />
                Try the Playground
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground text-lg px-8 py-6 group">
            <Link to="/spec">
              <FileText className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Read the xBPP spec
            </Link>
          </Button>
        </div>
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
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50">
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent animate-pulse-subtle" />
      </div>
    </section>
  );
}