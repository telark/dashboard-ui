import { useCallback, useMemo, useState } from 'react';
import { ACTION_PERMISSIONS, usePermission } from '../../../auth/hooks';
import { useProtectionPlans } from '../../../plans/protection/hooks/useProtectionPlans';
import type { Application, ApplicationCoverage } from '../models';
import { buildCoverageIndex, getApplicationCoverage } from '../utils/coverage';

const { view: viewPlans } = ACTION_PERMISSIONS.protectionPlans;

// undefined = the viewer may not read plans: the card hides the section rather
// than claim the application is not covered.
export const useApplicationCoverage = (): ((
  application: Application,
) => ApplicationCoverage | undefined) => {
  const canViewPlans = usePermission(viewPlans.scope, viewPlans.level, viewPlans.deny);
  const { plans } = useProtectionPlans(canViewPlans);
  const [mountedPlans] = useState(plans);
  const index = useMemo(() => buildCoverageIndex(plans), [plans]);
  // Known once the list holds plans or a fulfilled fetch replaced the list this page
  // mounted with; a poll's pending/rejected never touch the list, so it never flickers.
  const known = plans.length > 0 || plans !== mountedPlans;
  return useCallback(
    (application: Application) =>
      canViewPlans ? { known, ...getApplicationCoverage(index, application) } : undefined,
    [canViewPlans, index, known],
  );
};
