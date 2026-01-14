import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

const routeConfig: Record<string, { label: string; order: number }> = {
  '/scenarios': { label: 'Scenarios', order: 1 },
  '/compare': { label: 'Compare', order: 2 },
  '/run': { label: 'Run', order: 3 },
  '/diff': { label: 'Divergence', order: 4 },
  '/summary': { label: 'Summary', order: 5 },
  '/export': { label: 'Export', order: 6 },
  '/spec': { label: 'Specification', order: 0 },
};

export function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const searchParams = location.search;
  
  // Don't show on landing page
  if (currentPath === '/') return null;
  
  const currentRoute = routeConfig[currentPath];
  const currentOrder = currentRoute?.order || 0;
  
  // Build breadcrumbs based on flow order
  const breadcrumbs: BreadcrumbItem[] = [];
  
  if (currentPath === '/spec') {
    breadcrumbs.push({ label: 'Specification', path: '/spec', active: true });
  } else {
    // Add all steps up to current
    const orderedRoutes = Object.entries(routeConfig)
      .filter(([, config]) => config.order > 0 && config.order <= currentOrder)
      .sort((a, b) => a[1].order - b[1].order);
    
    orderedRoutes.forEach(([path, config]) => {
      breadcrumbs.push({
        label: config.label,
        path: path + (config.order > 1 ? searchParams : ''),
        active: path === currentPath,
      });
    });
  }
  
  // Calculate progress percentage
  const maxOrder = 5; // Summary is final main step
  const progress = currentOrder > 0 ? (currentOrder / maxOrder) * 100 : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
            <span className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
              PolicyLab
            </span>
          </Link>
          
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 mx-1" />
                )}
                {crumb.active ? (
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          {/* Mobile current step */}
          <div className="md:hidden">
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {currentRoute?.label || 'PolicyLab'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {currentOrder > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/30">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}
