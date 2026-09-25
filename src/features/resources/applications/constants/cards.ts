import { CARD_LAYOUT, CARD_MORE_LABEL, DEFAULT_COLORS } from '../../../../constants';
import type { ApplicationCoverageState, ApplicationViewMode } from '../models';

export const APPLICATION_VIEW_MODES: { key: ApplicationViewMode; label: string }[] = [
  { key: 'grid', label: `Grid · ${CARD_LAYOUT.CARDS_PER_ROW} per row` },
  { key: 'list', label: 'List · 1 per row' },
];

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
  VIEW_MODE_LABEL: 'View',
  STATS: {
    INCIDENTS: 'Incidents',
    RECOVERIES: 'Recoveries',
  },
  COVERAGE: {
    LABEL: 'Protected by',
    NONE: 'No protection plan covers this application',
    CHIP_TITLE: (plan: string, state: ApplicationCoverageState) =>
      `${plan} · ${COVERAGE_STATE_LABEL[state]}`,
  },
  MORE: CARD_MORE_LABEL,
  CREATED_PREFIX: 'created',
  UPDATED_PREFIX: 'updated',
} as const;
