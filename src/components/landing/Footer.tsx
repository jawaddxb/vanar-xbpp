import { Link } from 'react-router-dom';

const buildLinks = [
  { label: 'Quick Start Guide', path: '/learn/quick-start' },
  { label: 'Interactive Playground', path: '/playground' },
  { label: 'Protocol Specification', path: '/spec' },
  { label: 'SDK Reference', path: '/learn/quick-start' },
];

const libraryLinks = [
  { label: 'Policy Templates', path: '/library/policies' },
  { label: 'Test Scenarios', path: '/library/scenarios' },
  { label: 'Reason Codes', path: '/library/reason-codes' },
  { label: 'Agent Types', path: '/library/agents' },
];

const learnLinks = [
  { label: 'Getting Started', path: '/learn' },
  { label: 'Agent Payment Examples', path: '/learn/by-example' },
  { label: 'Core Concepts', path: '/learn/concepts' },
  { label: 'Compliance Test Suite', path: '/test-suite' },
];

export function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-12" style={{ background: '#1B2129', borderTop: '1px solid rgba(202, 208, 218, 0.15)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                style={{
                  color: '#03D9AF',
                  fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
                  fontSize: '16px',
                  letterSpacing: '1px',
                }}
              >
                XBPP.ORG
              </span>
            </div>
            <p className="text-sm" style={{ color: '#6B6F7D', fontFamily: "'Figtree', system-ui, sans-serif" }}>
              The open standard for governing autonomous AI agent payments.
            </p>
          </div>

          {/* Build */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{
                fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
                color: '#03D9AF',
              }}
            >
              Build
            </h4>
            <ul className="space-y-2">
              {buildLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm transition-colors"
                    style={{ color: '#CAD0DA', fontFamily: "'Figtree', system-ui, sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#03D9AF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#CAD0DA')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Library */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{
                fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
                color: '#03D9AF',
              }}
            >
              Library
            </h4>
            <ul className="space-y-2">
              {libraryLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm transition-colors"
                    style={{ color: '#CAD0DA', fontFamily: "'Figtree', system-ui, sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#03D9AF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#CAD0DA')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{
                fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
                color: '#03D9AF',
              }}
            >
              Learn
            </h4>
            <ul className="space-y-2">
              {learnLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm transition-colors"
                    style={{ color: '#CAD0DA', fontFamily: "'Figtree', system-ui, sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#03D9AF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#CAD0DA')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(202, 208, 218, 0.15)' }}>
          <p className="text-xs font-mono" style={{ color: '#6B6F7D' }}>
            Where agent behavior becomes obvious.
          </p>
          <a
            href="https://vanarchain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono transition-colors"
            style={{ color: '#6B6F7D' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#03D9AF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6F7D')}
          >
            An open standard by VanarChain
          </a>
        </div>
      </div>
    </footer>
  );
}
