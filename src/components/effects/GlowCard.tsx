import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'allow' | 'block' | 'escalate';
  hover?: boolean;
}

export function GlowCard({ children, className, glowColor = 'primary', hover = true }: GlowCardProps) {
  const glowColors = {
    primary: 'hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] hover:border-primary/50',
    allow: 'hover:shadow-[0_0_30px_-5px_hsl(var(--decision-allow)/0.3)] hover:border-allow/50',
    block: 'hover:shadow-[0_0_30px_-5px_hsl(var(--decision-block)/0.3)] hover:border-block/50',
    escalate: 'hover:shadow-[0_0_30px_-5px_hsl(var(--decision-escalate)/0.3)] hover:border-escalate/50',
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card transition-all duration-500",
        hover && glowColors[glowColor],
        className
      )}
    >
      {children}
    </div>
  );
}
