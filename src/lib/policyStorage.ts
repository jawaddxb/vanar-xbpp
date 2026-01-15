import { SavedPolicy, PolicyConfig } from './types';

const STORAGE_KEY = 'policylab-saved-policies';

export function generatePolicyId(): string {
  return `pol_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
}

export function getSavedPolicies(): SavedPolicy[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    console.warn('Failed to load saved policies, resetting storage');
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function savePolicy(policy: SavedPolicy): void {
  try {
    const existing = getSavedPolicies();
    const index = existing.findIndex(p => p.id === policy.id);
    
    if (index >= 0) {
      existing[index] = policy;
    } else {
      existing.unshift(policy);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('Storage is full. Please delete some saved policies.');
    }
    throw e;
  }
}

export function deletePolicy(id: string): void {
  const existing = getSavedPolicies();
  const filtered = existing.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getPolicyById(id: string): SavedPolicy | null {
  const policies = getSavedPolicies();
  return policies.find(p => p.id === id) || null;
}
