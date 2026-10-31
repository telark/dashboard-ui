// The one placeholder for a missing value, everywhere in the UI.
export const EMPTY_VALUE = '—';

// An empty list or setting, said in words.
export const NONE_TEXT = 'None';

// A dropdown with nothing to list names its items; any other takes the default (renderEmpty in App.tsx).
export const DROPDOWN_EMPTY = {
  DEFAULT: 'No results',
  NONE_FOUND: (items: string) => `No ${items} found`,
} as const;

export const COMMON_VALUES = {
  SYNC_MODES: {
    AUTO: 'auto',
    MANUAL: 'manual',
  },
  DATES: {
    INVALID: 'Invalid Date',
  },
} as const;
