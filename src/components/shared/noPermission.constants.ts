import { MENU_LABELS } from '../../constants';

// Levels and scopes in the UI's words: "read access to Insights", not "ReadOnly on insights".
const LEVEL_WORDS: Record<string, string> = {
  ReadOnly: 'read',
  Contributor: 'edit',
  Owner: 'full',
  Admin: 'full',
};
export const SCOPE_LABELS: Record<string, string> = {
  // As the role editor words it: "an Admin on all scopes".
  ALL: 'all scopes',
  applications: MENU_LABELS.APPLICATIONS,
  insights: MENU_LABELS.INSIGHTS,
  'protection-plans': MENU_LABELS.PROTECTION_PLANS,
  users: MENU_LABELS.USERS,
  groups: MENU_LABELS.GROUPS,
  roles: MENU_LABELS.ROLES,
  settings: MENU_LABELS.SETTINGS,
};
const access = (level: string, scope: string): string =>
  `${LEVEL_WORDS[level] ?? level} access to ${SCOPE_LABELS[scope] ?? scope}`;

export const NO_PERMISSION_CONSTANTS = {
  LABELS: {
    TITLE: (featureName: string) => `No access to ${featureName}`,
    DESCRIPTION: (featureName: string) => `You do not have access to ${featureName}.`,
    PAGE_HINT: (level: string, scope: string) =>
      `Ask an administrator for ${access(level, scope)}.`,
    EMPTY_TITLE: 'No access',
    SHORT_REQUIREMENT: (level: string, scope: string) => `Requires ${access(level, scope)}`,
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
