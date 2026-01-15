import { useState, useEffect, useRef } from 'react';
import { Library, FolderOpen, Download, Upload, GitCompare, X, FileUp } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { SavedPolicy, PolicyConfig } from '@/lib/types';
import { getSavedPolicies, deletePolicy, exportPolicies, importPolicies, savePolicy } from '@/lib/policyStorage';
import { SavedPolicyCard } from './SavedPolicyCard';
import { PolicyCompareView } from './PolicyCompareView';
import { useToast } from '@/hooks/use-toast';

interface PolicyLibraryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadPolicy: (config: PolicyConfig) => void;
}

export function PolicyLibraryDrawer({ open, onOpenChange, onLoadPolicy }: PolicyLibraryDrawerProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [policies, setPolicies] = useState<SavedPolicy[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<SavedPolicy | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (open) {
      setPolicies(getSavedPolicies());
      setIsCompareMode(false);
      setSelectedForCompare(new Set());
      setShowComparison(false);
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

  const handleDuplicate = (policy: SavedPolicy) => {
    const duplicated: SavedPolicy = {
      id: `pol_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`,
      name: `${policy.name} (Copy)`,
      description: policy.description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      config: { ...policy.config },
    };
    savePolicy(duplicated);
    setPolicies(getSavedPolicies());
    toast({
      title: 'Policy duplicated',
      description: `Created "${duplicated.name}"`,
    });
  };

  const handleToggleSelect = (policyId: string) => {
    const newSelected = new Set(selectedForCompare);
    if (newSelected.has(policyId)) {
      newSelected.delete(policyId);
    } else if (newSelected.size < 2) {
      newSelected.add(policyId);
    }
    setSelectedForCompare(newSelected);
  };

  const handleCompare = () => {
    if (selectedForCompare.size === 2) {
      setShowComparison(true);
    }
  };

  const handleExport = () => {
    const json = exportPolicies();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bpplab-policies-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Policies exported',
      description: `${policies.length} policies saved to file`,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = importPolicies(event.target?.result as string);
        setPolicies(getSavedPolicies());
        toast({
          title: 'Policies imported',
          description: `${result.imported} imported, ${result.skipped} skipped`,
        });
      } catch (error) {
        toast({
          title: 'Import failed',
          description: 'Invalid policy file format',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  const selectedPolicies = policies.filter(p => selectedForCompare.has(p.id));

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg bg-background border-border">
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

          {/* Actions Bar */}
          {policies.length > 0 && !showComparison && (
            <div className="flex items-center gap-2 mt-4 pb-4 border-b border-border">
              <Button
                variant={isCompareMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setIsCompareMode(!isCompareMode);
                  setSelectedForCompare(new Set());
                }}
              >
                {isCompareMode ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <GitCompare className="h-4 w-4 mr-1" />
                    Compare
                  </>
                )}
              </Button>
              
              {isCompareMode && selectedForCompare.size === 2 && (
                <Button size="sm" onClick={handleCompare}>
                  Compare Selected
                </Button>
              )}

              {!isCompareMode && (
                <>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleImportClick}>
                    <FileUp className="h-4 w-4 mr-1" />
                    Import
                  </Button>
                </>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {isCompareMode && !showComparison && (
            <p className="text-sm text-muted-foreground mt-4">
              Select 2 policies to compare ({selectedForCompare.size}/2 selected)
            </p>
          )}

          <ScrollArea className="h-[calc(100vh-200px)] mt-4 pr-4">
            {showComparison && selectedPolicies.length === 2 ? (
              <PolicyCompareView
                policyA={selectedPolicies[0]}
                policyB={selectedPolicies[1]}
                onClose={() => {
                  setShowComparison(false);
                  setSelectedForCompare(new Set());
                  setIsCompareMode(false);
                }}
              />
            ) : policies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">No saved policies yet</h4>
                <p className="text-sm text-muted-foreground max-w-[200px] mb-4">
                  Configure a policy and click "Save" to add it to your library
                </p>
                <Button variant="outline" size="sm" onClick={handleImportClick}>
                  <FileUp className="h-4 w-4 mr-1" />
                  Import Policies
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {policies.map((policy) => (
                  <SavedPolicyCard
                    key={policy.id}
                    policy={policy}
                    onLoad={() => handleLoad(policy)}
                    onDelete={() => setDeleteTarget(policy)}
                    onDuplicate={() => handleDuplicate(policy)}
                    isCompareMode={isCompareMode}
                    isSelected={selectedForCompare.has(policy.id)}
                    onToggleSelect={() => handleToggleSelect(policy.id)}
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
