import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12" style={{ background: '#EDEDEA', borderTop: '1px solid #E2E2DE' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3ECFA5, #2AAF8E)' }}
              >
                <span className="text-white font-display text-lg">V</span>
              </div>
              <span className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#1E2D2D' }}>
                VANAR xBPP
              </span>
            </div>
            <p className="text-sm" style={{ color: '#6B6B67' }}>Built on VanarChain</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <Link
              to="/scenarios"
              className="transition-colors"
              style={{ color: '#6B6B67' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1E2D2D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B6B67'}
            >
              Run a simulation
            </Link>
            <Link
              to="/spec"
              className="transition-colors"
              style={{ color: '#6B6B67' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1E2D2D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B6B67'}
            >
              View the standard
            </Link>
            <a
              href="https://github.com/vanarchain/xbpp"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: '#6B6B67' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3ECFA5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B6B67'}
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid #E2E2DE' }}>
          <p className="text-xs font-mono" style={{ color: '#9E9E98' }}>
            Where agent behavior becomes obvious. &mdash;{' '}
            <a
              href="https://vanarchain.com"
              className="transition-colors"
              style={{ color: '#9E9E98' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3ECFA5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9E9E98'}
            >
              vanarchain.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
