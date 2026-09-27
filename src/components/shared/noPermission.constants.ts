export const NO_PERMISSION_CONSTANTS = {
  LABELS: {
    TITLE: 'No Permissions',
    DESCRIPTION: (featureName: string) => `You do not have access to ${featureName}.`,
    REQUIREMENT: (level: string, scope: string) =>
      `Requires ${level} access or higher on the ${scope} scope.`,
    DENY_RULE: (rule: string) => `A deny rule on your roles blocks it: ${rule}.`,
    HINT: 'Ask an administrator for a role that grants this access.',
  },
  LAYOUT: {
    CARD_PADDING_PX: 20,
    TITLE_FONT_SIZE_PX: 15,
    TEXT_FONT_SIZE_PX: 14,
    COMPACT_FONT_SIZE_PX: 12,
    LINE_GAP_PX: 6,
  },
} as const;
