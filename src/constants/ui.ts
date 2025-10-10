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
