import type { ApplicationCoverageState } from '../models';

const COVERAGE_STATE_LABEL: Record<ApplicationCoverageState, string> = {
  active: 'enforcing now',
  upcoming: 'scheduled or awaiting approval',
};

export const APPLICATION_CARD = {
  STATS: {
    INCIDENTS: 'Incidents',
    RECOVERIES: 'Recoveries',
  },
  COVERAGE: {
    LABEL: 'Protected by',
    NONE: 'No protection plan covers this application',
    NO_ACCESS: 'No access',
    CHIP_TITLE: (plan: string, state: ApplicationCoverageState) =>
      `${plan} · ${COVERAGE_STATE_LABEL[state]}`,
  },
  NAMESPACES_LABEL: (count: number) => (count === 1 ? 'Namespace' : 'Namespaces'),
  CREATED_PREFIX: 'created',
  UPDATED_PREFIX: 'updated',
} as const;
