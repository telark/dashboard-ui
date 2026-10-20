import type { ApplicationCoverageState, ApplicationProtection } from '../models';

const COVERAGE_STATE_LABEL: Record<ApplicationCoverageState, string> = {
  enforcing: 'enforcing',
  auditing: 'auditing',
  upcoming: 'not started',
};

export const APPLICATION_CARD = {
  STATS: {
    INCIDENTS: 'Incidents',
    RECOVERIES: 'Recoveries',
  },
  COVERAGE: {
    LABEL: 'Protection',
    NONE: 'No plan covers this app.',
    NO_ACCESS: 'No access',
    CHIP: (plan: string, state: ApplicationCoverageState) =>
      `${plan} · ${COVERAGE_STATE_LABEL[state]}`,
    BADGE: {
      enforcing: 'Protected',
      auditing: 'Auditing only',
      upcoming: 'Not protected yet',
      none: 'Not protected',
    } as Record<ApplicationProtection, string>,
    PROTECT: 'Protect',
  },
  NAMESPACES_LABEL: (count: number) => (count === 1 ? 'Namespace' : 'Namespaces'),
  CREATED_PREFIX: 'created',
  UPDATED_PREFIX: 'updated',
} as const;
