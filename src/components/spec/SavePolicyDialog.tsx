import { useState } from 'react';
import { Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PolicyConfig } from '@/lib/types';

interface SavePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description?: string) => void;
  config: PolicyConfig;
  existingName?: string;
  existingDescription?: string;
  isEditing?: boolean;
}

export function SavePolicyDialog({
  open,
  onOpenChange,
  onSave,
  config,
  existingName = '',
  existingDescription = '',
  isEditing = false,
}: SavePolicyDialogProps) {
  const [name, setName] = useState(existingName);
  const [description, setDescription] = useState(existingDescription);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), description.trim() || undefined);
    setName('');
    setDescription('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName(existingName);
      setDescription(existingDescription);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Update Policy' : 'Save to Library'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the saved policy with your current configuration.'
              : 'Save your current policy configuration for later use.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="policy-name">Policy Name</Label>
            <Input
              id="policy-name"
              placeholder="e.g., Production Trading Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy-description">Description (optional)</Label>
            <Textarea
              id="policy-description"
              placeholder="What is this policy for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/30 resize-none"
              rows={2}
            />
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Configuration Preview
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Posture:</span>{' '}
                <span className="font-mono">{config.posture}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max Single:</span>{' '}
                <span className="font-mono">${config.maxSingle.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max Daily:</span>{' '}
                <span className="font-mono">${config.maxDaily.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Human Above:</span>{' '}
                <span className="font-mono">${config.requireHumanAbove.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
