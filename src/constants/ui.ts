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
} as const;

export type UIConstants = typeof UI;


