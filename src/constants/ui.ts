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

export type UIConstants = typeof UI;


