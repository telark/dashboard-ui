import type { ProtectionPlanLifecycle, ProtectionPlanPolicyKey } from '../models';

export const PROTECTION_PLANS_LIFECYCLES: ProtectionPlanLifecycle[] = [
  'draft',
  'scheduled',
  'active',
  'completed',
  'cancelled',
];

export const PROTECTION_PLANS_POLICY_KEYS: ProtectionPlanPolicyKey[] = [
  'preventWorkloadUpdates',
  'preventResourceDeletion',
  'configurationFreeze',
  'versionRestriction',
  'rollbackPrevention',
];

export const PROTECTION_PLANS_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Protection Plans',
    HEADER_SUBTITLE:
      'Define temporary protection windows to safeguard critical Kubernetes workloads.',
    VIEW_SUBTITLE: 'View Protection Plan details',
    EDIT_SUBTITLE: 'Edit Protection Plan',
    CREATE_SUBTITLE: 'Create a new Protection Plan',
    NOT_FOUND: 'Protection Plan not found',
    CREATE_BUTTON: 'Create Plan',
    UPDATE_BUTTON: 'Update Plan',
    CREATE_BUTTON_TEXT: 'Create Plan',
    BREADCRUMBS: {
      ROOT: 'Protection Plans',
      EDIT: 'Edit',
      CREATE: 'Create Plan',
    },
    EMPTY: {
      TITLE: 'No protection plans yet',
      DESCRIPTION:
        'Create a plan to protect namespaces or workloads during maintenance windows and critical operations.',
      BUTTON: 'Create Protection Plan',
    },
    COLUMNS: {
      NAME: 'Plan Name',
      TYPE: 'Type',
      SCOPE: 'Scope',
      POLICIES: 'Policies',
      LIFECYCLE: 'Lifecycle',
      WINDOW: 'Time Window',
      CREATED: 'Created',
      CREATED_BY: 'Created By',
      LAST_UPDATE: 'Last Update',
      PARTICIPANTS: 'Participants',
    },
    ACTIONS: {
      VIEW: 'View',
      EDIT: 'Edit',
      DELETE: 'Delete',
    },
    PAGINATION: {
      SHOW_ROWS: 'Show rows',
    },
    LIFECYCLE_LABELS: {
      draft: 'Draft',
      scheduled: 'Scheduled',
      active: 'Active',
      completed: 'Completed',
      cancelled: 'Cancelled',
    } as Record<ProtectionPlanLifecycle, string>,
    POLICY_LABELS: {
      preventWorkloadUpdates: 'Prevent workload updates',
      preventResourceDeletion: 'Prevent resource deletion',
      configurationFreeze: 'Configuration freeze',
      versionRestriction: 'Version restriction',
      rollbackPrevention: 'Rollback prevention',
    } as Record<ProtectionPlanPolicyKey, string>,
  },
  KEYS: {
    NAME: 'name',
    TYPE: 'type',
    SCOPE: 'scope',
    POLICIES: 'policies',
    LIFECYCLE: 'lifecycle',
    WINDOW: 'window',
    CREATED: 'createdAt',
    CREATED_BY: 'createdBy',
    LAST_UPDATE: 'lastUpdatedAt',
    PARTICIPANTS: 'participants',
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    ROW_HEIGHT: 32,
    HEADER_ICON: 14,
    COLUMNS: {
      NAME: 160,
      TYPE: 100,
      SCOPE: 140,
      POLICIES: 180,
      LIFECYCLE: 110,
      WINDOW: 190,
      CREATED: 120,
      CREATED_BY: 120,
      LAST_UPDATE: 120,
      PARTICIPANTS: 140,
    },
  },
} as const;
