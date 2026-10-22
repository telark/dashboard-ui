import type { CSSProperties } from 'react';
import { DEFAULT_COLORS, STATUS_COLORS, TRUNCATE_STYLE } from '../../../constants';
import type { CountLabel } from '../../../interfaces/layout/toolbar';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../plans/protection/constants/protectionPlans';
import type { ApplicationCoverageState, ApplicationProtection } from '../models';

// A covering plan's mode in the plan form's words. A pending plan's mode is not in the coverage.
const COVERAGE_STATE_LABEL: Record<ApplicationCoverageState, string> = {
  enforcing: PPC.LABELS.MODE_LABELS.enforce,
  auditing: PPC.LABELS.MODE_LABELS.audit,
  upcoming: 'Not started',
};

const MORE_PLANS: CountLabel = { one: 'more plan', other: 'more plans' };

const countOf = (count: number, label: CountLabel): string =>
  `${count} ${count === 1 ? label.one : label.other}`;

export const APPLICATION_CARD = {
  STATS: {
    RESOURCES: { one: 'resource', other: 'resources' } as CountLabel,
    INCIDENTS: { one: 'incident', other: 'incidents' } as CountLabel,
    RECOVERIES: { one: 'recovery', other: 'recoveries' } as CountLabel,
    COUNT: countOf,
    SEPARATOR: ' · ',
  },
  // Discovery's value when no resource carries a managed-by label: the card shows nothing then.
  MANAGED_BY_UNKNOWN: 'unknown',
  MANAGED_BY_TITLE: (by: string) => `Managed by ${by}`,
  COVERAGE: {
    LABEL: 'Protection',
    NO_ACCESS: 'No access',
    CHIP: (plan: string, state: ApplicationCoverageState) =>
      `${plan} · ${COVERAGE_STATE_LABEL[state]}`,
    NOT_STARTED_AFTER_NAME: `· ${COVERAGE_STATE_LABEL.upcoming}`,
    NO_PLAN: 'No plan covers this app',
    PLAN_LABEL: 'Plan',
    MORE_PLANS: (count: number) => `+${countOf(count, MORE_PLANS)}`,
    MORE_PLANS_LABEL: (plans: string) => `Also covered by ${plans}`,
    BADGE: {
      enforcing: 'Protected',
      auditing: 'Auditing only',
      upcoming: 'Plan pending',
      none: 'Unprotected',
    } as Record<ApplicationProtection, string>,
    PROTECT: 'Protect app',
  },
  // The Protect app button fits the protection line, so every card's line keeps one height.
  PROTECT_BUTTON_HEIGHT_PX: 22,
  ACTIONS_LABEL: (name: string) => `Actions for ${name}`,
  // Health states that keep a filled pill; the rest are a dot and muted text.
  LOUD_HEALTH: ['degraded', 'down'] as readonly string[],
  HEALTH_LABELS: {
    healthy: 'Healthy',
    degraded: 'Degraded',
    down: 'Down',
    unknown: 'Unknown',
  } as Readonly<Record<string, string>>,
  HEALTH_DOT_PX: 6,
  // Centers the corner (badge, health, 30px menu) on the 18px name line: (30 - 18) / 2.
  CORNER_OFFSET_PX: -6,
  UPDATED_PREFIX: 'Updated',
  CREATED_PREFIX: 'Created',
} as const;

// A covering plan's name, linked: the cards and the detail summary share this look.
export const PLAN_LINK_STYLE: CSSProperties = {
  ...TRUNCATE_STYLE,
  flex: '0 1 auto',
  color: DEFAULT_COLORS.TEXT_SECONDARY,
  textDecoration: 'underline',
  textDecorationColor: DEFAULT_COLORS.BORDER_HOVER,
  textUnderlineOffset: 2,
};

// Red can't be text on the dark page (3.6:1), so an incident count is white beside this dot.
export const INCIDENT_DOT_STYLE: CSSProperties = {
  display: 'inline-block',
  width: 6,
  height: 6,
  marginRight: 5,
  borderRadius: '50%',
  verticalAlign: 'middle',
  background: STATUS_COLORS.APPLICATION_CHANGE.incident,
};
