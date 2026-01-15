import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Copy, Play, Check, Filter,
  Rocket, Users, Building2, Zap, Shield, Plane, Package, Coins, Scale, CircleDollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  policyTemplates, 
  postureColors, 
  riskProfileInfo,
  searchPolicyTemplates 
} from '@/lib/data/policyBank';
import { PolicyTemplate, Posture } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket, Users, Building2, Zap, Shield, Plane, Package, Coins, Scale, CircleDollarSign
};

function PolicyCard({ template, onSelect }: { template: PolicyTemplate; onSelect: () => void }) {
  const [copied, setCopied] = useState(false);
  const Icon = iconMap[template.icon] || Rocket;
  const colors = postureColors[template.posture];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(template.policy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-card/50 border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border}`}>
          {template.posture}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{template.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Max single:</span>
          <span className="font-mono text-foreground">${template.policy.limits.max_single.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Daily limit:</span>
          <span className="font-mono text-foreground">${template.policy.limits.max_daily.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Human above:</span>
          <span className="font-mono text-foreground">${template.policy.limits.require_human_above.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {template.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onSelect}>
          View Details
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/scenarios">
            <Play className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

function PolicyDetailModal({ template, open, onClose }: { template: PolicyTemplate | null; open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  if (!template) return null;

  const colors = postureColors[template.posture];
  const Icon = iconMap[template.icon] || Rocket;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(template.policy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              <Icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div>
              <DialogTitle className="text-xl">{template.name}</DialogTitle>
              <Badge variant="outline" className={`mt-1 ${colors.bg} ${colors.text} ${colors.border}`}>
                {template.posture} Posture
              </Badge>
            </div>
          </div>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Use Case</h4>
            <p className="text-foreground">{template.use_case}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Policy JSON</h4>
            <div className="relative">
              <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                {JSON.stringify(template.policy, null, 2)}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {template.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <Link to="/scenarios">Try in Simulator</Link>
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Policy'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PolicyBank() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    let result = policyTemplates;
    if (search) {
      result = searchPolicyTemplates(search);
    }
    if (riskFilter) {
      result = result.filter(p => p.risk_profile === riskFilter);
    }
    return result;
  }, [search, riskFilter]);

  const riskFilters = ['conservative', 'balanced', 'aggressive'] as const;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Policy Bank
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pre-built xBPP policy templates for common use cases. Start with a template and customize to your needs.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search policies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={riskFilter === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter(null)}
            >
              All
            </Button>
            {riskFilters.map(risk => (
              <Button
                key={risk}
                variant={riskFilter === risk ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRiskFilter(risk)}
              >
                {riskProfileInfo[risk].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, i) => (
            <PolicyCard
              key={template.id}
              template={template}
              onSelect={() => setSelectedTemplate(template)}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No policies match your search.</p>
          </div>
        )}

        {/* Detail Modal */}
        <PolicyDetailModal
          template={selectedTemplate}
          open={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      </div>
    </div>
  );
}
