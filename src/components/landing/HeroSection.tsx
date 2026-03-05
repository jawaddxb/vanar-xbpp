import { Link } from 'react-router-dom';
import { ArrowRight, FileText, BookOpen, Library, PlayCircle, FlaskConical, Menu, X, Github } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { to: '/learn', label: 'Learn', icon: BookOpen },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/playground', label: 'Playground', icon: PlayCircle },
    { to: '/spec', label: 'Spec', icon: FileText },
    { to: '/test-suite', label: 'Test Suite', icon: FlaskConical },
  ];

  return (
    <section className="min-h-screen relative overflow-hidden" style={{ background: '#EDEDEA' }}>
      {/* Ambient teal glow blob */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(62, 207, 165, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ background: '#EDEDEA' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3ECFA5, #2AAF8E)' }}>
                <span className="text-white font-display text-xl">V</span>
              </div>
              <span className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#1E2D2D' }}>
                VANAR xBPP
              </span>
            </Link>

            {/* Center Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: '#6B6B67' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1E2D2D'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6B6B67'}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right CTA - Desktop */}
            <a
              href="https://github.com/vanarchain/xbpp"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider uppercase text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #3ECFA5, #2AAF8E)' }}
            >
              <Github className="h-4 w-4" />
              GitHub
              <ArrowRight className="h-4 w-4" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border transition-colors"
              style={{ borderColor: '#E2E2DE', color: '#1E2D2D' }}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(237, 237, 234, 0.95)', backdropFilter: 'blur(8px)' }}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm border-l transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ background: 'white', borderColor: '#E2E2DE' }}
        >
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E2E2DE' }}>
            <span className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#1E2D2D' }}>
              Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-lg border transition-colors"
              style={{ borderColor: '#E2E2DE', color: '#1E2D2D' }}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                style={{ color: '#6B6B67' }}
              >
                <div className="p-2 rounded-lg" style={{ background: 'rgba(62, 207, 165, 0.1)' }}>
                  <Icon className="h-5 w-5" style={{ color: '#3ECFA5' }} />
                </div>
                <span className="font-medium" style={{ color: '#1E2D2D' }}>{label}</span>
              </Link>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t" style={{ borderColor: '#E2E2DE' }}>
            <Link
              to="/playground"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold tracking-wider uppercase"
              style={{ background: 'linear-gradient(135deg, #3ECFA5, #2AAF8E)' }}
            >
              <PlayCircle className="h-5 w-5" />
              Try the Playground
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl">
          {/* Section Label */}
          <div
            className={`mb-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="section-label">
              VANAR × XBPP OPEN STANDARD · BASE NATIVE
            </div>
          </div>

          {/* Main Headline - Bebas Neue Italic */}
          <h1
            className={`mb-8 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(48px, 10vw, 100px)',
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#1E2D2D',
            }}
          >
            <span>Agents can spend money.</span>
            <br />
            <span>They just can't prove </span>
            <span style={{ color: '#3ECFA5' }}>they should.</span>
          </h1>

          {/* Body Text */}
          <p
            className={`mb-8 max-w-xl transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ fontSize: '17px', lineHeight: 1.7, color: '#6B6B67' }}
          >
            xBPP is the open standard for agentic governance. Define your rules once —
            budgets, approved vendors, risk tolerance — and every transaction follows them.
            A programmable CFO that says yes, no, or "ask me first."
          </p>

          {/* Feature Dot Row */}
          <div
            className={`flex flex-wrap gap-6 mb-10 transition-all duration-500 delay-250 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="feature-dot">ZeroClaw fork</div>
            <div className="feature-dot">Base native</div>
            <div className="feature-dot">x402 compatible</div>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Link to="/playground" className="btn-teal flex items-center justify-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Try the Playground
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link to="/spec" className="btn-ghost flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              Read the Spec
            </Link>
          </div>
        </div>
      </main>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ color: '#9E9E98' }}
      >
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-6 animate-pulse" style={{ background: 'linear-gradient(to bottom, #9E9E98, transparent)' }} />
      </div>
    </section>
  );
}
