export interface ScopeOption {
  value: string;
  label: string;
  namespace?: string;
}

interface UseScopeOptionsResult {
  namespaceOptions: ScopeOption[];
  workloadOptions: ScopeOption[];
  resourceOptions: ScopeOption[];
  excludedOptions: ScopeOption[];
  loading: boolean;
}

export const useScopeOptions = (): UseScopeOptionsResult => {
  return {
    namespaceOptions: [],
    workloadOptions: [],
    resourceOptions: [],
    excludedOptions: [],
    loading: false,
  };
};
