import { DEFAULT_COLORS } from '../../../../constants';
import { SHARED_PAGE_CONSTANTS } from '../../../../constants/shared/pages';
import { SHARED_DETAILS_CONSTANTS } from '../../../../constants/shared/details';

export const APPLICATIONS_CONSTANTS = {
  UI: {
    EMPTY_STATE_MAX_WIDTH: SHARED_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
  },
  MESSAGES: {
    LOADING: 'Loading applications…',
    SUCCESS: 'Applications loaded successfully!',
    NO_APPLICATIONS_TITLE: 'No applications yet',
    NO_APPLICATIONS_DESCRIPTION:
      'When your cluster is connected, applications represent logical app groupings. Try syncing your cluster resources to pull the latest.',
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
