import type { PlanMode, PlanPhase } from '../../plans/protection/models';
import type { ApplicationCoverageState } from '../models';

// Only active plans have policies deployed, and only Enforce refuses; scheduled and
// pending-approval plans will deploy later. Every other phase never covers.
export const APPLICATION_COVERAGE_BY_PHASE: Partial<
  Record<PlanPhase, Record<PlanMode, ApplicationCoverageState>>
> = {
  active: { enforce: 'enforcing', audit: 'auditing' },
  scheduled: { enforce: 'upcoming', audit: 'upcoming' },
  pending_approval: { enforce: 'upcoming', audit: 'upcoming' },
};

// Strongest first: one enforcing plan is enough for the app to read as protected.
export const APPLICATION_COVERAGE_STATES: ApplicationCoverageState[] = [
  'enforcing',
  'auditing',
  'upcoming',
];
