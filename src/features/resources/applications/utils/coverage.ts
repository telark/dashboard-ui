import type { ProtectionPlan } from '../../../plans/protection/models';
import type {
  Application,
  ApplicationCoverage,
  ApplicationCoverageIndex,
  ApplicationCoverageState,
} from '../models';
import { APPLICATION_COVERAGE_BY_PHASE } from '../constants/coverage';

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
    .filter((plan) => APPLICATION_COVERAGE_BY_PHASE[plan.phase] !== undefined)
    .forEach((plan) => {
      const byNamespace = plan.scope.type === 'namespaces';
      const keys = (byNamespace ? plan.scope.namespaces : plan.scope.applicationRefs) ?? [];
      const target = byNamespace ? index.byNamespace : index.byApplication;
      keys.forEach((key) => append(target, key, plan));
    });
  return index;
};

// Scope and phase only: excluding kinds or resources narrows what a plan
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
      ...new Set(
        plans
          .filter((plan) => APPLICATION_COVERAGE_BY_PHASE[plan.phase] === state)
          .map((plan) => plan.name),
      ),
    ].sort((a, b) => a.localeCompare(b));
  return { active: namesIn('active'), upcoming: namesIn('upcoming') };
};
