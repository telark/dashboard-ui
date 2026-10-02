import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { APP_ROUTES, HEADER_LAYOUT } from '../../../constants';
import { PageContainer } from '../../../components/shared';
import FullPageLoader from '../../../components/display/views/FullPageLoader';
import { LIST_PAGE } from '../../../constants/shared/pages';
import { ACTION_PERMISSIONS, usePermission } from '../../auth/hooks/permissions/permissionEngine';
import { selectPermissionsReady } from '../../auth/store/selectors/permissionsSelectors';
import { filterByExcludedNamespaces } from '../../applications/utils/management/state';
import {
  selectProtectionPlans,
  selectProtectionPlansError,
  selectProtectionPlansLoaded,
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
import type { NoAccess } from '../models';

// Equal-width columns and fixed-height rows: every box is the same size wherever it lands.
// min() keeps a single column from overflowing on screens narrower than one track.
const gridStyle = (rowHeightPx: number): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(min(${L.BOX_MIN_WIDTH_PX}px, 100%), 1fr))`,
  gridAutoRows: rowHeightPx,
  gap: L.GRID_GAP_PX,
});

const { view: viewApplications, viewSnapshots } = ACTION_PERMISSIONS.applications;
const { view: viewPlans } = ACTION_PERMISSIONS.protectionPlans;
const { view: viewSettings } = ACTION_PERMISSIONS.settings;
const APPS_NO_ACCESS: NoAccess = {
  featureName: T.APPLICATIONS.TITLE,
  permission: viewApplications,
};
const PLANS_NO_ACCESS: NoAccess = { featureName: T.PLANS.TITLE, permission: viewPlans };
const SNAPSHOTS_NO_ACCESS: NoAccess = { featureName: T.STORAGE.TITLE, permission: viewSnapshots };
const CLUSTER_NO_ACCESS: NoAccess = { featureName: T.CLUSTER.TITLE, permission: viewSettings };

const Dashboard: React.FC = () => {
  const permissionsReady = useSelector(selectPermissionsReady);
  const canViewApplications = usePermission(viewApplications.scope, viewApplications.level);
  const canViewPlans = usePermission(viewPlans.scope, viewPlans.level, viewPlans.deny);
  const canViewSnapshots = usePermission(
    viewSnapshots.scope,
    viewSnapshots.level,
    viewSnapshots.deny,
  );
  const canViewSettings = usePermission(viewSettings.scope, viewSettings.level);
  const storage = useDashboardData({ canViewApplications, canViewPlans, canViewSnapshots });

  const applications = useSelector((s: RootState) => s.applications.applications);
  const appsLoaded = useSelector((s: RootState) => s.applications.loaded);
  const appsError = useSelector((s: RootState) => s.applications.error);
  const excludedNamespaces = useSelector((s: RootState) => s.globalconfig.data?.excludedNamespaces);
  const clusterVersion = useSelector((s: RootState) => s.globalconfig.data?.cluster?.version);
  const globalConfigState = useSelector(selectGlobalConfigState);
  const plans = useSelector(selectProtectionPlans);
  const plansLoaded = useSelector(selectProtectionPlansLoaded);
  const plansError = useSelector(selectProtectionPlansError);

  const apps = useMemo(
    () => filterByExcludedNamespaces(applications, excludedNamespaces ?? []),
    [applications, excludedNamespaces],
  );
  const appsView = useMemo(() => {
    const summary = summarizeApplications(apps);
    return {
      state: canViewApplications
        ? toBoxState(!appsLoaded, appsError, apps.length > 0)
        : { noAccess: APPS_NO_ACCESS },
      total: summary.total,
      breakdown: applicationsBreakdown(summary),
      recentRows: recentlyChangedApplications(apps).map(recentChangeRow),
      activity: changeActivityData(apps),
    };
  }, [apps, appsLoaded, appsError, canViewApplications]);
  const plansView = useMemo(() => {
    const summary = summarizePlans(plans);
    return {
      state: canViewPlans
        ? toBoxState(!plansLoaded, plansError, plans.length > 0)
        : { noAccess: PLANS_NO_ACCESS },
      total: summary.total,
      breakdown: plansBreakdown(summary),
      attentionRows: plansNeedingAttention(plans).map(planAttentionRow),
      activity: planActivityData(plans),
    };
  }, [plans, plansLoaded, plansError, canViewPlans]);

  if (!permissionsReady) return <FullPageLoader minHeight={HEADER_LAYOUT.MIN_HEIGHT} />;

  return (
    <PageContainer title={T.TITLE} subtitle={T.SUBTITLE} gap={LIST_PAGE.CONTENT_GAP_PX}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: L.GRID_GAP_PX }}>
        <div style={gridStyle(L.BOX_HEIGHT_PX)}>
          <ClusterBox
            cluster={parseClusterVersion(clusterVersion)}
            loading={globalConfigState.loading && !clusterVersion}
            failed={Boolean(globalConfigState.error) && !clusterVersion}
            noAccess={canViewSettings ? undefined : CLUSTER_NO_ACCESS}
          />
          <SummaryBox
            title={T.APPLICATIONS.TITLE}
            viewAllTo={APP_ROUTES.APPLICATIONS}
            value={appsView.total}
            breakdown={appsView.breakdown}
            {...appsView.state}
          />
          <SummaryBox
            title={T.PLANS.TITLE}
            viewAllTo={APP_ROUTES.PROTECTION_PLANS}
            value={plansView.total}
            breakdown={plansView.breakdown}
            {...plansView.state}
          />
          <StorageBox
            storage={storage}
            noAccess={canViewSnapshots ? undefined : SNAPSHOTS_NO_ACCESS}
          />
          <ListBox
            title={T.PLANS_ATTENTION.TITLE}
            viewAllTo={APP_ROUTES.PROTECTION_PLANS}
            rows={plansView.attentionRows}
            emptyText={T.PLANS_ATTENTION.EMPTY}
            {...plansView.state}
          />
          <ListBox
            title={T.RECENT_CHANGES.TITLE}
            viewAllTo={APP_ROUTES.APPLICATIONS}
            rows={appsView.recentRows}
            emptyText={T.RECENT_CHANGES.EMPTY}
            {...appsView.state}
          />
        </div>
        <div style={{ display: 'grid', gridAutoRows: C.ROW_HEIGHT_PX, gap: L.GRID_GAP_PX }}>
          <ChartBox
            title={CT.CHANGE_ACTIVITY.TITLE}
            isEmpty={appsView.activity.data.length === 0}
            emptyText={CT.CHANGE_ACTIVITY.EMPTY}
            {...appsView.state}
          >
            <ActivityChart {...appsView.activity} />
          </ChartBox>
          <ChartBox
            title={CT.PLAN_ACTIVITY.TITLE}
            isEmpty={plansView.activity.data.length === 0}
            emptyText={CT.PLAN_ACTIVITY.EMPTY}
            {...plansView.state}
          >
            <ActivityChart {...plansView.activity} />
          </ChartBox>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
