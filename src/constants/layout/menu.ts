export const MENU_LABELS = {
  HOME: 'Home',
  APPLICATIONS: 'Applications',
  INSIGHTS: 'Insights',
  INSIGHTS_ATTENTION: (count: number) =>
    `${count} ${count === 1 ? 'incident needs' : 'incidents need'} attention`,
  USERS: 'Members',
  GROUPS: 'Groups',
  ROLES: 'Roles',
  PROTECTION_PLANS: 'Protection plans',
  SETTINGS: 'Settings',
  OPERATIONS: 'Operations',
  ADMINISTRATION: 'Administration',
} as const;

// Under each icon on the phone rail, where no hover can show the name: short enough for its width.
export const MENU_RAIL_LABELS = {
  HOME: MENU_LABELS.HOME,
  APPLICATIONS: 'Apps',
  PROTECTION_PLANS: 'Plans',
  INSIGHTS: MENU_LABELS.INSIGHTS,
  USERS: MENU_LABELS.USERS,
  GROUPS: MENU_LABELS.GROUPS,
  ROLES: MENU_LABELS.ROLES,
  SETTINGS: MENU_LABELS.SETTINGS,
} as const;
