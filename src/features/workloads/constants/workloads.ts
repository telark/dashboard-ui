import { SHARED_PAGE_CONSTANTS } from '../../../constants/shared/pages';

export const WORKLOADS_PAGE_CONSTANTS = {
  RETRY: SHARED_PAGE_CONSTANTS.RETRY,
  COOLDOWN: SHARED_PAGE_CONSTANTS.COOLDOWN,
  UI: SHARED_PAGE_CONSTANTS.UI,
  COLORS: SHARED_PAGE_CONSTANTS.COLORS,
  MESSAGES: {
    ...SHARED_PAGE_CONSTANTS.MESSAGES,
    LOADING: 'Loading workloads…',
    SUCCESS: 'Workloads loaded successfully!',
    NO_WORKLOADS_TITLE: 'No workloads yet',
    NO_WORKLOADS_DESCRIPTION:
      'When your cluster is connected, workloads will be displayed here. Make sure you have workloads running in your cluster. Try syncing to pull the latest.',
    WORKLOAD_NOT_FOUND: 'Workload not found',
    WORKLOAD_NOT_FOUND_DESCRIPTION: 'The workload could not be found.',
  },
  LAYOUT: SHARED_PAGE_CONSTANTS.LAYOUT,
} as const;

