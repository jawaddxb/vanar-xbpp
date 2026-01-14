import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MetricCounterProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MetricCounter({ value, label, icon, className, delay = 0 }: MetricCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate the value appearing character by character for dramatic effect
      let index = 0;
      const interval = setInterval(() => {
        if (index <= value.length) {
          setDisplayValue(value.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      className={cn(
        "p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm",
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl md:text-3xl font-medium font-mono">
        {displayValue}
        {!displayValue && <span className="opacity-0">{value}</span>}
      </p>
    </div>
  );
}
