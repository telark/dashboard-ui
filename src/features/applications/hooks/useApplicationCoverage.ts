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

export const useApplicationCoverage = (): ((application: Application) => ApplicationCoverage) => {
  const canViewPlans = usePermission(viewPlans.scope, viewPlans.level, viewPlans.deny);
  const { plans } = useProtectionPlans(canViewPlans);
  const [mountedPlans] = useState(plans);
  const index = useMemo(() => buildCoverageIndex(plans), [plans]);
  // Known once the list holds plans or a fulfilled fetch replaced the list this page
  // mounted with; a poll's pending/rejected never touch the list, so it never flickers.
  const known = plans.length > 0 || plans !== mountedPlans;
  return useCallback(
    (application: Application) =>
      canViewPlans ? { known, ...getApplicationCoverage(index, application) } : NO_PLANS_ACCESS,
    [canViewPlans, index, known],
  );
};
