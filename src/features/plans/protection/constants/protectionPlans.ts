import type { PlanPhase } from '../models';

export const PROTECTION_PLANS_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Protection Plans',
    HEADER_SUBTITLE:
      'Define temporary protection windows to safeguard critical Kubernetes workloads.',
    CREATE_SUBTITLE: 'Create a new Protection Plan',
    NOT_FOUND: 'Protection Plan not found',
    CREATE_BUTTON: 'Create Plan',
    CREATE_BUTTON_TEXT: 'Create Plan',
    BREADCRUMBS: {
      ROOT: 'Protection Plans',
      CREATE: 'Create Plan',
    },
    EMPTY: {
      TITLE: 'No protection plans yet',
      DESCRIPTION:
        'Create a plan to protect namespaces or applications during maintenance windows and critical operations.',
      BUTTON: 'Create Protection Plan',
    },
    MESSAGES: {
      ERROR_TITLE: 'Failed to load Protection Plans.',
    },
    ACTIONS: {
      CANCEL: 'Cancel plan',
      DELETE: 'Delete plan',
      DELETE_MODAL_TITLE: 'Delete Protection Plan',
      DELETE_MODAL_OK: 'Delete',
    },
    PHASE_LABELS: {
      active: 'Active',
      scheduled: 'Scheduled',
      failed: 'Failed',
      terminated: 'Terminated',
      cancelled: 'Cancelled',
      draft: 'Draft',
    } as Record<PlanPhase, string>,
    SEVERITY_LABEL: 'Severity',
    MODE_ENFORCEMENT_LABEL: 'Policy Enforcement Mode',
  },
  CREATE_PAGE: {
    GAP_BETWEEN_CARDS: 20,
    SECTIONS: {
      BASIC_INFO_TITLE: 'Basic information',
      BASIC_INFO_DESCRIPTION: 'Name, description, severity, priority and mode.',
      SCOPE_TITLE: 'Scope',
      SCOPE_DESCRIPTION: 'Choose what to protect: by applications or by namespaces.',
      SCHEDULE_TITLE: 'Schedule',
      SCHEDULE_DESCRIPTION: 'Set the protection window — permanent or time-bounded.',
      POLICIES_TITLE: 'Policies',
      POLICIES_DESCRIPTION: 'Choose which Kyverno policy templates to enforce.',
    },
    FORM: {
      NAME_LABEL: 'Plan name',
      NAME_PLACEHOLDER: 'e.g. Production release freeze',
      DESCRIPTION_LABEL: 'Description',
      DESCRIPTION_PLACEHOLDER: 'Optional short description',
      SEVERITY_LABEL: 'Severity',
      PRIORITY_LABEL: 'Priority',
      MODE_LABEL: 'Mode',
      SCOPE_TYPE_LABEL: 'Scope type',
      APPLICATIONS_LABEL: 'Applications',
      APPLICATIONS_PLACEHOLDER: 'Select applications',
      NAMESPACES_LABEL: 'Namespaces',
      NAMESPACES_PLACEHOLDER: 'Enter namespace names',
      TIME_MODE_LABEL: 'Mode',
      START_AT_LABEL: 'Start',
      END_AT_LABEL: 'End',
      PARTICIPANTS_LABEL: 'Participants',
      PARTICIPANTS_PLACEHOLDER: 'Enter participant user IDs',
      ADD_POLICY_BUTTON: 'Add policy',
    },
    SEVERITY_OPTIONS: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ] as Array<{ value: string; label: string }>,
    MODE_OPTIONS: [
      { value: 'audit', label: 'Audit — log violations, do not block' },
      { value: 'enforce', label: 'Enforce — block policy violations' },
    ] as Array<{ value: string; label: string }>,
    TIME_MODE_OPTIONS: [
      { value: 'permanent', label: 'Permanent' },
      { value: 'time_range', label: 'Time range' },
    ] as Array<{ value: string; label: string }>,
    SCOPE_TYPE_OPTIONS: [
      { value: 'applications', label: 'Applications' },
      { value: 'namespaces', label: 'Namespaces' },
    ] as Array<{ value: string; label: string }>,
  },
} as const;

export const PHASE_BADGE_CONFIG: Record<PlanPhase, { background: string; color: string }> = {
  active: { background: '#dcfce7', color: '#166534' },
  scheduled: { background: '#dbeafe', color: '#1d4ed8' },
  failed: { background: '#fee2e2', color: '#991b1b' },
  terminated: { background: '#e5e7eb', color: '#4b5563' },
  cancelled: { background: '#e5e7eb', color: '#4b5563' },
  draft: { background: '#f3f4f6', color: '#6b7280' },
};

export const PHASE_DOT_COLOR: Record<PlanPhase, string> = {
  active: '#22c55e',
  scheduled: '#3b82f6',
  failed: '#ef4444',
  terminated: '#9ca3af',
  cancelled: '#9ca3af',
  draft: '#d1d5db',
};
