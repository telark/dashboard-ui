import type { PlanPhase } from '../../plans/protection/models';
import type { ApplicationCoverageState } from '../models';

// Only active plans have policies deployed; scheduled and pending-approval plans will. Every other phase never covers.
export const APPLICATION_COVERAGE_BY_PHASE: Partial<Record<PlanPhase, ApplicationCoverageState>> = {
  active: 'active',
  scheduled: 'upcoming',
  pending_approval: 'upcoming',
};
