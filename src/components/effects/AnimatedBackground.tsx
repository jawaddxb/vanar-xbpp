import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'intense' | 'subtle';
  className?: string;
}

export function AnimatedBackground({ variant = 'default', className }: AnimatedBackgroundProps) {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated grid */}
      <div 
        className={cn(
          "absolute inset-0 opacity-[0.02]",
          variant === 'intense' && "opacity-[0.04]",
          variant === 'subtle' && "opacity-[0.01]"
        )}
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-subtle" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/3 blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/2 blur-3xl opacity-50" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 50%, hsl(var(--background)) 100%)'
        }}
      />
    </div>
  );
}
