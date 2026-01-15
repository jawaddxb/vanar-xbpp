import { create } from 'zustand';
import { Scenario, Policy, Run, Diff, XBPPPolicy } from './types';
import { getScenarioById } from './data/scenarios';
import { permissivePolicy, restrictivePolicy } from './data/policies';
import { getRunsForScenario, getDiffForScenario } from './data/runs';

interface BPPLabState {
  // Selected scenario
  selectedScenario: Scenario | null;
  setSelectedScenario: (scenarioId: string) => void;
  
  // Policies (always permissive vs restrictive for v0)
  policyA: Policy;
  policyB: Policy;
  
  // Custom policy from builder
  customPolicy: Policy | null;
  setCustomPolicy: (xbpp: XBPPPolicy) => void;
  clearCustomPolicy: () => void;
  useCustomPolicy: boolean;
  setUseCustomPolicy: (use: boolean) => void;
  
  // Runs
  runA: Run | null;
  runB: Run | null;
  
  // Diff
  diff: Diff | null;
  
  // UI state
  currentEventIndex: number;
  setCurrentEventIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  showDivergence: boolean;
  setShowDivergence: (show: boolean) => void;
  
  // Computed
  loadScenarioData: (scenarioId: string) => void;
  reset: () => void;
}

// Generate a short hash for custom policies
function generateHash(): string {
  return 'xbpp-cust-' + Math.random().toString(36).substring(2, 6);
}

export const useBPPLabStore = create<BPPLabState>((set, get) => ({
  selectedScenario: null,
  policyA: permissivePolicy,
  policyB: restrictivePolicy,
  customPolicy: null,
  useCustomPolicy: false,
  runA: null,
  runB: null,
  diff: null,
  currentEventIndex: 0,
  isPlaying: false,
  showDivergence: false,
  
  setSelectedScenario: (scenarioId: string) => {
    const scenario = getScenarioById(scenarioId);
    if (scenario) {
      set({ selectedScenario: scenario });
    }
  },
  
  setCustomPolicy: (xbpp: XBPPPolicy) => {
    const customPolicy: Policy = {
      id: 'policy-custom',
      name: 'Your Custom Policy',
      type: 'xBPP',
      version: '1.0.0',
      description: `Custom ${xbpp.posture} policy created in the Policy Builder`,
      posture_summary: xbpp.posture === 'AGGRESSIVE' 
        ? 'Trust efficiency. Escalate only when necessary.'
        : xbpp.posture === 'CAUTIOUS'
        ? 'Verify everything. Ask when uncertain.'
        : 'Balance autonomy and safety.',
      constraints: [],
      raw_json: xbpp,
      xbpp: xbpp,
      hash: generateHash(),
    };
    set({ customPolicy, useCustomPolicy: true });
  },
  
  clearCustomPolicy: () => set({ customPolicy: null, useCustomPolicy: false }),
  
  setUseCustomPolicy: (use: boolean) => set({ useCustomPolicy: use }),
  
  setCurrentEventIndex: (index: number) => set({ currentEventIndex: index }),
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setShowDivergence: (show: boolean) => set({ showDivergence: show }),
  
  loadScenarioData: (scenarioId: string) => {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return;
    
    const { permissive, restrictive } = getRunsForScenario(scenarioId);
    const diff = getDiffForScenario(scenarioId);
    
    // If using custom policy, swap it in as policyA
    const { customPolicy, useCustomPolicy } = get();
    
    set({
      selectedScenario: scenario,
      policyA: useCustomPolicy && customPolicy ? customPolicy : permissivePolicy,
      runA: permissive,
      runB: restrictive,
      diff,
      currentEventIndex: 0,
      isPlaying: false,
      showDivergence: false,
    });
  },
  
  reset: () => set({
    selectedScenario: null,
    runA: null,
    runB: null,
    diff: null,
    currentEventIndex: 0,
    isPlaying: false,
    showDivergence: false,
  }),
}));
