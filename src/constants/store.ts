import { COMMON_VALUES } from './common';

export const STORAGE_KEYS = {
  HAS_CLUSTER_INSIGHTS: 'HAS_CLUSTER_INSIGHTS',
  WELCOME_PENDING: 'WELCOME_PENDING',
} as const;

export const STORE_ACTIONS = {
  INSIGHTS: {
    CHECK_CLUSTER: 'insights/checkCluster',
  },
  GROUPERS: {
    FETCH: 'groupers/fetch',
    TRIGGER_SYNC: 'groupers/triggerSync',
    REFRESH_AUTO: 'groupers/refreshAuto',
    FETCH_DETAILS: 'groupers/fetchDetails',
  },
  GROUPER: {
    UPDATE_SYNC: 'grouper/updateGrouperSync',
    CHECK_MAINTENANCE: 'grouper/checkMaintenanceMode',
    ENABLE_MAINTENANCE: 'grouper/enableMaintenanceMode',
    UPDATE_MAINTENANCE: 'grouper/updateMaintenanceMode',
    REMOVE_MAINTENANCE: 'grouper/removeMaintenanceMode',
  },
} as const;

export const SYNC_MODES = COMMON_VALUES.SYNC_MODES;

export const STORE_ERRORS = {
  FETCH_GROUPERS: 'Failed to fetch groupers',
  TRIGGER_SYNC: 'Failed to trigger groupers sync',
  REFRESH_AUTO: 'Failed to refresh auto groupers',
  UPDATE_SYNC: 'Failed to update sync settings.',
  CHECK_MAINTENANCE: 'Failed to fetch maintenance mode status.',
  ENABLE_MAINTENANCE: 'Failed to enable maintenance mode.',
  UPDATE_MAINTENANCE: 'Failed to update maintenance mode.',
  REMOVE_MAINTENANCE: 'Failed to delete maintenance mode.',
  FETCH_DETAILS: 'Failed to fetch grouper details',
  CHECK_INSIGHTS: 'Failed to check cluster insights',
} as const;

export const STORE_MESSAGES = {
  MAINTENANCE_UPDATED: 'Maintenance Mode updated:',
  FETCH_MAINTENANCE_FAILED: 'Failed to fetch maintenance data:',
  ERROR_FETCHING_GROUPERS: 'Error fetching groupers:',
  ERROR_FETCHING_GROUPER_DETAILS: 'Error fetching grouper details:',
  TRIGGERING_SYNC: 'Triggering SyncGrouper for:',
  ERROR_UPDATING_SYNC: 'Error updating sync settings:',
  ERROR_HANDLING_MAINTENANCE_UPDATE: 'Failed to handle maintenance mode update',
  ERROR_REMOVING_MAINTENANCE: 'Failed to remove maintenance mode',
  ERROR_BOUNDARY: 'Error caught in boundary:',
} as const;
