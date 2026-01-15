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
  Download,
  FileJson,
  FileSpreadsheet,
  TrendingUp,
  Grid3X3
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scenarios } from '@/lib/data/scenarios';
import { evaluateTransaction, getDefaultTransactionInput, getPostureDefaults, ExtendedPolicyConfig } from '@/lib/xbppEvaluator';
import { Posture, Category, ReasonCode } from '@/lib/types';
import { cn } from '@/lib/utils';

const VERDICT_COLORS = {
  ALLOW: '#4ade80',
  BLOCK: '#f87171', 
  ESCALATE: '#fbbf24',
};

const POSTURE_COLORS = {
  CAUTIOUS: '#4ade80',
  BALANCED: '#60a5fa',
  AGGRESSIVE: '#f97316',
};

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

// Map scenarios to transaction inputs for realistic testing based on xBPP context
function scenarioToTransactionInput(scenario: typeof scenarios[0]) {
  const base = getDefaultTransactionInput();
  const name = scenario.name?.toLowerCase() || '';
  const narrative = scenario.narrative?.toLowerCase() || '';
  const xbpp = scenario.xbpp_context;
  
  // Scenario-specific mappings for accurate simulation
  const scenarioMappings: Record<string, Partial<typeof base>> = {
    'scenario-new-vendor': { isNewCounterparty: true, amount: 6200, confidence: 0.6 },
    'scenario-slow-drain': { amount: 1800, dailySpent: 3510, actionsToday: 18 },
    'scenario-convincing-signature': { amount: 45000, confidence: 0.7, phishingSignature: false },
    'scenario-poisoned-address': { addressPoisoning: true, amount: 22000 },
    'scenario-phantom-approval': { amount: 180000, isVerified: true },
    'scenario-trusted-insider': { amount: 0, confidence: 0.95 },
    'scenario-urgent-override': { amount: 2400000, confidence: 0.94 },
    'scenario-copy-paste-error': { unverifiedContract: true, contractAgeHours: 3 },
    'scenario-silent-listener': { amount: 0, actionsThisMinute: 15 },
    'scenario-fragmented-attack': { recentActionsToSameAddress: 47, amount: 2000 },
    'scenario-honeypot-token': { honeypotToken: true, amount: 12000 },
    'scenario-gas-spike': { gasEstimate: 847, gasMaxWilling: 100 },
    'scenario-bridge-request': { isBridge: true, isCrossChain: true, amount: 50000 },
    'scenario-recursive-approval': { amount: 0, adminKeyDetected: true },
    'scenario-rate-limit-breach': { actionsThisMinute: 150, actionsThisHour: 2000 },
    'scenario-stale-oracle': { confidence: 0.4, amount: 25000 },
    'scenario-runaway-gpu': { amount: 12000, dailySpent: 8000 },
    'scenario-social-engineer': { drainerContract: true, confidence: 0.3, amount: 47500 },
    'scenario-coordination-bug': { isAgentToAgent: true, amount: 340 },
    'scenario-agent-hiring-agent': { isAgentToAgent: true, amount: 180 },
    'scenario-api-runaway': { actionsThisMinute: 100, dailySpent: 1200, amount: 500 },
    'scenario-recurring-surprise': { isRecurring: true, recurringVariance: 2.02, amount: 299 },
  };
  
  const specificMapping = scenarioMappings[scenario.id] || {};
  
  // Category-based defaults
  const categoryDefaults: Record<Category, Partial<typeof base>> = {
    SPEND: { amount: 500 },
    SIGN: { amount: 0 },
    DEFENSE: { drainerContract: name.includes('attack') || name.includes('honeypot') },
  };
  
  return {
    ...base,
    ...categoryDefaults[scenario.category],
    ...specificMapping,
  };
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

  const exportResults = (format: 'json' | 'csv') => {
    if (results.length === 0) return;
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const exportData = {
        exportedAt: new Date().toISOString(),
        postures: results.map(r => ({
          posture: r.posture,
          summary: {
            total: r.results.length,
            passed: r.passedCount,
            failed: r.failedCount,
            escalated: r.escalatedCount,
            runTimeMs: r.runTime,
          },
          results: r.results.map(result => ({
            scenario: result.scenarioName,
            category: result.category,
            verdict: result.verdict,
            expectedVerdict: result.expectedVerdict,
            passed: result.passed,
            reasonCodes: result.reasonCodes,
            explanation: result.explanation,
          })),
        })),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `xbpp-test-results-${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV export
      const rows: string[] = ['Posture,Scenario,Category,Verdict,Expected,Passed,Reason Codes'];
      
      results.forEach(suiteResult => {
        suiteResult.results.forEach(result => {
          rows.push([
            suiteResult.posture,
            `"${result.scenarioName}"`,
            result.category,
            result.verdict,
            result.expectedVerdict || '',
            result.passed ? 'Yes' : 'No',
            `"${result.reasonCodes.join(', ')}"`,
          ].join(','));
        });
      });
      
      const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `xbpp-test-results-${timestamp}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

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

            <div className="flex flex-wrap gap-3 mt-6">
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
              
              {results.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => exportResults('json')}
                    className="gap-2"
                  >
                    <FileJson className="h-4 w-4" />
                    Export JSON
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportResults('csv')}
                    className="gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Export CSV
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visual Charts Dashboard */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="verdicts">Verdict Analysis</TabsTrigger>
                <TabsTrigger value="postures">Posture Comparison</TabsTrigger>
                <TabsTrigger value="divergence" className="gap-1">
                  <Grid3X3 className="h-3.5 w-3.5" />
                  Divergence Heatmap
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Overall Pass Rate */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-1">
                          {Math.round(
                            (results.reduce((acc, r) => acc + r.passedCount, 0) /
                              results.reduce((acc, r) => acc + r.results.length, 0)) *
                              100
                          )}%
                        </div>
                        <p className="text-sm text-muted-foreground">Overall Pass Rate</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Tests */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-1">
                          {results.reduce((acc, r) => acc + r.results.length, 0)}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Tests Run</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {scenarios.length} scenarios × {results.length} posture{results.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Blocks / Escalates */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">
                            {results.reduce((acc, r) => acc + r.results.filter(x => x.verdict === 'BLOCK').length, 0)}
                          </div>
                          <p className="text-xs text-muted-foreground">Blocked</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-400">
                            {results.reduce((acc, r) => acc + r.results.filter(x => x.verdict === 'ESCALATE').length, 0)}
                          </div>
                          <p className="text-xs text-muted-foreground">Escalated</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Runtime */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-muted-foreground mb-1">
                          {results.reduce((acc, r) => acc + r.runTime, 0).toFixed(0)}
                          <span className="text-lg">ms</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Total Runtime</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="verdicts">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Verdict Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Verdict Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'ALLOW', value: results.reduce((acc, r) => acc + r.results.filter(x => x.verdict === 'ALLOW').length, 0) },
                              { name: 'BLOCK', value: results.reduce((acc, r) => acc + r.results.filter(x => x.verdict === 'BLOCK').length, 0) },
                              { name: 'ESCALATE', value: results.reduce((acc, r) => acc + r.results.filter(x => x.verdict === 'ESCALATE').length, 0) },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill={VERDICT_COLORS.ALLOW} />
                            <Cell fill={VERDICT_COLORS.BLOCK} />
                            <Cell fill={VERDICT_COLORS.ESCALATE} />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Verdicts by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={(['SPEND', 'SIGN', 'DEFENSE'] as Category[]).map(cat => ({
                            category: cat,
                            ALLOW: results.reduce((acc, r) => acc + r.results.filter(x => x.category === cat && x.verdict === 'ALLOW').length, 0),
                            BLOCK: results.reduce((acc, r) => acc + r.results.filter(x => x.category === cat && x.verdict === 'BLOCK').length, 0),
                            ESCALATE: results.reduce((acc, r) => acc + r.results.filter(x => x.category === cat && x.verdict === 'ESCALATE').length, 0),
                          }))}
                        >
                          <XAxis dataKey="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                          />
                          <Legend />
                          <Bar dataKey="ALLOW" stackId="a" fill={VERDICT_COLORS.ALLOW} />
                          <Bar dataKey="BLOCK" stackId="a" fill={VERDICT_COLORS.BLOCK} />
                          <Bar dataKey="ESCALATE" stackId="a" fill={VERDICT_COLORS.ESCALATE} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="postures">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Posture Pass Rates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pass Rate by Posture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={results.map(r => ({
                            posture: r.posture,
                            'Pass Rate': Math.round((r.passedCount / r.results.length) * 100),
                          }))}
                          layout="vertical"
                        >
                          <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis dataKey="posture" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                            formatter={(value) => [`${value}%`, 'Pass Rate']}
                          />
                          <Bar dataKey="Pass Rate" radius={[0, 4, 4, 0]}>
                            {results.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={POSTURE_COLORS[entry.posture]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Posture Verdict Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Verdict Breakdown by Posture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={results.map(r => ({
                            posture: r.posture,
                            ALLOW: r.results.filter(x => x.verdict === 'ALLOW').length,
                            BLOCK: r.results.filter(x => x.verdict === 'BLOCK').length,
                            ESCALATE: r.results.filter(x => x.verdict === 'ESCALATE').length,
                          }))}
                        >
                          <XAxis dataKey="posture" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                          />
                          <Legend />
                          <Bar dataKey="ALLOW" fill={VERDICT_COLORS.ALLOW} />
                          <Bar dataKey="BLOCK" fill={VERDICT_COLORS.BLOCK} />
                          <Bar dataKey="ESCALATE" fill={VERDICT_COLORS.ESCALATE} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="divergence">
                {results.length >= 2 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Grid3X3 className="h-5 w-5" />
                        Policy Divergence Heatmap
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Scenarios where different postures produce different verdicts are highlighted. 
                        Red cells indicate divergent outcomes.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="w-full">
                        <div className="min-w-[600px]">
                          {/* Header Row */}
                          <div className="grid gap-2 mb-3" style={{ 
                            gridTemplateColumns: `200px repeat(${results.length}, 1fr)` 
                          }}>
                            <div className="text-sm font-medium text-muted-foreground">Scenario</div>
                            {results.map(r => (
                              <div key={r.posture} className="text-sm font-medium text-center">
                                <Badge 
                                  variant="outline" 
                                  className="font-mono"
                                  style={{ borderColor: POSTURE_COLORS[r.posture], color: POSTURE_COLORS[r.posture] }}
                                >
                                  {r.posture}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          
                          {/* Scenario Rows */}
                          <div className="space-y-1">
                            {filteredScenarios.map(scenario => {
                              const scenarioResults = results.map(r => 
                                r.results.find(res => res.scenarioId === scenario.id)
                              );
                              
                              const verdicts = scenarioResults.map(r => r?.verdict).filter(Boolean);
                              const hasDivergence = new Set(verdicts).size > 1;
                              
                              return (
                                <div 
                                  key={scenario.id}
                                  className={cn(
                                    "grid gap-2 py-2 px-2 rounded-lg transition-colors",
                                    hasDivergence 
                                      ? "bg-red-500/10 border border-red-500/20" 
                                      : "hover:bg-muted/30"
                                  )}
                                  style={{ 
                                    gridTemplateColumns: `200px repeat(${results.length}, 1fr)` 
                                  }}
                                >
                                  <div className="flex items-center gap-2 text-sm truncate">
                                    {categoryIcons[scenario.category]}
                                    <span className={cn(
                                      "truncate",
                                      hasDivergence && "font-medium text-red-300"
                                    )}>
                                      {scenario.name}
                                    </span>
                                    {hasDivergence && (
                                      <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                                    )}
                                  </div>
                                  
                                  {scenarioResults.map((result, idx) => (
                                    <div key={idx} className="flex justify-center">
                                      {result ? (
                                        <Badge 
                                          className={cn(
                                            "font-mono text-xs",
                                            getVerdictBg(result.verdict)
                                          )}
                                        >
                                          <span className={getVerdictColor(result.verdict)}>
                                            {result.verdict}
                                          </span>
                                        </Badge>
                                      ) : (
                                        <span className="text-muted-foreground text-xs">—</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Summary */}
                          <div className="mt-6 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                                <span className="text-muted-foreground">Divergent scenarios:</span>
                                <span className="font-bold text-red-400">
                                  {filteredScenarios.filter(scenario => {
                                    const verdicts = results.map(r => 
                                      r.results.find(res => res.scenarioId === scenario.id)?.verdict
                                    ).filter(Boolean);
                                    return new Set(verdicts).size > 1;
                                  }).length}
                                </span>
                                <span className="text-muted-foreground">
                                  / {filteredScenarios.length}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded bg-green-500/30"></div>
                                  ALLOW
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded bg-red-500/30"></div>
                                  BLOCK
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded bg-amber-500/30"></div>
                                  ESCALATE
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center text-muted-foreground">
                        <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-medium">Select at least 2 postures</p>
                        <p className="text-sm mt-1">
                          The divergence heatmap requires multiple postures to compare.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

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
