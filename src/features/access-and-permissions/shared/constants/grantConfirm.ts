export const GRANT_CONFIRM = {
  TITLE: (level: string, areas: string, name: string) => `Grant ${level} on ${areas} to ${name}?`,
  ADMIN_BODY: (name: string) =>
    `${name} will be able to change sign-in settings, suspend members and grant access to others.`,
  BODY: (name: string, areas: string) =>
    `${name} will be able to delete, approve and assign access in ${areas}.`,
  ACTION: (level: string) => `Grant ${level}`,
  EVERY_AREA: 'every area',
  CANCEL: 'Cancel',
  LIST_LOCALE: 'en-US',
} as const;
