import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw,
  Settings2,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  PenTool,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { scenarios } from '@/lib/data/scenarios';
import { evaluateTransaction, getDefaultTransactionInput, getPostureDefaults, ExtendedPolicyConfig } from '@/lib/xbppEvaluator';
import { Posture, Category, ReasonCode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TestResult {
  scenarioId: string;
  scenarioName: string;
  category: Category;
  verdict: 'ALLOW' | 'BLOCK' | 'ESCALATE';
  reasonCodes: ReasonCode[];
  explanation: string;
  passed: boolean;
  expectedVerdict?: 'ALLOW' | 'BLOCK' | 'ESCALATE';
}

interface TestSuiteResults {
  posture: Posture;
  results: TestResult[];
  passedCount: number;
  failedCount: number;
  escalatedCount: number;
  runTime: number;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  SPEND: <Zap className="h-4 w-4" />,
  SIGN: <PenTool className="h-4 w-4" />,
  DEFENSE: <Shield className="h-4 w-4" />,
};

// Map scenarios to transaction inputs for realistic testing
function scenarioToTransactionInput(scenario: typeof scenarios[0]) {
  const base = getDefaultTransactionInput();
  
  // Extract context from scenario
  const events = scenario.event_stream || [];
  const narrative = scenario.narrative?.toLowerCase() || '';
  const name = scenario.name?.toLowerCase() || '';
  
  const hasHighValue = name.includes('drain') || name.includes('override') || narrative.includes('large');
  const hasSecurityThreat = name.includes('attack') || name.includes('honeypot') || name.includes('malicious');
  const hasNewCounterparty = name.includes('new') || name.includes('vendor') || narrative.includes('unknown');
  
  // Adjust based on scenario category and narrative
  switch (scenario.category) {
    case 'SPEND':
      return {
        ...base,
        amount: hasHighValue ? 15000 : 500,
        dailySpent: hasHighValue ? 20000 : 1000,
        weeklySpent: hasHighValue ? 50000 : 5000,
        isNewCounterparty: hasNewCounterparty,
        confidence: hasNewCounterparty ? 0.5 : 0.9,
        drainerContract: hasSecurityThreat,
        gasEstimate: name.includes('gas') ? 800 : 50,
      };
    case 'SIGN':
      return {
        ...base,
        amount: 0,
        isNewCounterparty: true,
        isVerified: !hasSecurityThreat,
        confidence: hasSecurityThreat ? 0.3 : 0.8,
        phishingSignature: hasSecurityThreat,
      };
    case 'DEFENSE':
      return {
        ...base,
        drainerContract: hasSecurityThreat,
        addressPoisoning: name.includes('poison'),
        honeypotToken: name.includes('honeypot'),
      };
    default:
      return base;
  }
}

// Determine expected verdict based on scenario nature
function getExpectedVerdict(scenario: typeof scenarios[0], posture: Posture): 'ALLOW' | 'BLOCK' | 'ESCALATE' {
  const name = scenario.name?.toLowerCase() || '';
  
  const isDangerous = 
    name.includes('honeypot') ||
    name.includes('attack') ||
    name.includes('malicious') ||
    name.includes('scam') ||
    name.includes('social engineer');
  
  const isHighRisk = 
    name.includes('runaway') ||
    name.includes('surprise') ||
    name.includes('coordination');
  
  if (isDangerous) {
    return 'BLOCK';
  }
  
  if (isHighRisk) {
    return posture === 'AGGRESSIVE' ? 'ALLOW' : 'ESCALATE';
  }
  
  // Normal scenarios
  if (posture === 'CAUTIOUS') {
    return 'ESCALATE';
  }
  
  return 'ALLOW';
}

export default function TestSuite() {
  const [selectedPostures, setSelectedPostures] = useState<Posture[]>(['BALANCED']);
  const [results, setResults] = useState<TestSuiteResults[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<Category | 'ALL'>('ALL');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'ALLOW' | 'BLOCK' | 'ESCALATE'>('ALL');

  const filteredScenarios = useMemo(() => {
    return scenarios.filter(s => categoryFilter === 'ALL' || s.category === categoryFilter);
  }, [categoryFilter]);

  const runTestSuite = async () => {
    setIsRunning(true);
    setResults([]);
    
    const newResults: TestSuiteResults[] = [];
    
    for (const posture of selectedPostures) {
      const startTime = performance.now();
      const postureResults: TestResult[] = [];
      
      // Build full config with posture-specific limits
      const postureDefaults = getPostureDefaults(posture);
      const limits = posture === 'CAUTIOUS' 
        ? { maxSingle: 1000, maxDaily: 5000, maxWeekly: 20000, requireHumanAbove: 500 }
        : posture === 'BALANCED'
        ? { maxSingle: 5000, maxDaily: 25000, maxWeekly: 100000, requireHumanAbove: 2500 }
        : { maxSingle: 25000, maxDaily: 100000, maxWeekly: 500000, requireHumanAbove: 10000 };
      
      const config: ExtendedPolicyConfig = {
        posture,
        ...limits,
        newCounterpartyAction: posture === 'CAUTIOUS' ? 'BLOCK' : posture === 'BALANCED' ? 'ESCALATE' : 'ALLOW',
        requireVerified: posture !== 'AGGRESSIVE',
        burstDetection: posture !== 'AGGRESSIVE',
        minConfidence: postureDefaults.minConfidence,
        logLevel: 'STANDARD',
        ...postureDefaults,
      };
      
      for (const scenario of filteredScenarios) {
        const input = scenarioToTransactionInput(scenario);
        const result = evaluateTransaction(input, config);
        const expectedVerdict = getExpectedVerdict(scenario, posture);
        
        postureResults.push({
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          category: scenario.category,
          verdict: result.verdict,
          reasonCodes: result.reasonCodes,
          explanation: result.explanation,
          passed: result.verdict === expectedVerdict || 
                  (expectedVerdict === 'ESCALATE' && result.verdict === 'BLOCK'),
          expectedVerdict,
        });
        
        // Small delay for visual effect
        await new Promise(r => setTimeout(r, 50));
      }
      
      const endTime = performance.now();
      
      newResults.push({
        posture,
        results: postureResults,
        passedCount: postureResults.filter(r => r.passed).length,
        failedCount: postureResults.filter(r => !r.passed).length,
        escalatedCount: postureResults.filter(r => r.verdict === 'ESCALATE').length,
        runTime: endTime - startTime,
      });
      
      setResults([...newResults]);
    }
    
    setIsRunning(false);
  };

  const togglePosture = (posture: Posture) => {
    setSelectedPostures(prev => 
      prev.includes(posture) 
        ? prev.filter(p => p !== posture)
        : [...prev, posture]
    );
  };

  const toggleExpanded = (key: string) => {
    setExpandedResults(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getVerdictColor = (verdict: 'ALLOW' | 'BLOCK' | 'ESCALATE') => {
    switch (verdict) {
      case 'ALLOW': return 'text-green-400';
      case 'BLOCK': return 'text-red-400';
      case 'ESCALATE': return 'text-amber-400';
    }
  };

  const getVerdictBg = (verdict: 'ALLOW' | 'BLOCK' | 'ESCALATE') => {
    switch (verdict) {
      case 'ALLOW': return 'bg-green-500/10 border-green-500/30';
      case 'BLOCK': return 'bg-red-500/10 border-red-500/30';
      case 'ESCALATE': return 'bg-amber-500/10 border-amber-500/30';
    }
  };

  const filteredResults = useMemo(() => {
    return results.map(suiteResult => ({
      ...suiteResult,
      results: suiteResult.results.filter(r => 
        verdictFilter === 'ALL' || r.verdict === verdictFilter
      ),
    }));
  }, [results, verdictFilter]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">xBPP Test Suite</h1>
          <p className="text-muted-foreground">
            Run all scenarios against selected policy postures to validate behavior
          </p>
        </motion.div>

        {/* Configuration Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings2 className="h-5 w-5" />
              Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Posture Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Policy Postures</label>
                <div className="space-y-2">
                  {(['CAUTIOUS', 'BALANCED', 'AGGRESSIVE'] as Posture[]).map(posture => (
                    <div key={posture} className="flex items-center gap-2">
                      <Checkbox 
                        id={posture}
                        checked={selectedPostures.includes(posture)}
                        onCheckedChange={() => togglePosture(posture)}
                      />
                      <label htmlFor={posture} className="text-sm cursor-pointer">
                        {posture}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block">Category Filter</label>
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as Category | 'ALL')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="SPEND">SPEND</SelectItem>
                    <SelectItem value="SIGN">SIGN</SelectItem>
                    <SelectItem value="DEFENSE">DEFENSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Verdict Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block">Verdict Filter</label>
                <Select value={verdictFilter} onValueChange={(v) => setVerdictFilter(v as typeof verdictFilter)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Verdicts</SelectItem>
                    <SelectItem value="ALLOW">ALLOW Only</SelectItem>
                    <SelectItem value="BLOCK">BLOCK Only</SelectItem>
                    <SelectItem value="ESCALATE">ESCALATE Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={runTestSuite} 
                disabled={isRunning || selectedPostures.length === 0}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Test Suite
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setResults([])}
                disabled={isRunning || results.length === 0}
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredResults.length > 0 && (
          <div className="space-y-6">
            {filteredResults.map((suiteResult, idx) => (
              <motion.div
                key={suiteResult.posture}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <Badge variant="outline" className="text-sm">
                          {suiteResult.posture}
                        </Badge>
                        <span className="text-muted-foreground text-sm font-normal">
                          {suiteResult.runTime.toFixed(0)}ms
                        </span>
                      </CardTitle>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span>{suiteResult.passedCount} passed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-400" />
                          <span>{suiteResult.failedCount} failed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                          <span>{suiteResult.escalatedCount} escalated</span>
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(suiteResult.passedCount / suiteResult.results.length) * 100} 
                      className="h-2 mt-4"
                    />
                  </CardHeader>
                  
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {suiteResult.results.map((result) => {
                          const key = `${suiteResult.posture}-${result.scenarioId}`;
                          const isExpanded = expandedResults.has(key);
                          
                          return (
                            <Collapsible key={key} open={isExpanded} onOpenChange={() => toggleExpanded(key)}>
                              <CollapsibleTrigger asChild>
                                <div className={cn(
                                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                                  "hover:bg-muted/50",
                                  result.passed ? "border-border/50" : "border-red-500/30 bg-red-500/5"
                                )}>
                                  <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    
                                    <div className="flex items-center gap-2">
                                      {categoryIcons[result.category]}
                                      <span className="font-medium">{result.scenarioName}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <Badge className={cn("font-mono", getVerdictBg(result.verdict))}>
                                      <span className={getVerdictColor(result.verdict)}>
                                        {result.verdict}
                                      </span>
                                    </Badge>
                                    
                                    {result.passed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-red-400" />
                                    )}
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <div className="pl-10 pr-4 py-3 space-y-3">
                                  {/* Reason Codes */}
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-2">Reason Codes:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {result.reasonCodes.map((code, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs font-mono">
                                          {code}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Explanation */}
                                  {result.explanation && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-2">Explanation:</p>
                                      <p className="text-sm text-muted-foreground">{result.explanation}</p>
                                    </div>
                                  )}
                                  
                                  {/* Expected vs Actual */}
                                  {!result.passed && result.expectedVerdict && (
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Expected: </span>
                                      <span className={getVerdictColor(result.expectedVerdict)}>
                                        {result.expectedVerdict}
                                      </span>
                                      <span className="text-muted-foreground"> → Got: </span>
                                      <span className={getVerdictColor(result.verdict)}>
                                        {result.verdict}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !isRunning && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No test results yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Select policy postures and click "Run Test Suite" to evaluate all {filteredScenarios.length} scenarios
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
