import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const notItems = [
  'tell you what to do',
  'optimize your agent',
  'rank policies',
  'predict outcomes',
  'replace judgment',
];

export function NotSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-6 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-mono tracking-widest text-muted-foreground/60 uppercase">What BPPLAB Is NOT</p>
        </div>

        {/* Not items */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-3 mb-8 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {notItems.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground/60"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <X className="h-3 w-3 text-muted-foreground/40" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div 
          className={cn(
            "text-center transition-all duration-700 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-muted-foreground">
            It shows you what your rules mean.
          </p>
          <p className="text-foreground font-medium mt-1">
            The decision is still yours.
          </p>
        </div>
      </div>
    </section>
  );
}
