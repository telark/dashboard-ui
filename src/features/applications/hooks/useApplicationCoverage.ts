import { useCallback, useMemo, useState } from 'react';
import { ACTION_PERMISSIONS, usePermission } from '../../auth/hooks';
import { useProtectionPlans } from '../../plans/protection/hooks/useProtectionPlans';
import type { Application, ApplicationCoverage } from '../models';
import { APPLICATION_COVERAGE_STATES } from '../constants/coverage';
import { buildCoverageIndex, getApplicationCoverage } from '../utils/coverage';

const { view: viewPlans } = ACTION_PERMISSIONS.protectionPlans;
const NO_PLANS_ACCESS: ApplicationCoverage = {
  known: true,
  enforcing: [],
  auditing: [],
  upcoming: [],
  noAccess: true,
};

const sameNames = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((name, i) => name === b[i]);

const sameCoverage = (a: ApplicationCoverage, b: ApplicationCoverage): boolean =>
  a.known === b.known && APPLICATION_COVERAGE_STATES.every((s) => sameNames(a[s], b[s]));

export const useApplicationCoverage = (): ((application: Application) => ApplicationCoverage) => {
  const canViewPlans = usePermission(viewPlans.scope, viewPlans.level, viewPlans.deny);
  const { plans, loaded } = useProtectionPlans(canViewPlans);
  const index = useMemo(() => buildCoverageIndex(plans), [plans]);
  // Known once the list holds plans (persisted ones count) or a fetch has landed, even an
  // empty one; `loaded` never turns back to false, so a poll never flickers.
  const known = plans.length > 0 || loaded;
  // The previous coverage per app, returned again while equal, so a plans poll that changes
  // nothing leaves every memoized card alone.
  const [previous] = useState(() => new Map<string, ApplicationCoverage>());
  return useCallback(
    (application: Application) => {
      if (!canViewPlans) return NO_PLANS_ACCESS;
      const next = { known, ...getApplicationCoverage(index, application) };
      const prev = previous.get(application.name);
      if (prev && sameCoverage(prev, next)) return prev;
      previous.set(application.name, next);
      return next;
    },
    [canViewPlans, index, known, previous],
  );
};
