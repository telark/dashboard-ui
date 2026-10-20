import type { ProtectionPlan } from '../../plans/protection/models';
import type {
  Application,
  ApplicationCoverage,
  ApplicationCoverageIndex,
  ApplicationCoverageState,
  ApplicationProtection,
} from '../models';
import { APPLICATION_COVERAGE_BY_PHASE, APPLICATION_COVERAGE_STATES } from '../constants/coverage';

const coverageState = (plan: ProtectionPlan): ApplicationCoverageState | undefined =>
  APPLICATION_COVERAGE_BY_PHASE[plan.phase]?.[plan.mode];

const append = (map: Map<string, ProtectionPlan[]>, key: string, plan: ProtectionPlan): void => {
  const list = map.get(key);
  if (list) list.push(plan);
  else map.set(key, [plan]);
};

// Built once per plan-list change, so each card costs one lookup per namespace
// instead of a scan of every plan's scope (2,000 ids per plan at scale).
export const buildCoverageIndex = (plans: ProtectionPlan[]): ApplicationCoverageIndex => {
  const index: ApplicationCoverageIndex = { byApplication: new Map(), byNamespace: new Map() };
  plans
    .filter((plan) => coverageState(plan) !== undefined)
    .forEach((plan) => {
      const byNamespace = plan.scope.type === 'namespaces';
      const keys = (byNamespace ? plan.scope.namespaces : plan.scope.applicationRefs) ?? [];
      const target = byNamespace ? index.byNamespace : index.byApplication;
      keys.forEach((key) => append(target, key, plan));
    });
  return index;
};

// Scope, phase and mode only: excluding kinds or resources narrows what a plan
// blocks, never whether the application is in its scope.
export const getApplicationCoverage = (
  index: ApplicationCoverageIndex,
  application: Pick<Application, 'name' | 'namespaces'>,
): Omit<ApplicationCoverage, 'known'> => {
  const plans = [
    ...(index.byApplication.get(application.name) ?? []),
    ...(application.namespaces?.items ?? []).flatMap((ns) => index.byNamespace.get(ns.name) ?? []),
  ];
  const namesIn = (state: ApplicationCoverageState): string[] =>
    [
      ...new Set(plans.filter((plan) => coverageState(plan) === state).map((plan) => plan.name)),
    ].sort((a, b) => a.localeCompare(b));
  return {
    enforcing: namesIn('enforcing'),
    auditing: namesIn('auditing'),
    upcoming: namesIn('upcoming'),
  };
};

export const getApplicationProtection = (coverage: ApplicationCoverage): ApplicationProtection =>
  APPLICATION_COVERAGE_STATES.find((state) => coverage[state].length > 0) ?? 'none';
