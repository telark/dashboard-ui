import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { APP_ROUTES } from '../../../constants';
import { PageContainer } from '../../../components/shared';
import FullPageLoader from '../../../components/display/views/FullPageLoader';
import { LIST_PAGE } from '../../../constants/shared/pages';
import { ACTION_PERMISSIONS, usePermission } from '../../auth/hooks/permissions/permissionEngine';
import { selectPermissionsReady } from '../../auth/store/selectors/permissionsSelectors';
import { filterByExcludedNamespaces } from '../../resources/applications/utils/management/state';
import {
  selectProtectionPlans,
  selectProtectionPlansError,
  selectProtectionPlansLoading,
} from '../../plans/protection/store';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_TEXTS as T } from '../constants/dashboard';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  applicationsNeedingAttention,
  plansNeedingAttention,
  recentlyChangedApplications,
  summarizeApplications,
  summarizePlans,
  toBoxState,
} from '../utils/summary';
import {
  applicationAttentionRow,
  applicationsBreakdown,
  planAttentionRow,
  plansBreakdown,
  recentChangeRow,
} from '../utils/rows';
import { ListBox, StorageBox, SummaryBox } from '../components';

// Equal-width columns and fixed-height rows: every box is the same size wherever it lands.
// min() keeps a single column from overflowing on screens narrower than one track.
const GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(min(${L.BOX_MIN_WIDTH_PX}px, 100%), 1fr))`,
  gridAutoRows: L.BOX_HEIGHT_PX,
  gap: L.GRID_GAP_PX,
};

const { viewSnapshots } = ACTION_PERMISSIONS.applications;

const Dashboard: React.FC = () => {
  const permissionsReady = useSelector(selectPermissionsReady);
  const canViewApplications = usePermission('applications', 'ReadOnly');
  const canViewPlans = usePermission('protection-plans', 'ReadOnly');
  const canViewSnapshots = usePermission(
    viewSnapshots.scope,
    viewSnapshots.level,
    viewSnapshots.deny,
  );
  const storage = useDashboardData({ canViewApplications, canViewPlans, canViewSnapshots });

  const applications = useSelector((s: RootState) => s.applications.applications);
  const appsLoading = useSelector((s: RootState) => s.applications.loading);
  const appsError = useSelector((s: RootState) => s.applications.error);
  const excludedNamespaces = useSelector((s: RootState) => s.globalconfig.data?.excludedNamespaces);
  const plans = useSelector(selectProtectionPlans);
  const plansLoading = useSelector(selectProtectionPlansLoading);
  const plansError = useSelector(selectProtectionPlansError);

  const apps = useMemo(
    () => filterByExcludedNamespaces(applications, excludedNamespaces ?? []),
    [applications, excludedNamespaces],
  );
  const appsView = useMemo(() => {
    const summary = summarizeApplications(apps);
    return {
      state: toBoxState(appsLoading, appsError, apps.length > 0),
      total: summary.total,
      breakdown: applicationsBreakdown(summary),
      attentionRows: applicationsNeedingAttention(apps).map(applicationAttentionRow),
      recentRows: recentlyChangedApplications(apps).map(recentChangeRow),
    };
  }, [apps, appsLoading, appsError]);
  const plansView = useMemo(() => {
    const summary = summarizePlans(plans);
    return {
      state: toBoxState(plansLoading, plansError, plans.length > 0),
      total: summary.total,
      breakdown: plansBreakdown(summary),
      attentionRows: plansNeedingAttention(plans).map(planAttentionRow),
    };
  }, [plans, plansLoading, plansError]);

  if (!permissionsReady) return <FullPageLoader minHeight="100vh" />;

  return (
    <PageContainer title={T.TITLE} subtitle={T.SUBTITLE} gap={LIST_PAGE.CONTENT_GAP_PX}>
      <div style={GRID_STYLE}>
        {canViewApplications && (
          <SummaryBox
            title={T.APPLICATIONS.TITLE}
            viewAllTo={APP_ROUTES.APPLICATIONS}
            value={appsView.total}
            breakdown={appsView.breakdown}
            {...appsView.state}
          />
        )}
        {canViewPlans && (
          <SummaryBox
            title={T.PLANS.TITLE}
            viewAllTo={APP_ROUTES.PROTECTION_PLANS}
            value={plansView.total}
            breakdown={plansView.breakdown}
            {...plansView.state}
          />
        )}
        {canViewSnapshots && <StorageBox storage={storage} />}
        {canViewApplications && (
          <ListBox
            title={T.APPLICATIONS_ATTENTION.TITLE}
            viewAllTo={APP_ROUTES.APPLICATIONS}
            rows={appsView.attentionRows}
            emptyText={T.APPLICATIONS_ATTENTION.EMPTY}
            {...appsView.state}
          />
        )}
        {canViewPlans && (
          <ListBox
            title={T.PLANS_ATTENTION.TITLE}
            viewAllTo={APP_ROUTES.PROTECTION_PLANS}
            rows={plansView.attentionRows}
            emptyText={T.PLANS_ATTENTION.EMPTY}
            {...plansView.state}
          />
        )}
        {canViewApplications && (
          <ListBox
            title={T.RECENT_CHANGES.TITLE}
            viewAllTo={APP_ROUTES.APPLICATIONS}
            rows={appsView.recentRows}
            emptyText={T.RECENT_CHANGES.EMPTY}
            {...appsView.state}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
