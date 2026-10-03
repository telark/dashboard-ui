import { DEFAULT_COLORS } from '../../../constants';
import type { ApplicationCoverageState } from '../models';

/** Card accents stay on DEFAULT_COLORS so ACCENT_TINT and getPillSurface can resolve them. */
export const APPLICATION_HEALTH_ACCENT: Record<string, string> = {
  healthy: DEFAULT_COLORS.SUCCESS,
  degraded: DEFAULT_COLORS.WARNING,
  down: DEFAULT_COLORS.DANGER,
};

export const APPLICATION_COVERAGE_ACCENT: Record<ApplicationCoverageState, string> = {
  active: DEFAULT_COLORS.SUCCESS,
  upcoming: DEFAULT_COLORS.WARNING,
};

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
