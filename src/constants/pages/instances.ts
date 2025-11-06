export const INSTANCES_PAGE_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Instances',
    HEADER_SUBTITLE: 'Manage instances',
    COLUMNS: {
      INSTANCE_NAME: 'Instance Name',
      STATUS: 'Status',
      CPU: 'CPU',
      MEMORY: 'Memory',
      CONTAINERS: 'Containers',
      IMAGE_NAMES: 'Image Names',
    },
    ACTIONS: {
      VIEW: 'View',
    },
  },
    KEYS: {
      INSTANCE_NAME: 'instanceName',
      STATUS: 'status',
      CPU: 'cpu',
      MEMORY: 'memory',
      CONTAINERS: 'containers',
      IMAGE_NAMES: 'imageNames',
      ACTIONS: 'actions',
    } as const,
  SIZES: {
    ROW_HEIGHT: 32,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
      COLUMNS: {
        INSTANCE_NAME: 150,
        STATUS: 90,
        CPU: 90,
        MEMORY: 90,
        CONTAINERS: 140,
        IMAGE_NAMES: 200,
        ACTIONS: 50,
      },
  },
  COLORS: {
    HEADER_BG: '#fff',
    CHIP_BLUE_BG: '#0ea5e930',
    CHIP_BLUE_TEXT: '#0369a1',
    STATUS_ACTIVE_BG: '#0ea5e930',
    STATUS_ACTIVE_TEXT: '#0369a1',
    STATUS_INACTIVE_BG: '#fca5a530',
    STATUS_INACTIVE_TEXT: '#b91c1c',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_MUTED: '#64748b',
    SORT_ACTIVE: '#0ea5e9',
    SORT_MUTED: '#94a3b8',
  },
  VALUES: {
    STATUS_ACTIVE: 'Active',
    STATUS_RUNNING: 'Running',
    STATUS_READY: 'Ready',
    STATUS_AVAILABLE: 'Available',
  },
} as const;

export type InstancesPageConstants = typeof INSTANCES_PAGE_CONSTANTS;

