import { useCallback, useMemo, useState } from 'react';
import { ACTION_PERMISSIONS, usePermission } from '../../auth/hooks';
import { useProtectionPlans } from '../../plans/protection/hooks/useProtectionPlans';
import type { Application, ApplicationCoverage } from '../models';
import { buildCoverageIndex, getApplicationCoverage } from '../utils/coverage';

const { view: viewPlans } = ACTION_PERMISSIONS.protectionPlans;
const NO_PLANS_ACCESS: ApplicationCoverage = {
  known: true,
  active: [],
  upcoming: [],
  noAccess: true,
};

const sameNames = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((name, i) => name === b[i]);

const sameCoverage = (a: ApplicationCoverage, b: ApplicationCoverage): boolean =>
  a.known === b.known && sameNames(a.active, b.active) && sameNames(a.upcoming, b.upcoming);

export const useApplicationCoverage = (): ((application: Application) => ApplicationCoverage) => {
  const canViewPlans = usePermission(viewPlans.scope, viewPlans.level, viewPlans.deny);
  const { plans } = useProtectionPlans(canViewPlans);
  const [mountedPlans] = useState(plans);
  const index = useMemo(() => buildCoverageIndex(plans), [plans]);
  // Known once the list holds plans or a fulfilled fetch replaced the list this page
  // mounted with; a poll's pending/rejected never touch the list, so it never flickers.
  const known = plans.length > 0 || plans !== mountedPlans;
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
