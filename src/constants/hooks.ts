export const HOOK_MESSAGES = {
  SUCCESS: {
    SYNC_SETTINGS_UPDATED: 'Sync Settings Updated Successfully!',
    MAINTENANCE_MODE_UPDATED: 'Maintenance mode updated successfully!',
    MAINTENANCE_MODE_ENABLED: 'Maintenance mode enabled successfully!',
    MAINTENANCE_MODE_REMOVED: 'Maintenance mode removed successfully!',
  },
  ERROR: {
    UPDATE_SETTINGS_FAILED: 'Failed to update settings',
    UPDATE_MAINTENANCE_FAILED: 'Failed to update maintenance mode',
    REMOVE_MAINTENANCE_FAILED: 'Failed to remove maintenance mode',
    UNEXPECTED_RESPONSE: 'Unexpected response status',
  },
} as const;

export const HOOK_VALUES = {
  MAINTENANCE_STATUS: {
    ACTIVE: 'Active',
  },
} as const;

export const HOOK_CONFIGS = {
  DEFAULT_VALUES: {
    AUTO_SYNC: false as boolean,
    SYNC_MODE: '' as string,
    LOADING_SAVE: false as boolean,
    MAINTENANCE_MODAL_VISIBLE: false as boolean,
    MAINTENANCE_MODE_ACTIVE: false as boolean,
    MAINTENANCE_UPDATE_ACTION: true as boolean,
    MAINTENANCE_DELETE_ACTION: true as boolean,
    HAS_MAINTENANCE_DATA: false as boolean,
  },
} as const;
