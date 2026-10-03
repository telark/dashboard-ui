export const NO_PERMISSION_CONSTANTS = {
  LABELS: {
    TITLE: (featureName: string) => `No access to ${featureName}`,
    DESCRIPTION: (featureName: string) => `You do not have access to ${featureName}.`,
    PAGE_HINT: (level: string, scope: string) =>
      `Ask an administrator for ${level} access on ${scope}.`,
    EMPTY_TITLE: 'No access',
    SHORT_REQUIREMENT: (level: string, scope: string) => `Requires ${level} on ${scope}`,
    SHORT_DENY: 'Blocked by a deny rule on your roles',
  },
  LAYOUT: {
    COMPACT_PADDING_PX: 24,
    LOCK_GAP_PX: 8,
    LOCK_LINE_GAP_PX: 2,
    ICON_BADGE_ALPHA: 0.12,
    PAGE_ICON_PX: 32,
    BOX: { BADGE_PX: 32, ICON_PX: 16, TITLE_PX: 13, LINE_PX: 12 },
  },
} as const;
