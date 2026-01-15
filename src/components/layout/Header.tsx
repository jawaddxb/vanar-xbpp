import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, BookOpen, Lightbulb, GraduationCap, Library, Shield, Target, List, Bot, PlayCircle, FileText, FlaskConical, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

const routeConfig: Record<string, { label: string; order: number }> = {
  '/scenarios': { label: 'Scenarios', order: 1 },
  '/policies': { label: 'Policies', order: 0 },
  '/matrix': { label: 'Matrix', order: 0 },
  '/compare': { label: 'Compare', order: 2 },
  '/run': { label: 'Run', order: 3 },
  '/diff': { label: 'Divergence', order: 4 },
  '/summary': { label: 'Summary', order: 5 },
  '/export': { label: 'Export', order: 6 },
  '/spec': { label: 'Specification', order: 0 },
  '/test-suite': { label: 'Test Suite', order: 0 },
  '/learn': { label: 'Learn', order: 0 },
  '/learn/quick-start': { label: 'Quick Start', order: 0 },
  '/learn/by-example': { label: 'By Example', order: 0 },
  '/learn/concepts': { label: 'Concepts', order: 0 },
  '/library': { label: 'Library', order: 0 },
  '/library/policies': { label: 'Policies', order: 0 },
  '/library/scenarios': { label: 'Scenarios', order: 0 },
  '/library/reason-codes': { label: 'Reason Codes', order: 0 },
  '/library/agents': { label: 'Agents', order: 0 },
  '/playground': { label: 'Playground', order: 0 },
};

const learnLinks = [
  { path: '/learn/quick-start', label: 'Quick Start', description: '30-second integration', icon: Lightbulb },
  { path: '/learn/by-example', label: 'By Example', description: '8 agent use cases', icon: BookOpen },
  { path: '/learn/concepts', label: 'Concepts', description: 'Core principles', icon: GraduationCap },
];

const libraryLinks = [
  { path: '/library/policies', label: 'Policies', description: '10+ templates', icon: Shield },
  { path: '/library/scenarios', label: 'Scenarios', description: '22 situations', icon: Target },
  { path: '/library/reason-codes', label: 'Reason Codes', description: '45+ codes', icon: List },
  { path: '/library/agents', label: 'Agent Types', description: '8 templates', icon: Bot },
];

export function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const searchParams = location.search;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Don't show on landing page
  if (currentPath === '/') return null;
  
  const currentRoute = routeConfig[currentPath];
  const currentOrder = currentRoute?.order || 0;
  
  // Build breadcrumbs based on flow order
  const breadcrumbs: BreadcrumbItem[] = [];
  
  if (currentPath === '/spec') {
    breadcrumbs.push({ label: 'Specification', path: '/spec', active: true });
  } else if (currentPath === '/test-suite') {
    breadcrumbs.push({ label: 'Test Suite', path: '/test-suite', active: true });
  } else if (currentPath === '/playground') {
    breadcrumbs.push({ label: 'Playground', path: '/playground', active: true });
  } else if (currentPath.startsWith('/learn')) {
    breadcrumbs.push({ label: 'Learn', path: '/learn', active: currentPath === '/learn' });
    if (currentPath !== '/learn') {
      breadcrumbs.push({ label: currentRoute?.label || '', path: currentPath, active: true });
    }
  } else if (currentPath.startsWith('/library')) {
    breadcrumbs.push({ label: 'Library', path: '/library', active: currentPath === '/library' });
    if (currentPath !== '/library') {
      breadcrumbs.push({ label: currentRoute?.label || '', path: currentPath, active: true });
    }
  } else {
    // Add all steps up to current for demo flow
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

  const isActiveSection = (basePath: string) => currentPath.startsWith(basePath);

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
              BPPLAB
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Learn Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "gap-1 text-muted-foreground hover:text-foreground",
                    isActiveSection('/learn') && "text-primary bg-primary/10"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  Learn
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-card border-border z-[100]">
                <DropdownMenuLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Getting Started
                </DropdownMenuLabel>
                {learnLinks.map(({ path, label, description, icon: Icon }) => (
                  <DropdownMenuItem key={path} asChild className="cursor-pointer">
                    <Link to={path} className="flex items-start gap-3 py-2">
                      <Icon className="h-4 w-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Library Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "gap-1 text-muted-foreground hover:text-foreground",
                    isActiveSection('/library') && "text-primary bg-primary/10"
                  )}
                >
                  <Library className="h-4 w-4" />
                  Library
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-card border-border z-[100]">
                <DropdownMenuLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Behavioral Library
                </DropdownMenuLabel>
                {libraryLinks.map(({ path, label, description, icon: Icon }) => (
                  <DropdownMenuItem key={path} asChild className="cursor-pointer">
                    <Link to={path} className="flex items-start gap-3 py-2">
                      <Icon className="h-4 w-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Playground */}
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={cn(
                "gap-1 text-muted-foreground hover:text-foreground",
                currentPath === '/playground' && "text-primary bg-primary/10"
              )}
            >
              <Link to="/playground">
                <PlayCircle className="h-4 w-4" />
                Playground
              </Link>
            </Button>

            {/* Spec */}
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={cn(
                "gap-1 text-muted-foreground hover:text-foreground",
                currentPath === '/spec' && "text-primary bg-primary/10"
              )}
            >
              <Link to="/spec">
                <FileText className="h-4 w-4" />
                Spec
              </Link>
            </Button>

            {/* Test Suite */}
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={cn(
                "gap-1 text-muted-foreground hover:text-foreground",
                currentPath === '/test-suite' && "text-primary bg-primary/10"
              )}
            >
              <Link to="/test-suite">
                <FlaskConical className="h-4 w-4" />
                Test Suite
              </Link>
            </Button>
          </nav>

          {/* Breadcrumbs - Only show for demo flow */}
          {currentOrder > 0 && (
            <nav className="hidden md:flex lg:hidden items-center gap-1">
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
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-border/30 mt-4">
            <div className="space-y-4">
              {/* Learn Section */}
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Learn</p>
                <div className="space-y-1">
                  {learnLinks.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        currentPath === path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Library Section */}
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Library</p>
                <div className="space-y-1">
                  {libraryLinks.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        currentPath === path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                <Link
                  to="/playground"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    currentPath === '/playground' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlayCircle className="h-4 w-4" />
                  Playground
                </Link>
                <Link
                  to="/spec"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    currentPath === '/spec' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="h-4 w-4" />
                  Spec
                </Link>
                <Link
                  to="/test-suite"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    currentPath === '/test-suite' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FlaskConical className="h-4 w-4" />
                  Test Suite
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Progress bar - only for demo flow */}
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
