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

export type ProtectionPlanLevel = 'low' | 'medium' | 'high';

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
    MESSAGES: {
      EMPTY_LIST_DESCRIPTION:
        'Try adjusting your search or create a new Protection Plan to guard critical workloads.',
      ERROR_TITLE: 'Failed to load Protection Plans.',
    },
    COLUMNS: {
      NAME: 'Plan Name',
      TYPE: 'Type',
      SCOPE: 'Scope',
      POLICIES: 'Enforced Policies',
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
    PROTECTION_LEVELS: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    } as Record<ProtectionPlanLevel, string>,
    CARD: {
      PROTECTED_SCOPE: 'Protected Scope',
      ENFORCED_POLICIES: 'Enforced Policies',
      PROTECTION_TYPE: 'Protection Type',
      PROTECTION_LEVEL: 'Protection Level',
      OWNER: 'Owner',
      PARTICIPANTS: 'Participants',
      DURATION_PREFIX: 'Duration',
    },
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
  CREATE_PAGE: {
    GAP_BETWEEN_CARDS: 20,
    CARD_BORDER_RADIUS: 8,
    CARD_PADDING: 20,
    SECTIONS: {
      BASIC_INFO_TITLE: 'Basic information',
      BASIC_INFO_DESCRIPTION: 'Name and describe the protection plan.',
      SCOPE_TITLE: 'Scope',
      SCOPE_DESCRIPTION:
        'Choose what to protect: full namespaces, namespaces with exclusions, or only selected resources.',
      SCHEDULE_TITLE: 'Schedule',
      SCHEDULE_DESCRIPTION: 'Set the start and end time for the protection window.',
      POLICIES_TITLE: 'Enforced policies',
      POLICIES_DESCRIPTION: 'Choose which safeguards to apply during the window.',
      PLACEHOLDER_BASIC: 'Plan name and description fields will go here.',
      PLACEHOLDER_SCOPE: 'Namespace or workload scope selector will go here.',
      PLACEHOLDER_SCHEDULE: 'Start and end date/time pickers will go here.',
      PLACEHOLDER_POLICIES: 'Policy toggles will go here.',
    },
    FORM: {
      NAME_LABEL: 'Plan name',
      NAME_PLACEHOLDER: 'e.g. Production release freeze',
      DESCRIPTION_LABEL: 'Description',
      DESCRIPTION_PLACEHOLDER: 'Optional short description of the plan',
      SCOPE_TYPE_LABEL: 'What do you want to protect?',
      SCOPE_TYPE_PLACEHOLDER: 'Select protection scope',
      SCOPE_TYPE_FULL_NAMESPACE: 'Full namespace(s)',
      SCOPE_TYPE_FULL_NAMESPACE_HINT: 'All resources in the selected namespaces are protected.',
      SCOPE_TYPE_NAMESPACE_WITH_EXCLUSIONS: 'Namespace(s) with exclusions',
      SCOPE_TYPE_NAMESPACE_WITH_EXCLUSIONS_HINT:
        'Protect the selected namespaces but exclude specific resources from protection.',
      SCOPE_TYPE_SELECTED_RESOURCES: 'Selected resources only',
      SCOPE_TYPE_SELECTED_RESOURCES_HINT: 'Only the resources you select will be protected.',
      NAMESPACE_LABEL: 'Namespaces',
      NAMESPACE_PLACEHOLDER: 'Select namespace(s)',
      EXCLUDED_RESOURCES_LABEL: 'Excluded resources',
      EXCLUDED_RESOURCES_PLACEHOLDER: 'Select resources to exclude from protection',
      INCLUDED_RESOURCES_LABEL: 'Resources to protect',
      INCLUDED_RESOURCES_PLACEHOLDER: 'Select resources to protect',
      START_AT_LABEL: 'Start',
      END_AT_LABEL: 'End',
      START_AT_PLACEHOLDER: 'Select start date and time',
      END_AT_PLACEHOLDER: 'Select end date and time',
    },
    NAMESPACE_OPTIONS: [] as Array<{ value: string; label: string }>,
    RESOURCE_NAME_OPTIONS: [] as Array<{ value: string; label: string }>,
  },
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

export const PROTECTION_PLAN_LIFECYCLE_COLORS: Record<
  ProtectionPlanLifecycle,
  { background: string; color: string }
> = {
  draft: { background: '#e5e7eb', color: '#4b5563' },
  scheduled: { background: '#dbeafe', color: '#1d4ed8' },
  active: { background: '#dcfce7', color: '#166534' },
  completed: { background: '#e5e7eb', color: '#4b5563' },
  cancelled: { background: '#fee2e2', color: '#b91c1c' },
};

export const PROTECTION_PLAN_POLICY_SHORT_LABELS: Record<ProtectionPlanPolicyKey, string> = {
  preventWorkloadUpdates: 'Update Block',
  preventResourceDeletion: 'Delete Block',
  configurationFreeze: 'Config Freeze',
  versionRestriction: 'Version Restriction',
  rollbackPrevention: 'Rollback Prevention',
};
