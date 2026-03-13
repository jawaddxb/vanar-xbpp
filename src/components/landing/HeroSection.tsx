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
    <section className="min-h-screen relative overflow-hidden" style={{ background: '#e8e9e9' }}>
      {/* Ambient teal glow blob */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(3, 217, 175, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ background: '#e8e9e9' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            {/* Logo - Akira Expanded */}
            <Link to="/" className="flex items-center gap-2 group">
              <span style={{
                fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
                fontSize: '16px',
                letterSpacing: '1px',
                color: '#03D9AF',
              }}>XBPP.ORG</span>
            </Link>

            {/* Center Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#282B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6B6F7D'}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right CTA - Desktop */}
            <span
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider uppercase text-white opacity-40 cursor-not-allowed select-none"
              style={{
                background: 'linear-gradient(135deg, #9ca3af, #6b7280)',
                clipPath: 'polygon(10px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 10px)',
              }}
              title="Reference implementation coming soon"
            >
              <Github className="h-4 w-4" />
              SDK Coming Soon
            </span>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 transition-colors"
              style={{ border: '1px solid #CAD0DA', color: '#282B35' }}
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
          style={{ background: 'rgba(232, 233, 233, 0.95)', backdropFilter: 'blur(8px)' }}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm border-l transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ background: 'white', borderColor: '#CAD0DA' }}
        >
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#CAD0DA' }}>
            <span className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#282B35' }}>
              Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 border transition-colors"
              style={{ borderColor: '#CAD0DA', color: '#282B35' }}
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
                className="flex items-center gap-4 p-4 transition-colors"
                style={{ color: '#6B6F7D' }}
              >
                <div className="p-2" style={{ background: 'rgba(3, 217, 175, 0.1)' }}>
                  <Icon className="h-5 w-5" style={{ color: '#03D9AF' }} />
                </div>
                <span className="font-medium" style={{ color: '#282B35' }}>{label}</span>
              </Link>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t" style={{ borderColor: '#CAD0DA' }}>
            <Link
              to="/playground"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 text-white font-semibold tracking-wider uppercase"
              style={{
                background: 'linear-gradient(135deg, #03D9AF, #029a7d)',
                clipPath: 'polygon(14px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 14px)',
              }}
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
              THE OPEN STANDARD
            </div>
          </div>

          {/* Main Headline - Akira Expanded */}
          <h1
            className={`mb-8 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
              fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
              fontSize: 'clamp(52px, 8vw, 96px)',
              lineHeight: 0.92,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#282B35',
            }}
          >
            <span>Agents can spend money.</span>
            <br />
            <span>They just can't prove </span>
            <span style={{ color: '#03D9AF' }}>they should.</span>
          </h1>

          {/* Body Text */}
          <p
            className={`mb-8 max-w-xl transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ fontSize: '17px', lineHeight: 1.7, color: '#6B6F7D', fontFamily: "'Figtree', sans-serif" }}
          >
            xBPP is the open standard that answers one question before every agent action: should this be allowed? Define policies once — spending limits, approved vendors, escalation rules — and every agent follows them. No custom code. No prayer. Just policy.
          </p>

          {/* Feature Dot Row */}
          <div
            className={`flex flex-wrap gap-6 mb-10 transition-all duration-500 delay-250 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="feature-dot">Open standard</div>
            <div className="feature-dot">Payment-rail agnostic</div>
            <div className="feature-dot">Chain agnostic</div>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Link to="/playground" className="btn-primary">
              TRY THE PLAYGROUND
            </Link>

            <Link to="/spec" className="hover-btn">
              READ THE SPEC
            </Link>
          </div>
        </div>
      </main>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ color: '#6B6F7D' }}
      >
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-6 animate-pulse" style={{ background: 'linear-gradient(to bottom, #6B6F7D, transparent)' }} />
      </div>
    </section>
  );
}
