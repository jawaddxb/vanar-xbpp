import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-mono tracking-[0.2em] uppercase">BPPLAB</span>
            </div>
            <p className="text-sm text-muted-foreground">Behavior under constraint</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <Link to="/scenarios" className="text-muted-foreground hover:text-foreground transition-colors">
              Run a simulation
            </Link>
            <Link to="/spec" className="text-muted-foreground hover:text-foreground transition-colors">
              View the standard
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground/50 font-mono">
            Where agent behavior becomes obvious.
          </p>
        </div>
      </div>
    </footer>
  );
}
