export const UI = {
  LAYOUT: {
    MAX_CONTENT_WIDTH: 980,
    PAGE_PADDING: 24,
  },
  TABS: {
    GENERAL: 'General',
    RESOURCES: 'Resources',
    HISTORY: 'History',
    SYNC_MODE: 'Sync Mode',
    MAINTENANCE_MODE: 'Maintenance Mode',
  },
  HEADER: {
    LAST_UPDATE_PREFIX: 'Last update was',
  },
  BUTTONS: {
    SYNC: 'Sync',
    SHOW_FULL_HISTORY: 'Show Full History',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
  },
  HISTORY: {
    FULL_TITLE: 'Full History',
    RECORDING: 'Recording…',
    TIMELINE: {
      HALO_SIZE_LAST: 20,
      MARKER_SIZE: 16,
      RAIL_WIDTH: 1,
    },
  },
  CARD: {
    DELETE_TITLE: 'Delete Grouper',
    DELETE_MESSAGE: 'Are you sure you want to delete this Grouper?',
    POPOVER: {
      VIEW: 'View Details',
      SYNC: 'Sync Grouper',
      DELETE: 'Delete Grouper',
    },
    INFO_POPOVER: 'Grouper presents Namespace',
    MAINTENANCE_BADGE: 'Maintenance Mode',
    LAST_UPDATE_PREFIX: 'Last update was',
    METRICS: {
      WORKLOADS: 'Workloads',
      BRIDGES: 'Bridges',
    },
  },
  RESOURCES: {
    EMPTY_TITLE: 'No resources yet',
    EMPTY_DESC:
      'This grouper currently has no workloads or bridges. Once resources exist, they’ll be listed here.',
    REFRESH: 'Refresh',
    LABELS: {
      NAME: 'Resource Name',
      LAST_SYNC: 'Last Sync',
      KIND: 'Kind',
      STATUS: 'Status',
    },
  },
} as const;

// Component-specific styles for better performance
export const COMPONENT_STYLES = {
  WORKLOAD_INSTANCES: {
    emptyState: {
      minHeight: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.12)',
      boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      color: '#20C997', // DEFAULT_COLORS.SUCCESS
      fontSize: 24,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      minHeight: 40,
    },
    statusTag: {
      borderRadius: 999,
      padding: '2px 10px',
      fontWeight: 700,
      margin: 0,
    },
    kindPill: {
      border: '1px solid #e5e7eb',
      color: '#111827',
      background: '#F9FAFB',
      borderRadius: 999,
      padding: '2px 10px',
      fontWeight: 700,
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 200,
    },
    instanceIcon: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.12)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#20C997', // DEFAULT_COLORS.SUCCESS
    },
    metricsSection: {
      background: 'white',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      marginBottom: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    containersSection: {
      background: 'white',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    // Common text styles
    textPrimary: {
      fontSize: 16,
      fontWeight: 700,
      color: '#0B1F33',
    },
    textSecondary: {
      color: '#5B6B7C',
    },
    textMuted: {
      color: '#9CA3AF',
    },
    textLabel: {
      fontSize: 13,
      fontWeight: 600,
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    textValue: {
      fontSize: 15,
      fontWeight: 600,
      color: '#0f172a',
    },
    textSmall: {
      fontSize: 11,
      color: '#64748b',
    },
    // Layout styles
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    flexCenterGap12: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    flexWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    // Container styles
    containerCard: {
      border: '1px solid #eef2f6',
      borderRadius: 12,
      background: '#fff',
    },
    // Status indicators
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#20C997', // DEFAULT_COLORS.SUCCESS
    },
    // Button styles
    toggleButton: {
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      background: '#20C997', // DEFAULT_COLORS.SUCCESS
      color: 'white',
      fontWeight: 600,
      padding: '8px 16px',
      height: 'auto',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    // Badge styles
    badge: {
      fontSize: 11,
      color: '#64748b',
      background: '#f1f5f9',
      padding: '2px 6px',
      borderRadius: 4,
    },
    badgeBlue: {
      fontSize: 10,
      padding: '2px 6px',
      background: '#f0f9ff',
      borderRadius: 4,
      color: '#0369a1',
      fontWeight: 500,
      border: '1px solid #bae6fd',
    },
  },
} as const;

// Component-specific constants for better organization
export const COMPONENT_CONSTANTS = {
  WORKLOAD_INSTANCES: {
    PULL_POLICY_MAP: {
      'Always': 'Always pull',
      'IfNotPresent': 'Pull if needed',
      'Never': 'Local only'
    },
    INSTANCE_TYPE: 'Instance',
  },
} as const;

export type UIConstants = typeof UI;
