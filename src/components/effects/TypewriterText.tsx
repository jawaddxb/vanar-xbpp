import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  highlight?: string;
  highlightClassName?: string;
}

export function TypewriterText({ 
  text, 
  className, 
  speed = 40, 
  delay = 0,
  onComplete,
  highlight,
  highlightClassName = 'text-primary'
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, onComplete]);

  const renderText = () => {
    if (!highlight) return displayedText;
    
    const parts = displayedText.split(highlight);
    if (parts.length === 1) return displayedText;
    
    return (
      <>
        {parts[0]}
        <span className={highlightClassName}>{highlight}</span>
        {parts.slice(1).join(highlight)}
      </>
    );
  };

  return (
    <span className={cn(className)}>
      {renderText()}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}
