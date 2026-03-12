import type { ProtectionPlan, ProtectionPlansState } from '../models';

// UI-only mock client. Replace implementations with real API calls when backend is available.

const mockNow = new Date();

const mockPlans: ProtectionPlan[] = [
  {
    id: 'plan-1',
    name: 'Production Release Freeze',
    description:
      'Protects the production namespace during a critical release window to avoid accidental changes.',
    lifecycle: 'scheduled',
    type: 'production-update',
    typeLabel: 'Production Update',
    builtInType: true,
    scope: {
      type: 'namespace',
      namespace: 'production',
      cluster: 'prod-cluster-1',
    },
    policies: [
      { key: 'preventWorkloadUpdates', enabled: true },
      { key: 'preventResourceDeletion', enabled: true },
      { key: 'configurationFreeze', enabled: true },
      { key: 'versionRestriction', enabled: false },
      { key: 'rollbackPrevention', enabled: false },
    ],
    schedule: {
      startAt: new Date(mockNow.getTime() + 60 * 60 * 1000).toISOString(),
      endAt: new Date(mockNow.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(mockNow.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'ops-lead@example.com',
    lastUpdatedAt: new Date(mockNow.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    lastUpdatedBy: 'ops-lead@example.com',
    participants: [
      { id: 'u-1', displayName: 'Alice (Contributor)', role: 'contributor' },
      { id: 'u-2', displayName: 'Bob (Reviewer)', role: 'reviewer' },
      { id: 'u-3', displayName: 'Carol (Approver)', role: 'approver' },
    ],
    history: [
      {
        id: 'h-1',
        timestamp: new Date(mockNow.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        type: 'created',
        actor: 'ops-lead@example.com',
        summary: 'Plan created as draft.',
      },
      {
        id: 'h-2',
        timestamp: new Date(mockNow.getTime() - 23 * 60 * 60 * 1000).toISOString(),
        type: 'scope_updated',
        actor: 'ops-lead@example.com',
        summary: 'Scope set to namespace "production" on prod-cluster-1.',
      },
      {
        id: 'h-3',
        timestamp: new Date(mockNow.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'scheduled',
        actor: 'ops-lead@example.com',
        summary: 'Plan scheduled for today 18:00–22:00 UTC.',
      },
    ],
  },
  {
    id: 'plan-2',
    name: 'Database Migration Guardrail',
    description:
      'Prevents workload and configuration changes on critical services during database migration.',
    lifecycle: 'active',
    type: 'migration',
    typeLabel: 'Migration',
    builtInType: true,
    scope: {
      type: 'workload',
      namespace: 'production',
      name: 'payments-api',
      kind: 'Deployment',
    },
    policies: [
      { key: 'preventWorkloadUpdates', enabled: true },
      { key: 'preventResourceDeletion', enabled: true },
      { key: 'configurationFreeze', enabled: true },
      { key: 'versionRestriction', enabled: true },
      { key: 'rollbackPrevention', enabled: true },
    ],
    schedule: {
      startAt: new Date(mockNow.getTime() - 30 * 60 * 1000).toISOString(),
      endAt: new Date(mockNow.getTime() + 90 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(mockNow.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'platform@example.com',
    lastUpdatedAt: new Date(mockNow.getTime() - 45 * 60 * 1000).toISOString(),
    lastUpdatedBy: 'platform@example.com',
    participants: [
      { id: 'u-4', displayName: 'DBA Team', role: 'contributor' },
      { id: 'u-5', displayName: 'Release Manager', role: 'approver' },
    ],
    history: [
      {
        id: 'h-4',
        timestamp: new Date(mockNow.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'created',
        actor: 'platform@example.com',
        summary: 'Plan created as draft.',
      },
      {
        id: 'h-5',
        timestamp: new Date(mockNow.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'policies_updated',
        actor: 'platform@example.com',
        summary: 'Enabled rollback prevention and version restriction.',
      },
      {
        id: 'h-6',
        timestamp: new Date(mockNow.getTime() - 30 * 60 * 1000).toISOString(),
        type: 'activated',
        actor: 'platform@example.com',
        summary: 'Plan activated at migration start.',
      },
    ],
  },
] as ProtectionPlan[];

export const initialProtectionPlansState: ProtectionPlansState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProtectionPlans = async (): Promise<ProtectionPlan[]> => {
  // Simulate a small delay to reflect async behavior.
  await new Promise((resolve) => {
    window.setTimeout(resolve, 300);
  });

  return mockPlans;
};
