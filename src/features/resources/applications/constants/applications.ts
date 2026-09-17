import { DEFAULT_COLORS } from '../../../../constants';
import { SHARED_PAGE_CONSTANTS } from '../../../../constants/shared/pages';
import { SHARED_DETAILS_CONSTANTS } from '../../../../constants/shared/details';

export const APPLICATIONS_SYNC_RETRY_INTERVAL_MS = 60000;
export const APPLICATIONS_SYNC_ACTIVE_POLL_MS = 5000;
export const APPLICATIONS_DISCOVERY_STATUS_POLL_MS = 5000;
export const APPLICATIONS_PAGE_SIZE = 10;
export const APPLICATION_CHANGE_LOG_PAGE_SIZE = 10;
// A rollback cannot be aborted once the engine picks it up (~200ms after the
// request), so the only real second chance is this delay before the request.
export const ROLLBACK_UNDO_WINDOW_SECONDS = 5;
export const APPLICATION_TRACKING_ANNOTATION_PREFIX =
  'metadata.annotations.telark.io/last-modified';

// Snapshot manifests can carry a full rendered YAML blob each; caching every
// one ever opened this session would grow the store unbounded, so the cache
// evicts the least-recently-opened entry once it's full.
export const SNAPSHOT_MANIFEST_CACHE_LIMIT = 20;

export const FORCE_SYNC_PHASE = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const SYNC_STATUS_VALUE = {
  SYNCING: 'syncing',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export const FORCE_SYNC_RESPONSE_STATUS = {
  ENQUEUED: 'enqueued',
  ALREADY_IN_FLIGHT: 'already_in_flight',
} as const;

export const APPLICATIONS_CONSTANTS = {
  UI: {
    EMPTY_STATE_MAX_WIDTH: SHARED_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
  },
  MESSAGES: {
    LOADING: 'Loading applications…',
    SUCCESS: 'Applications loaded successfully!',
    RETRY_FAILED_ATTEMPT: 'Failed to fetch applications. Retrying...',
    RETRY_ATTEMPT_LOG: 'applications fetch retry attempt failed',
    NO_APPLICATIONS_TITLE: 'No applications yet',
    NO_APPLICATIONS_DESCRIPTION:
      'When your cluster is connected, applications represent logical app groupings. Try syncing your cluster resources to pull the latest.',
  },
  RETRY: {
    KEY: 'applications.fetch',
    MESSAGE_KEY: 'applications.fetch.retry',
  },
  LAYOUT: {
    EMPTY_STATE_CONTAINER: SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER,
    EMPTY_ICON: SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON,
  },
} as const;

export const APPLICATION_DETAILS_CONSTANTS = {
  OVERVIEW_TAG_SUCCESS: {
    background: DEFAULT_COLORS.SUCCESS,
    color: DEFAULT_COLORS.BACKGROUND_WHITE,
  },
  WORKLOAD_RESOURCE_METRICS: {
    CPU_ICON_BG: 'rgba(32,201,151,0.12)',
    CPU_ICON_COLOR: DEFAULT_COLORS.SUCCESS,
    MEMORY_ICON_BG: 'rgba(59,130,246,0.12)',
    MEMORY_ICON_COLOR: '#3B82F6',
  },
  TAB_KEYS: {
    OVERVIEW: 'overview',
    RESOURCES: 'resources',
    INSIGHTS: 'insights',
    METRICS: 'metrics',
    HISTORY: 'history',
  },
  LAYOUT: SHARED_DETAILS_CONSTANTS.LAYOUT,
  STATES: SHARED_DETAILS_CONSTANTS.STATES,
  MESSAGES: {
    ...SHARED_DETAILS_CONSTANTS.MESSAGES,
    ERROR: 'Error fetching application details:',
    EMPTY: 'No details available for this application.',
  },
} as const;

export type TabKey =
  (typeof APPLICATION_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof APPLICATION_DETAILS_CONSTANTS.TAB_KEYS];

export const APPLICATION_CHANGE_CLASS = {
  ROLLBACK: 'rollback',
} as const;
