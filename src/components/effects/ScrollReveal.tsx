import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AnimationVariant = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const variantStyles: Record<AnimationVariant, { hidden: string; visible: string }> = {
  'fade-up': {
    hidden: 'opacity-0 translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    hidden: 'opacity-0 -translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    hidden: 'opacity-0 translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    hidden: 'opacity-0 -translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'scale': {
    hidden: 'opacity-0 scale-95',
    visible: 'opacity-100 scale-100',
  },
  'blur': {
    hidden: 'opacity-0 blur-sm',
    visible: 'opacity-100 blur-0',
  },
};

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  const styles = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all will-change-transform',
        isVisible ? styles.visible : styles.hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}

// Stagger container for multiple children
interface StaggerContainerProps {
  children: ReactNode[];
  staggerDelay?: number;
  variant?: AnimationVariant;
  className?: string;
  itemClassName?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 100,
  variant = 'fade-up',
  className,
  itemClassName,
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          variant={variant}
          delay={index * staggerDelay}
          className={itemClassName}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
