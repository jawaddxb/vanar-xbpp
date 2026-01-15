import { Trash2, Upload, Zap, Shield, AlertTriangle, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SavedPolicy, Posture } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SavedPolicyCardProps {
  policy: SavedPolicy;
  onLoad: () => void;
  onDelete: () => void;
  isCompareMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const getPostureConfig = (posture: Posture) => {
  switch (posture) {
    case 'AGGRESSIVE':
      return { icon: Zap, color: 'text-escalate', bg: 'bg-escalate/10', label: 'Aggressive' };
    case 'BALANCED':
      return { icon: Shield, color: 'text-primary', bg: 'bg-primary/10', label: 'Balanced' };
    case 'CAUTIOUS':
      return { icon: AlertTriangle, color: 'text-allow', bg: 'bg-allow/10', label: 'Cautious' };
  }
};

export function SavedPolicyCard({ 
  policy, 
  onLoad, 
  onDelete, 
  isCompareMode = false,
  isSelected = false,
  onToggleSelect 
}: SavedPolicyCardProps) {
  const postureConfig = getPostureConfig(policy.config.posture);
  const PostureIcon = postureConfig.icon;
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={cn(
      "group p-4 rounded-lg bg-muted/30 border transition-all",
      isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
    )}>
      <div className="flex items-start justify-between gap-3">
        {isCompareMode && (
          <div className="pt-1">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate">{policy.name}</h4>
            <span className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono",
              postureConfig.bg, postureConfig.color
            )}>
              <PostureIcon className="h-3 w-3" />
              {postureConfig.label}
            </span>
          </div>
          
          {policy.description && (
            <p className="text-sm text-muted-foreground truncate mb-2">
              {policy.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="font-mono">Max: ${policy.config.maxSingle.toLocaleString()}</span>
            <span>•</span>
            <span className="font-mono">Daily: ${policy.config.maxDaily.toLocaleString()}</span>
            <span>•</span>
            <span>{formatDate(policy.updatedAt)}</span>
          </div>
        </div>
        
        {!isCompareMode && (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoad}
              className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Upload className="h-4 w-4 mr-1" />
              Load
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 px-2 text-muted-foreground hover:text-block hover:bg-block/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
