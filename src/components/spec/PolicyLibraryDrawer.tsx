import { useState, useEffect } from 'react';
import { Library, FolderOpen } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedPolicy, PolicyConfig } from '@/lib/types';
import { getSavedPolicies, deletePolicy } from '@/lib/policyStorage';
import { SavedPolicyCard } from './SavedPolicyCard';

interface PolicyLibraryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadPolicy: (config: PolicyConfig) => void;
}

export function PolicyLibraryDrawer({ open, onOpenChange, onLoadPolicy }: PolicyLibraryDrawerProps) {
  const [policies, setPolicies] = useState<SavedPolicy[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<SavedPolicy | null>(null);

  useEffect(() => {
    if (open) {
      setPolicies(getSavedPolicies());
    }
  }, [open]);

  const handleLoad = (policy: SavedPolicy) => {
    onLoadPolicy(policy.config);
    onOpenChange(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deletePolicy(deleteTarget.id);
      setPolicies(getSavedPolicies());
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md bg-background border-border">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              Policy Library
            </SheetTitle>
            <SheetDescription>
              {policies.length > 0 
                ? `${policies.length} saved ${policies.length === 1 ? 'policy' : 'policies'}`
                : 'Your saved policies will appear here'
              }
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-140px)] mt-6 pr-4">
            {policies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">No saved policies yet</h4>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Configure a policy and click "Save" to add it to your library
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {policies.map((policy) => (
                  <SavedPolicyCard
                    key={policy.id}
                    policy={policy}
                    onLoad={() => handleLoad(policy)}
                    onDelete={() => setDeleteTarget(policy)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Policy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-block hover:bg-block/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
