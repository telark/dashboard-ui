import { COMMON_VALUES } from '../shared/common';

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
    FETCH_SILENT: 'groupers/fetchSilent',
    TRIGGER_GROUPER_SYNC: 'groupers/triggerSync',
    REFRESH_AUTO_GROUPERS: 'groupers/refreshAuto',
    FETCH_DETAILS: 'groupers/fetchDetails',
  },
  GROUPER: {
    UPDATE_SYNC: 'grouper/updateGrouperSync',
    CHECK_MAINTENANCE: 'grouper/checkMaintenanceMode',
    ENABLE_MAINTENANCE: 'grouper/enableMaintenanceMode',
    UPDATE_MAINTENANCE: 'grouper/updateMaintenanceMode',
    REMOVE_MAINTENANCE: 'grouper/removeMaintenanceMode',
  },
  WORKLOADS: {
    FETCH_APPS: 'workloads/fetchApps',
    FETCH_BATCHES: 'workloads/fetchBatches',
    FETCH_APP_DETAILS: 'workloads/fetchAppDetails',
    UPDATE_APP_SYNC: 'workloads/updateAppSync',
    TRIGGER_GROUPER_SYNC: 'workloads/triggerSync',
    REFRESH_AUTO_GROUPERS: 'workloads/refreshAuto',
  },
  BRIDGES: {
    FETCH: 'bridges/fetch',
    FETCH_SILENT: 'bridges/fetchSilent',
    TRIGGER_BRIDGE_SYNC: 'bridges/triggerSync',
    REFRESH_AUTO_BRIDGES: 'bridges/refreshAuto',
    FETCH_DETAILS: 'bridges/fetchDetails',
  },
  BRIDGE: {
    UPDATE_SYNC: 'bridge/updateBridgeSync',
  },
} as const;

export const SYNC_MODES = COMMON_VALUES.SYNC_MODES;

export const STORE_ERRORS = {
  FETCH_GROUPERS: 'Failed to fetch groupers',
  TRIGGER_GROUPER_SYNC: 'Failed to trigger groupers sync',
  REFRESH_AUTO_GROUPERS: 'Failed to refresh auto groupers',
  UPDATE_SYNC: 'Failed to update sync settings.',
  CHECK_MAINTENANCE: 'Failed to fetch maintenance mode status.',
  ENABLE_MAINTENANCE: 'Failed to enable maintenance mode.',
  UPDATE_MAINTENANCE: 'Failed to update maintenance mode.',
  REMOVE_MAINTENANCE: 'Failed to delete maintenance mode.',
  FETCH_DETAILS: 'Failed to fetch grouper details',
  CHECK_INSIGHTS: 'Failed to check cluster insights',
  FETCH_APPS: 'Failed to fetch apps workloads',
  FETCH_BATCHES: 'Failed to fetch batches workloads',
  FETCH_APP_DETAILS: 'Failed to fetch app workload details',
  UPDATE_APP_SYNC: 'Failed to update app workload sync mode',
  TRIGGER_APPS_SYNC: 'Failed to trigger apps workloads sync',
  REFRESH_AUTO_GROUPERS_APPS: 'Failed to refresh auto apps workloads',
  FETCH_BRIDGES: 'Failed to fetch bridges',
  TRIGGER_BRIDGE_SYNC: 'Failed to trigger bridges sync',
  REFRESH_AUTO_BRIDGES: 'Failed to refresh auto bridges',
  FETCH_BRIDGE_DETAILS: 'Failed to fetch bridge details',
  UPDATE_BRIDGE_SYNC: 'Failed to update bridge sync settings.',
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
  ERROR_FETCHING_APPS: 'Error fetching apps workloads:',
  ERROR_FETCHING_BATCHES: 'Error fetching batches workloads:',
  ERROR_FETCHING_APP_DETAILS: 'Error fetching app workload details:',
  ERROR_UPDATING_APP_SYNC: 'Error updating app workload sync settings:',
  ERROR_FETCHING_BRIDGES: 'Error fetching bridges:',
  ERROR_FETCHING_BRIDGE_DETAILS: 'Error fetching bridge details:',
} as const;
