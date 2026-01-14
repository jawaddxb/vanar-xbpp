import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SplitRevealProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  isRevealed: boolean;
  className?: string;
}

export function SplitReveal({ leftContent, rightContent, isRevealed, className }: SplitRevealProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Center split line */}
      <div 
        className={cn(
          "absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-10",
          "bg-gradient-to-b from-transparent via-primary to-transparent",
          "transition-all duration-700",
          isRevealed ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        )}
      />
      
      {/* Glow on split line */}
      <div 
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-0",
          "bg-primary/20 blur-3xl rounded-full",
          "transition-all duration-1000",
          isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )}
      />

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        {/* Left panel */}
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          )}
        >
          {leftContent}
        </div>

        {/* Right panel */}
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          )}
          style={{ transitionDelay: isRevealed ? '150ms' : '0ms' }}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
}
