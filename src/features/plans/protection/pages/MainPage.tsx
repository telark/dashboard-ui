import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProtectionPlans } from '../hooks/useProtectionPlans';
import { usePlanPanelState } from '../hooks/usePlanPanelState';
import CreatePlanPanel from '../components/panels/CreatePlanPanel';
import ProtectionPlansTabs, { readPlansPageTab } from '../components/layout/ProtectionPlansTabs';
import { CATEGORIES_CONSTANTS as CC } from '../../../access-and-permissions/categories/constants';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import { NoPermissionCard, PageContainer } from '../../../../components/shared';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { PlansPageTab, PlanViewMode } from '../models';
import ProtectionPlansListPage from './ProtectionPlansListPage';
import ProtectionPlanReportsPage from './ProtectionPlanReportsPage';
import PlanTaxonomyPage from './PlanTaxonomyPage';

const { viewReports } = ACTION_PERMISSIONS.protectionPlans;

const MainPage: React.FC = () => {
  const { plans, loaded, error, refetch } = useProtectionPlans();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<PlanViewMode>('plans');
  const { createPanelOpen, createForm, openCreatePanel, closeCreatePanel } = usePlanPanelState();
  const canViewReports = usePermission(viewReports.scope, viewReports.level, viewReports.deny);
  const [searchParams] = useSearchParams();
  const tab: PlansPageTab = readPlansPageTab(searchParams);
  // Each tab stays mounted after its first visit: remounting 40+ plan cards or the
  // reports table on every switch blocked the main thread for ~1 s. The tabs element
  // is stable so a switch does not re-render the hidden page.
  const [visited, setVisited] = useState<Set<PlansPageTab>>(() => new Set([tab]));
  if (!visited.has(tab)) {
    setVisited(new Set(visited).add(tab));
  }
  const tabs = useMemo(() => <ProtectionPlansTabs />, []);

  let page: React.ReactNode;
  if (viewMode !== 'plans') {
    page = (
      <PlanTaxonomyPage
        scope={viewMode === 'environments' ? CC.SCOPES.PLAN_ENVIRONMENTS : CC.SCOPES.PLAN_TAGS}
        onBack={() => setViewMode('plans')}
      />
    );
  } else {
    page = (
      <>
        {visited.has('plans') ? (
          <div style={{ display: tab === 'plans' ? undefined : 'none' }}>
            <ProtectionPlansListPage
              plans={plans}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onCreatePlanClick={openCreatePanel}
              loading={!loaded}
              error={error}
              onRetry={refetch}
              onViewModeChange={setViewMode}
              tabs={tabs}
            />
          </div>
        ) : null}
        {visited.has('reports') ? (
          <div style={{ display: tab === 'reports' ? undefined : 'none' }}>
            {canViewReports ? (
              <ProtectionPlanReportsPage
                plans={plans}
                plansLoading={!loaded}
                plansError={error}
                onRetryPlans={refetch}
                tabs={tabs}
                active={tab === 'reports'}
              />
            ) : (
              <PageContainer
                title={PPC.LABELS.HEADER_TITLE}
                subtitle={PPC.LABELS.HEADER_SUBTITLE}
                gap={LIST_PAGE.CONTENT_GAP_PX}
              >
                {tabs}
                <NoPermissionCard featureName={PPC.LABELS.TABS.REPORTS} permission={viewReports} />
              </PageContainer>
            )}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      {page}
      <CreatePlanPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
    </>
  );
};

export default MainPage;
