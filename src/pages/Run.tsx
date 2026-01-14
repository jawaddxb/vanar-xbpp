import { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePolicyLabStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Event } from '@/lib/types';
import { AnimatedBackground } from '@/components/effects';

export default function Run() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scenarioId = searchParams.get('scenario');
  
  const {
    selectedScenario,
    loadScenarioData,
    currentEventIndex,
    setCurrentEventIndex,
    isPlaying,
    setIsPlaying,
  } = usePolicyLabStore();
  
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  useEffect(() => {
    if (!scenarioId) {
      navigate('/scenarios');
      return;
    }
    if (!selectedScenario || selectedScenario.id !== scenarioId) {
      loadScenarioData(scenarioId);
    }
  }, [scenarioId, selectedScenario, loadScenarioData, navigate]);
  
  const events = selectedScenario?.event_stream || [];
  const totalEvents = events.length;
  
  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentEventIndex >= totalEvents - 1) {
      setIsPlaying(false);
      setHasReachedEnd(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setCurrentEventIndex(currentEventIndex + 1);
    }, 1800); // Deliberate, theatrical pacing
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentEventIndex, totalEvents, setCurrentEventIndex, setIsPlaying]);
  
  // Start auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setIsPlaying]);
  
  const handleTogglePlay = useCallback(() => {
    if (hasReachedEnd) {
      setCurrentEventIndex(0);
      setHasReachedEnd(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, hasReachedEnd, setIsPlaying, setCurrentEventIndex]);
  
  const handleReset = useCallback(() => {
    setCurrentEventIndex(0);
    setIsPlaying(false);
    setHasReachedEnd(false);
  }, [setCurrentEventIndex, setIsPlaying]);
  
  const handleSliderChange = useCallback((value: number[]) => {
    setCurrentEventIndex(value[0]);
    setIsPlaying(false);
    setHasReachedEnd(value[0] >= totalEvents - 1);
  }, [setCurrentEventIndex, setIsPlaying, totalEvents]);
  
  const handleProceedToDiff = () => {
    navigate(`/diff?scenario=${scenarioId}`);
  };
  
  if (!selectedScenario) return null;

  return (
    <div className="min-h-screen py-20 px-6 pb-40 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm mb-6 animate-fade-in">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isPlaying ? "bg-allow animate-pulse" : "bg-muted-foreground"
            )} />
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              {isPlaying ? 'Simulation Running' : hasReachedEnd ? 'Complete' : 'Paused'}
            </p>
          </div>
          <h1 
            className="text-3xl md:text-4xl font-medium animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            {selectedScenario.name}
          </h1>
        </header>
        
        {/* Timeline */}
        <div className="relative mb-12">
          {/* Timeline track */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-border to-transparent" />
          
          {/* Progress indicator */}
          <div 
            className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary to-primary/80 transition-all duration-500"
            style={{ height: `${((currentEventIndex + 1) / totalEvents) * 100}%` }}
          />
          
          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <TimelineEvent
                key={event.id}
                event={event}
                index={index}
                isVisible={index <= currentEventIndex}
                isCurrent={index === currentEventIndex}
                isPending={event.pending && index === currentEventIndex}
                totalEvents={totalEvents}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Controls - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border p-6 z-50">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-muted-foreground w-12 text-right">
              {currentEventIndex + 1}/{totalEvents}
            </span>
            <div className="flex-1 relative">
              <Slider
                value={[currentEventIndex]}
                max={totalEvents - 1}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
            </div>
            <span className="text-sm font-mono text-muted-foreground w-20 text-right">
              {Math.round(((currentEventIndex + 1) / totalEvents) * 100)}%
            </span>
          </div>
          
          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" onClick={handleReset} className="h-10 w-10">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleTogglePlay}
              className={cn(
                "h-12 w-12 rounded-full",
                isPlaying && "border-allow text-allow"
              )}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            
            {hasReachedEnd && (
              <Button onClick={handleProceedToDiff} className="ml-4 group">
                <Eye className="mr-2 h-4 w-4" />
                View divergence
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineEventProps {
  event: Event;
  index: number;
  isVisible: boolean;
  isCurrent: boolean;
  isPending: boolean;
  totalEvents: number;
}

function TimelineEvent({ event, index, isVisible, isCurrent, isPending, totalEvents }: TimelineEventProps) {
  const typeConfig = {
    action: { color: 'bg-primary', label: 'Action', border: 'border-primary/30' },
    request: { color: 'bg-escalate', label: 'Request', border: 'border-escalate/30' },
    evaluation: { color: 'bg-muted-foreground', label: 'Eval', border: 'border-muted-foreground/30' },
    decision: { color: 'bg-allow', label: 'Decision', border: 'border-allow/30' },
  };
  
  const config = typeConfig[event.type];
  
  return (
    <div
      className={cn(
        "relative pl-16 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      )}
      style={{ transitionDelay: isVisible ? `${index * 50}ms` : '0ms' }}
    >
      {/* Timeline node */}
      <div className="absolute left-4 top-4">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 border-background transition-all duration-300",
            config.color,
            isCurrent && "ring-4 ring-primary/30 scale-125",
            isPending && "animate-pulse"
          )}
        />
        {isCurrent && (
          <div className={cn(
            "absolute inset-0 w-4 h-4 rounded-full blur-md",
            config.color
          )} />
        )}
      </div>
      
      {/* Event number */}
      <span className="absolute left-0 top-4 text-xs font-mono text-muted-foreground/50">
        {String(index + 1).padStart(2, '0')}
      </span>
      
      {/* Content */}
      <div className={cn(
        "p-6 rounded-lg border bg-card/50 backdrop-blur-sm transition-all duration-300",
        isCurrent && "border-primary/50 bg-card/80 shadow-lg shadow-primary/5",
        isPending && "border-escalate/50 bg-escalate/5",
        config.border
      )}>
        {/* Type badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            "inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-mono uppercase tracking-wider",
            `bg-${event.type === 'action' ? 'primary' : event.type === 'request' ? 'escalate' : event.type === 'decision' ? 'allow' : 'muted'}/10`
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", config.color)} />
            {config.label}
          </span>
          {isCurrent && !isPending && (
            <span className="text-xs text-muted-foreground/50 font-mono">now</span>
          )}
        </div>
        
        {/* Narrative */}
        <p className={cn(
          "text-lg font-medium leading-relaxed",
          isPending && "text-escalate"
        )}>
          {event.narrative}
        </p>
        
        {/* Details */}
        {event.details && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {event.details}
          </p>
        )}
        
        {/* Pending indicator */}
        {isPending && (
          <div className="mt-4 flex items-center gap-3 text-sm text-escalate font-medium">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-escalate animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-escalate animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-escalate animate-pulse" style={{ animationDelay: '400ms' }} />
            </div>
            Decision pending — policies will diverge
          </div>
        )}
      </div>
    </div>
  );
}
