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
import { selectGlobalConfigState } from '../../globalconfig/store';
import {
  HOME_CHART_LAYOUT as C,
  HOME_CHART_TEXTS as CT,
  HOME_DASHBOARD_LAYOUT as L,
  HOME_DASHBOARD_TEXTS as T,
} from '../constants/dashboard';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  plansNeedingAttention,
  recentlyChangedApplications,
  summarizeApplications,
  summarizePlans,
  toBoxState,
} from '../utils/summary';
import {
  applicationsBreakdown,
  planAttentionRow,
  plansBreakdown,
  recentChangeRow,
} from '../utils/rows';
import { changeActivityData, planActivityData } from '../utils/charts';
import { parseClusterVersion } from '../utils/cluster';
import { ChartBox, ClusterBox, ListBox, StorageBox, SummaryBox } from '../components';
import ActivityChart from '../components/charts/ActivityChart';

// Equal-width columns and fixed-height rows: every box is the same size wherever it lands.
// min() keeps a single column from overflowing on screens narrower than one track.
const gridStyle = (rowHeightPx: number): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(min(${L.BOX_MIN_WIDTH_PX}px, 100%), 1fr))`,
  gridAutoRows: rowHeightPx,
  gap: L.GRID_GAP_PX,
});

const { viewSnapshots } = ACTION_PERMISSIONS.applications;
const { view: viewPlans } = ACTION_PERMISSIONS.protectionPlans;

const Dashboard: React.FC = () => {
  const permissionsReady = useSelector(selectPermissionsReady);
  const canViewApplications = usePermission('applications', 'ReadOnly');
  const canViewPlans = usePermission(viewPlans.scope, viewPlans.level, viewPlans.deny);
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
  const clusterVersion = useSelector((s: RootState) => s.globalconfig.data?.cluster?.version);
  const globalConfigState = useSelector(selectGlobalConfigState);
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
      recentRows: recentlyChangedApplications(apps).map(recentChangeRow),
      activity: changeActivityData(apps),
    };
  }, [apps, appsLoading, appsError]);
  const plansView = useMemo(() => {
    const summary = summarizePlans(plans);
    return {
      state: toBoxState(plansLoading, plansError, plans.length > 0),
      total: summary.total,
      breakdown: plansBreakdown(summary),
      attentionRows: plansNeedingAttention(plans).map(planAttentionRow),
      activity: planActivityData(plans),
    };
  }, [plans, plansLoading, plansError]);

  if (!permissionsReady) return <FullPageLoader minHeight="100vh" />;

  return (
    <PageContainer title={T.TITLE} subtitle={T.SUBTITLE} gap={LIST_PAGE.CONTENT_GAP_PX}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: L.GRID_GAP_PX }}>
        <div style={gridStyle(L.BOX_HEIGHT_PX)}>
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
          <ClusterBox
            cluster={parseClusterVersion(clusterVersion)}
            loading={globalConfigState.loading && !clusterVersion}
            failed={Boolean(globalConfigState.error) && !clusterVersion}
          />
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
        <div style={{ display: 'grid', gridAutoRows: C.ROW_HEIGHT_PX, gap: L.GRID_GAP_PX }}>
          {canViewApplications && (
            <ChartBox
              title={CT.CHANGE_ACTIVITY.TITLE}
              isEmpty={appsView.activity.data.length === 0}
              emptyText={CT.CHANGE_ACTIVITY.EMPTY}
              {...appsView.state}
            >
              <ActivityChart {...appsView.activity} />
            </ChartBox>
          )}
          {canViewPlans && (
            <ChartBox
              title={CT.PLAN_ACTIVITY.TITLE}
              isEmpty={plansView.activity.data.length === 0}
              emptyText={CT.PLAN_ACTIVITY.EMPTY}
              {...plansView.state}
            >
              <ActivityChart {...plansView.activity} />
            </ChartBox>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
