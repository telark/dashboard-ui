import { SHARED_PAGE_CONSTANTS } from '../shared/pages';

export const GROUPERS_PAGE_CONSTANTS = {
  RETRY: SHARED_PAGE_CONSTANTS.RETRY,
  COOLDOWN: SHARED_PAGE_CONSTANTS.COOLDOWN,
  UI: SHARED_PAGE_CONSTANTS.UI,
  COLORS: SHARED_PAGE_CONSTANTS.COLORS,
  MESSAGES: {
    ...SHARED_PAGE_CONSTANTS.MESSAGES,
    LOADING: 'Loading groupers…',
    SUCCESS: 'Groupers loaded successfully!',
    NO_GROUPERS_TITLE: 'No groupers yet',
    NO_GROUPERS_DESCRIPTION:
      "When your cluster is connected, groupers represent your namespaces. Make sure you have at least one namespace (excluding any you've set to be ignored in Settings). Try syncing to pull the latest.",
  },
  LAYOUT: SHARED_PAGE_CONSTANTS.LAYOUT,
} as const;
