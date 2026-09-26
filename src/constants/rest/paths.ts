const seg = (value: string) => encodeURIComponent(value);

export const API_PATHS = {
  APPLICATIONS: 'applications',
  CONFIG: 'config',
  USERS: 'users',
  GROUPS: 'groups',
  ACCESS_ROLES: 'accessroles',
  // Insights are produced out of band and read windowed to the apps on screen,
  // so they sit outside the resource CRUD paths.
  INSIGHTS: 'insights',
  CLUSTER_NAMESPACES: 'cluster/namespaces',
  CATEGORIES: 'categories',
  DISCOVERY_STATUS: 'discovery/status',
  SNAPSHOTS: 'snapshots',
  NOTIFICATIONS: 'notifications',
  PROTECTION_PLANS: 'protectionplans',
  POLICY_TEMPLATES: 'policytemplates',
  REPORTS: 'reports',
} as const;

export const byId = (base: string, id: string) => `${base}/${seg(id)}`;

export const APPLICATION_PATHS = {
  BY_NAME: (name: string) => byId(API_PATHS.APPLICATIONS, name),
  RESET: (name: string) => `${byId(API_PATHS.APPLICATIONS, name)}/reset`,
  SYNC: (name: string) => `${byId(API_PATHS.APPLICATIONS, name)}/sync`,
  ROLLBACKS: (name: string) => `${byId(API_PATHS.APPLICATIONS, name)}/rollbacks`,
  ROLLBACK: (name: string, rollbackId: string) =>
    `${byId(API_PATHS.APPLICATIONS, name)}/rollbacks/${seg(rollbackId)}`,
} as const;

export const SESSION_PATHS = {
  LIST: 'auth/sessions',
  QUERY_USER: 'user',
  SELF: 'auth/sessions/self',
  BY_NAME: (name: string) => byId('auth/sessions', name),
} as const;

export const AUTH_PATHS = {
  LOGIN: {
    START: 'auth/login/start',
    FINISH: 'auth/login/finish',
  },
  REGISTER: {
    START: 'auth/register/start',
  },
  CONFIG: 'auth/config',
  LOGOUT: 'auth/logout',
  PASSKEYS: {
    ROOT: 'auth/passkeys',
    BY_CREDENTIAL: (credentialId: string) => byId('auth/passkeys', credentialId),
    ENROLL_LINK: 'auth/passkeys/enroll-link',
  },
  OIDC: {
    GOOGLE_CALLBACK: 'auth/oidc/google/callback',
    GOOGLE_NONCE: 'auth/oidc/google/nonce',
    CONFIG: 'auth/oidc/config',
  },
  PERMISSIONS: 'auth/permissions',
  CLEANUP: {
    DELETE_USER: (id: string) => byId('auth/users', id),
    DELETE_GROUP: (id: string) => byId('auth/groups', id),
    DELETE_ACCESS_ROLE: (id: string) => byId('auth/accessroles', id),
  },
} as const;

export const CATEGORY_PATHS = {
  QUERY_SCOPE: 'scope',
} as const;

export const PROTECTION_PLAN_PATHS = {
  PREPARE: `${API_PATHS.PROTECTION_PLANS}/prepare`,
  ACTION: (id: string, action: string) => `${byId(API_PATHS.PROTECTION_PLANS, id)}/${action}`,
  ACTIONS: {
    CANCEL: 'cancel',
    CLEAR: 'clear',
    STATUS: 'status',
    VIOLATIONS: 'violations',
    DUPLICATE: 'duplicate',
    REACTIVATE: 'reactivate',
    DECISION: 'decision',
    REVISE: 'revise',
    REPORTS: 'reports',
    REPORTS_DOWNLOAD: 'reports/download',
  },
} as const;
