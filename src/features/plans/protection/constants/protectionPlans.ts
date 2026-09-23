import { DEFAULT_COLORS } from '../../../../constants';
import type {
  PlanPhase,
  PlanHealth,
  PlanMode,
  PlanReportFormat,
  ScopeType,
  ViolationResult,
} from '../models';

export const PROTECTION_PLANS_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Protection Plans',
    HEADER_SUBTITLE:
      'Define temporary protection windows to safeguard critical Kubernetes workloads.',
    CREATE_SUBTITLE: 'Create a new Protection Plan',
    NOT_FOUND: 'Protection Plan not found',
    LOADING_PLANS: 'Loading Plans...',
    CREATE_BUTTON: 'Create Plan',
    CREATE_BUTTON_TEXT: 'Create Plan',
    TOOLBAR_SEARCH_PLACEHOLDER: 'Search plans by name, type, or scope...',
    TOOLBAR_SEARCH_BUTTON: 'Search',
    TOOLBAR_COUNT_SUFFIX: 'plans',
    // Measured natural width of the toolbar row: count + 6 phase pills + filter
    // + search + create. Below this the controls fall back to icons.
    TOOLBAR_COMPACT_WIDTH: {
      DEFAULT: 760,
      BULK: 760,
    },
    BREADCRUMBS: {
      ROOT: 'Protection Plans',
      CREATE: 'Create Plan',
    },
    REPORTS: {
      GENERATE: 'Generate report',
      GENERATING: 'Generating…',
      REFRESH: 'Refresh',
      TRIGGER_LABELS: {
        end: 'Final',
        cancel: 'Final (canceled)',
        manual: 'On demand',
      },
      GENERATED_AT: 'Generated',
      GENERATED_BY: 'By',
      DECISIONS: 'Admission decisions',
      SYSTEM_ACTOR: 'System',
      TRUNCATED: 'capped',
      PRINT_HINT: 'Open the HTML report and use your browser’s Print to save it as PDF.',
      NOT_STARTED_HINT: 'Reports become available once the plan has started.',
      EMPTY_DRAFT: 'Reports become available once the plan starts.',
      EMPTY_ACTIVE:
        'No reports yet. Generate one now, or wait for the final report captured when the plan ends.',
      EMPTY_ENDED: 'No report was captured for this plan.',
      LOAD_ERROR: 'Could not load reports.',
      GENERATE_SUCCESS: 'Report generated.',
      GENERATE_ERROR: 'Could not generate the report.',
      GENERATE_BUSY: 'A report is already being generated. Try again in a moment.',
      DOWNLOAD_ERROR: 'Could not download the report.',
      DOWNLOAD_MISSING: 'This report file is no longer available.',
    },
    TAXONOMY: {
      BUTTON: 'Organize',
      ENVIRONMENTS: 'Environments',
      TAGS: 'Tags',
    },
    DETAIL_PAGE: {
      SUBTITLE: 'Inspect plan configuration, health, and recent violations.',
      LOADING_ERROR: 'Failed to load plan details.',
      NOT_FOUND: 'Protection plan not found.',
      SECTIONS: {
        OVERVIEW_TITLE: 'Overview',
        OVERVIEW_DESCRIPTION: 'Identity, mode, and lifecycle metadata.',
        OVERVIEW_COLUMN_PRIMARY: 'Details',
        OVERVIEW_COLUMN_PARTICIPANTS: 'Participants',
        SCOPE_TITLE: 'Scope',
        SCOPE_DESCRIPTION: 'What this plan protects.',
        POLICIES_TITLE: 'Policies',
        POLICIES_DESCRIPTION: 'Configured policy templates.',
        PARTICIPANTS_TITLE: 'Participants',
        PARTICIPANTS_DESCRIPTION: 'Users associated with this plan.',
        HEALTH_TITLE: 'Health',
        HEALTH_DESCRIPTION: 'Drift detection across deployed policies.',
        VIOLATIONS_TITLE: 'Violations',
        VIOLATIONS_DESCRIPTION: 'Recent policy admission decisions.',
        REPORTS_TITLE: 'Reports',
        REPORTS_DESCRIPTION:
          'Documents describing what happened in the cluster while this plan was in effect. A final report is captured automatically when a plan ends.',
      },
      FIELDS: {
        ID: 'ID',
        NAME: 'Name',
        DESCRIPTION: 'Description',
        SEVERITY: 'Severity',
        PRIORITY: 'Priority',
        MODE: 'Mode',
        TIME_MODE: 'Time mode',
        TIME_RANGE: 'Time range',
        PERMANENT: 'Permanent',
        CREATED: 'Created By',
        UPDATED: 'Last updated',
        STARTED: 'Started By',
        TERMINATED: 'Terminated',
        REASON: 'Reason',
        SCOPE_TYPE: 'Scope type',
        APPLICATIONS: 'Applications',
        NAMESPACES: 'Namespaces',
      },
      ACTIONS: {
        DUPLICATE: 'Duplicate',
        DUPLICATE_PANEL_TITLE: 'Duplicate Plan',
        CANCEL: 'Cancel',
        EDIT: 'Edit',
        MORE_LABEL: 'More',
        EDIT_DISABLED_TOOLTIP: 'Reactivate this plan before editing it.',
        REFRESH_HEALTH: 'Refresh health',
        CANCEL_MODAL_TITLE: 'Cancel Protection Plan',
        CANCEL_MODAL_OK: 'Cancel plan',
        REACTIVATE: 'Reactivate',
        REACTIVATE_MODAL_TITLE: 'Reactivate Protection Plan',
        REACTIVATE_MODAL_BODY:
          'Reactivate this protection plan? Its policies will be re-deployed to the cluster.',
        REACTIVATE_MODAL_OK: 'Reactivate',
        REACTIVATE_DISABLED_EXPIRED_TOOLTIP:
          "The plan's time range has expired. Edit the plan to set new dates before reactivating.",
      },
      EMPTY_VALUE: '—',
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
      DUPLICATE: 'Duplicate plan',
      DELETE_MODAL_TITLE: 'Delete Protection Plan',
      DELETE_MODAL_OK: 'Delete',
      DUPLICATE_SUCCESS: 'Plan duplicated successfully.',
      DUPLICATE_ERROR: 'Failed to duplicate plan.',
      CANCEL_SUCCESS: (name: string) => `Plan "${name}" canceled.`,
      CANCEL_ERROR: 'Failed to cancel plan.',
      DELETE_SUCCESS: (name: string) => `Plan "${name}" deleted.`,
      DELETE_ERROR: 'Failed to delete plan.',
      REFRESH_HEALTH_ERROR: 'Failed to refresh health status.',
      CREATE_SUCCESS: (name: string) => `Plan "${name}" created.`,
      CREATE_ERROR: 'Failed to create plan.',
      UPDATE_SUCCESS: (name: string) => `Plan "${name}" updated.`,
      UPDATE_ERROR: 'Failed to update plan.',
      REACTIVATE_SUCCESS: (name: string) => `Plan "${name}" reactivated.`,
      REACTIVATE_ERROR: 'Failed to reactivate plan.',
    },
    HEALTH_LABELS: {
      unknown: 'Unknown',
      healthy: 'Healthy',
      drifted: 'Drifted',
      degraded: 'Degraded',
    } as Record<PlanHealth, string>,
    VIOLATION_RESULT_LABELS: {
      pass: 'Pass',
      fail: 'Fail',
      warn: 'Warn',
      error: 'Error',
      skip: 'Skip',
    } as Record<ViolationResult, string>,
    VIOLATIONS: {
      TAB_LABEL: 'Violations',
      TABLE_RESOURCE: 'Resource',
      TABLE_RESOURCE_KIND: 'Kind',
      TABLE_RESOURCE_NAME: 'Resource',
      TABLE_NAMESPACE: 'Namespace',
      TABLE_RULE: 'Rule',
      TABLE_RESULT: 'Result',
      TABLE_TIMESTAMP: 'Timestamp',
      TABLE_MESSAGE: 'Message',
      EMPTY_TITLE: 'No violations in the retention window.',
      EMPTY_AUDIT: 'In audit mode, operations that would have been blocked appear here.',
      EMPTY_ENFORCE: 'Nothing matching this plan has been blocked recently.',
      RETENTION_NOTE: (window: string) =>
        `Admission decisions are retained for ${window}. Older activity is no longer available.`,
      LOAD_ERROR: 'Could not load violations. The server took too long to respond.',
      REFRESH: 'Refresh',
      FILTER_PLACEHOLDER: 'Filter by result',
      FILTER_ALL: 'All',
    },
    HEALTH_DETAIL: {
      TITLE: 'Health',
      CHECKED_AT: 'Last checked',
      REFRESH_BUTTON: 'Refresh health',
      MISSING: 'Missing policies',
      UNEXPECTED: 'Unexpected policies',
      POLICY_NAME: 'Policy',
      NAMESPACE: 'Namespace',
      PRESENT: 'Present',
      READY: 'Ready',
      FAILURE_ACTION: 'Failure action',
      LOAD_ERROR: 'Failed to load health status.',
    },
    PHASE_LABELS: {
      active: 'Active',
      scheduled: 'Scheduled',
      failed: 'Failed',
      terminated: 'Terminated',
      canceled: 'Canceled',
      draft: 'Draft',
    } as Record<PlanPhase, string>,
    PHASE_INFO: {
      STARTS_PREFIX: 'Starts',
      STARTS_IN_PREFIX: 'Starts in',
      ENDS_PREFIX: 'Ends',
      ENDS_IN_PREFIX: 'Ends in',
      TERMINATED_PREFIX: 'Terminated',
    },
    MODE_LABELS: {
      audit: 'Audit',
      enforce: 'Enforce',
    } as Record<PlanMode, string>,
    CARD: {
      WINDOW_LABEL: 'Protection window',
      PERMANENT_LABEL: 'Protection',
      WINDOW_TIME_FORMAT: 'MMM d, HH:mm',
      RANGE_SEPARATOR: ' → ',
      PERMANENT_RANGE: 'Always on',
      NO_END_DATE: 'No end date',
      NO_SCHEDULE: 'No schedule set',
      META_SEPARATOR: ' · ',
      TARGETS_SEPARATOR: ', ',
      APPLICATIONS_COUNT: (count: number) =>
        `${count} ${count === 1 ? 'application' : 'applications'}`,
      CREATED_PREFIX: 'created',
      UPDATED_PREFIX: 'updated',
      REFUSES_PREFIX: 'Refuses',
      REFUSES_NONE: 'No policies configured',
      MORE_POLICIES: (count: number) => `+${count}`,
      STATE: {
        ENFORCING: 'Enforcing',
        AUDITING: 'Auditing in the background',
        SCHEDULED: 'Waiting to start',
        CANCELED: 'Canceled',
        TERMINATED: 'Window ended',
        FAILED: 'Could not deploy',
        DRAFT: 'Draft',
      },
      LEFT_SUFFIX: 'left',
      STATS: {
        SCOPE: 'Scope',
        MODE: 'Mode',
        TEMPLATES: 'Templates',
        HEALTH: 'Health',
      },
      TEMPLATES_COUNT: (count: number) => `${count} active`,
      NAMESPACES_COUNT: (count: number) => `${count} ${count === 1 ? 'namespace' : 'namespaces'}`,
      BLOCKED_LABEL: 'Refuses in this window',
      BLOCKED_LABEL_PERMANENT: 'Always refuses',
      MORE_BLOCKED: (count: number) => `+${count} more`,
      CREATED_BY_PREFIX: 'by',
      PROTECTING_NAMESPACE: (target: string) => `Protecting namespace ${target}`,
      PROTECTING_NAMESPACES: (count: number) => `Protecting ${count} namespaces`,
      PROTECTING_APPLICATIONS: (count: number) =>
        `Protecting ${count} ${count === 1 ? 'application' : 'applications'}`,
    },
    SEVERITY_LABEL: 'Severity',
    MODE_ENFORCEMENT_LABEL: 'Policy Enforcement Mode',
    QUICK_FILTERS: {
      ALL: 'All',
    },
    FILTER: {
      BY_CREATION_DATE: 'CREATED DATE',
      BY_SCOPE_TYPE: 'SCOPE TYPE',
      BY_CREATED_BY: 'CREATED BY',
      BY_TEMPLATES: 'TEMPLATES',
      BY_TARGETS: 'TARGETS',
      BY_ENVIRONMENT: 'ENVIRONMENT',
      BY_TAGS: 'TAGS',
      FROM: 'From',
      TO: 'To',
    },
  },
  FILTER_KEYS: {
    DATE_RANGE: 'dateRange',
    SCOPE_TYPE: 'scopeType',
    CREATED_BY: 'createdBy',
    TEMPLATES: 'templates',
    TARGETS: 'targets',
    ENVIRONMENT: 'environment',
    TAGS: 'tags',
  } as const,
  PANELS: {
    CREATE: {
      TITLE: 'Create Protection Plan',
      SUBTITLE: 'Define a new protection window for your workloads.',
      SUBMIT_BUTTON: 'Create Plan',
      LOADING_LABEL: 'Creating...',
    },
    EDIT: {
      TITLE: 'Edit Protection Plan',
      SUBTITLE: (name: string) => `Update configuration of "${name}".`,
      SUBMIT_BUTTON: 'Save changes',
      LOADING_LABEL: 'Saving...',
      ACTIVE_SCOPE_WARNING:
        'Saving changes to scope will re-render and re-deploy this plan’s policies.',
      NO_CHANGES_HINT: 'No changes to save.',
    },
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
      POLICIES_DESCRIPTION: 'Choose which policy templates to enforce.',
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
      PARTICIPANTS_PLACEHOLDER: 'Select participants',
      ADD_POLICY_BUTTON: 'Add policy',
      POLICIES_REQUIRED_ERROR: 'Add at least one policy to continue.',
      START_REQUIRED_ERROR: 'Start time is required',
      END_REQUIRED_ERROR: 'End time is required',
      SEVERITY_REQUIRED_ERROR: 'Severity is required',
      ENVIRONMENT_LABEL: 'Environment',
      ENVIRONMENT_PLACEHOLDER: 'Select an environment (optional)',
      TAGS_LABEL: 'Tags',
      TAGS_PLACEHOLDER: 'Select tags (optional)',
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

export const PLAN_LIST_POLL = {
  DEFAULT_SECONDS: 60,
  MIN_SECONDS: 5,
  MS_PER_SECOND: 1000,
} as const;

export const PLAN_TAXONOMY_LIMITS = { MAX_TAGS: 20 } as const;

export const REPORT_FORMATS: ReadonlyArray<{ key: PlanReportFormat; label: string }> = [
  { key: 'html', label: 'HTML' },
  { key: 'md', label: 'Markdown' },
  { key: 'json', label: 'JSON' },
  { key: 'csv', label: 'CSV' },
];

export const REPORT_GENERATE_TIMEOUT_MS = 35_000;
export const REPORT_DOWNLOAD_TIMEOUT_MS = 60_000;
export const OBJECT_URL_REVOKE_DELAY_MS = 1_000;
export const REPORT_BUSY_STATUS = 429;
export const REPORT_SYSTEM_USER_ID = 'system';

/** Plan card: the elevated panel geometry every block inside it measures from. */
export const CARD_LAYOUT = {
  CARDS_PER_ROW: 3,
  GRID_GAP_PX: 12,
  PADDING_PX: 14,
  BLOCK_GAP_PX: 12,
  DIVIDER_GAP_PX: 10,
  ICON_CHIP_SIZE_PX: 28,
  ICON_CHIP_RADIUS_PX: 8,
  AVATAR_CHIP_SIZE_PX: 16,
  TITLE_FONT_SIZE_PX: 14,
  META_FONT_SIZE_PX: 11,
  TAG_FONT_SIZE_PX: 10,
  MAX_TARGET_TAGS: 3,
  MICRO_FONT_SIZE_PX: 9,
  MICRO_TRACKING: '0.06em',
  VALUE_FONT_SIZE_PX: 12,
  MONO_FONT_SIZE_PX: 10,
  TRACK_HEIGHT_PX: 4,
  STRIPE_WIDTH_PX: 3,
  STRIPE_PERIOD_PX: 11,
  CHIP_RADIUS_PX: 6,
  SPINE_WIDTH_PX: 3,
  REFUSAL_FONT_SIZE_PX: 14,
  ROW_GAP_PX: 10,
  EDGE_TRACK_HEIGHT_PX: 2,
  MIN_HEIGHT_PX: 132,
  CHIPS_GAP_PX: 12,
  MAX_POLICY_CHIPS: 3,
  PILL_RADIUS_PX: 999,
  DOT_SIZE_PX: 6,
} as const;

export const PHASE_ACCENT: Record<PlanPhase, string> = {
  active: DEFAULT_COLORS.SUCCESS,
  scheduled: DEFAULT_COLORS.WARNING,
  failed: DEFAULT_COLORS.DANGER,
  terminated: DEFAULT_COLORS.DEFAULT,
  canceled: DEFAULT_COLORS.DEFAULT,
  draft: DEFAULT_COLORS.DEFAULT,
};

export const HEALTH_ACCENT: Record<PlanHealth, string> = {
  unknown: DEFAULT_COLORS.DEFAULT,
  healthy: DEFAULT_COLORS.SUCCESS,
  drifted: DEFAULT_COLORS.WARNING,
  degraded: DEFAULT_COLORS.DANGER,
};

/** The 12% wash behind an accent, keyed by the accent itself. */
export const ACCENT_TINT: Record<string, string> = {
  [DEFAULT_COLORS.SUCCESS]: DEFAULT_COLORS.SUCCESS_TINT,
  [DEFAULT_COLORS.WARNING]: DEFAULT_COLORS.WARNING_TINT,
  [DEFAULT_COLORS.DANGER]: DEFAULT_COLORS.DANGER_TINT,
  [DEFAULT_COLORS.DEFAULT]: DEFAULT_COLORS.DEFAULT_TINT,
};

/**
 * Chip text per template: the card names the operation a plan refuses, so
 * "Storage" alone never leaves the reader guessing which change is blocked.
 */
export const POLICY_CHIP_LABEL: Record<string, string> = {
  'block-create': 'Creating any resource',
  'block-update': 'Updating any resource',
  'block-delete': 'Deleting any resource',
  'block-image-types': 'Images matching blocked patterns',
  'block-image-tags': 'Images with blocked tags',
  'block-replica-scaling': 'Changing replica counts',
  'block-storage-changes': 'Creating, deleting or editing storage',
  'block-config-secret-resource-changes': 'Updating or deleting ConfigMaps & Secrets',
  'block-workload-config-mount-changes': 'Changing config mounts & env sources',
};

export const SCOPE_TYPE_LABEL: Record<ScopeType, string> = {
  applications: PROTECTION_PLANS_CONSTANTS.LABELS.DETAIL_PAGE.FIELDS.APPLICATIONS,
  namespaces: PROTECTION_PLANS_CONSTANTS.LABELS.DETAIL_PAGE.FIELDS.NAMESPACES,
};

export const PHASE_DOT_COLOR: Record<PlanPhase, string> = {
  active: '#22c55e',
  scheduled: '#3b82f6',
  failed: '#ef4444',
  terminated: '#9ca3af',
  canceled: '#9ca3af',
  draft: '#d1d5db',
};

export const HEALTH_DOT_COLOR: Record<PlanHealth, string> = {
  unknown: '#9ca3af',
  healthy: '#22c55e',
  drifted: '#f59e0b',
  degraded: '#ef4444',
};

export const VIOLATION_RESULT_BADGE: Record<
  ViolationResult,
  { background: string; color: string }
> = {
  pass: { background: '#dcfce7', color: '#166534' },
  fail: { background: '#fee2e2', color: '#991b1b' },
  warn: { background: '#fef3c7', color: '#92400e' },
  error: { background: '#fecaca', color: '#7f1d1d' },
  skip: { background: '#e5e7eb', color: '#4b5563' },
};

export const VIOLATION_RESULT_DOT: Record<ViolationResult, string> = {
  pass: DEFAULT_COLORS.SUCCESS,
  fail: DEFAULT_COLORS.DANGER,
  warn: DEFAULT_COLORS.WARNING,
  error: DEFAULT_COLORS.ERROR,
  skip: DEFAULT_COLORS.DEFAULT,
};
